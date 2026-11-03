#!/usr/bin/env python3
"""Recherche hors ligne dans l'index cPanel et les capacités. Python stdlib uniquement."""
import argparse
import json
import re
import unicodedata
from pathlib import Path

REF = Path(__file__).resolve().parents[1] / "references"

def normalize(value):
    return "".join(c for c in unicodedata.normalize("NFKD", str(value).lower()) if not unicodedata.combining(c))

def tokens(value):
    return set(re.findall(r"[a-z0-9]+", normalize(value)))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("query", nargs="*")
    parser.add_argument("--section")
    parser.add_argument("--all", action="store_true")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    catalog = json.loads((REF / "cpanel-catalog.json").read_text(encoding="utf-8"))
    caps = json.loads((REF / "capabilities.json").read_text(encoding="utf-8"))
    if args.section:
        selected = [s for s in catalog["sections"] if normalize(args.section) in normalize(s["id"]+" "+s["title"])]
        if not selected:
            parser.error("Rubrique inconnue")
        result = {"sections": selected}
    elif args.all or not args.query:
        result = {"sections": catalog["sections"]}
    else:
        q = " ".join(args.query)
        synonyms = {"cache":"redis memcached litespeed varnish","nextjs":"nodejs passenger next_ssr","postgres":"postgresql postgis pgvector","security":"securite modsecurity tigerprotect","deploy":"nodejs git ssh cron","ssl":"letsencrypt https","queue":"redis_queue workers","docker":"root ssh"}
        words = tokens(q)
        words.update(*(tokens(synonyms[w]) for w in list(words) if w in synonyms))
        def score(item):
            title = normalize(item.get("id","")+" "+item.get("name",""))
            body = normalize(json.dumps(item, ensure_ascii=False))
            return (100 if normalize(q) == normalize(item.get("id","")) else 0) + 15*len(words & tokens(title)) + 2*len(words & tokens(body))
        ts = [dict(t,section=s["title"]) for s in catalog["sections"] for t in s["tools"]]
        result = {"query":q,"notice":"documenté n'est pas activé sur le compte","tools":sorted((t for t in ts if score(t)>0),key=score,reverse=True)[:8],"capabilities":sorted((c for c in caps["capabilities"] if score(c)>0),key=score,reverse=True)[:8]}
    if args.json:
        print(json.dumps(result,ensure_ascii=False,indent=2))
    elif "sections" in result:
        for s in result["sections"]:
            print("\n## "+s["title"])
            for t in s["tools"]:
                print(" - "+t["name"]+": "+t["url"])
    else:
        for c in result["capabilities"]:
            print("["+c["status"]+"] "+c["id"]+": "+c["verdict"]+" ("+c["official_sources"][0]+")")
        for t in result["tools"]:
            print(t["section"]+" > "+t["name"]+": "+t["url"])
        if not result["tools"] and not result["capabilities"]:
            print("Aucune preuve locale; consulter la FAQ officielle et le support avant de conclure.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
