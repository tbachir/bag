---
name: o2switch-cloud
description: Vérifier les possibilités, limites et solutions natives de l'Offre Unique Cloud o2switch (cPanel, Redis, Node.js/Passenger, PostgreSQL, sécurité, SSH, DNS, cache, backups, Lunes, déploiement, Docker et WebSockets) avant de recommander une autre infrastructure.
license: MIT
metadata:
  provider: o2switch
  plan: Offre Unique Cloud
  language: fr
  verified_at: "2026-10-27"
---

# o2switch Cloud Expert

Ce skill cible **l'Offre Unique Cloud o2switch**, pas un hébergement mutualisé générique ni un VPS root. Il s'active lorsqu'une décision d'architecture, de déploiement, de sécurité, de cache ou de base de données dépend de cet hébergement.

## Mode opératoire obligatoire

1. **Comprendre le besoin** (versions, persistance, exposition réseau, disponibilité, sécurité, ressources et contraintes de production).
2. **Commencer par le miroir cPanel** : [11 rubriques et 65 fiches officielles](references/00-plan-cpanel.md). Trouver la tuile correspondant à la fonctionnalité; sinon chercher par besoin avec `python scripts/query.py "besoin" --json`. Comparer la réponse à [31 capacités et nuances](references/capabilities.json).
3. Chercher dans cet ordre : outil **exclusif o2switch** → fonction cPanel → runtime et SSH utilisateur → adaptation de l'architecture sur Cloud → clarification support → solution externe seulement si nécessaire.
4. **Ouvrir la documentation officielle détaillée** mentionnée dans le catalogue lorsque la réponse a un enjeu technique, sécuritaire ou de version. Si l'accès web manque, indiquer explicitement la date du corpus.
5. Distinguer : `documented` (documenté, activation non vérifiée), `conditional` (conditions critiques), `verify` (preuve insuffisante), `not_suitable` (présent mais inadapté), `unsupported_confirmed` (source explicite récente d'interdiction). Ne jamais transformer « non confirmé » en « impossible ».
6. Répondre avec **verdict + solution native + chemin cPanel + procédure + limites + vérification sur le compte + URL officielle**. Mettre le plan B après la solution native.

## Points de vigilance

- **Redis est présent** : instance privée via cPanel; cache reconstruisible seulement, données non sauvegardées ([FAQ Redis](https://faq.o2switch.fr/cpanel/o2switch/redis/)).
- **Memcached est présent** : cache temporaire, non durable ([FAQ](https://faq.o2switch.fr/cpanel/o2switch/memcached/)).
- **Node.js est présent** : Setup Node.js App et Passenger, mais cela ne garantit pas toute architecture Next.js SSR, WebSockets ou workers 24/7 ([FAQ](https://faq.o2switch.fr/cpanel/logiciels/hebergement-nodejs-multi-version/)).
- **PostgreSQL est documenté**, avec avertissement sur version historique et maintien du support. Vérifier la version du compte et les extensions plutôt que présumer une version moderne/PostGIS/pgvector ([FAQ](https://faq.o2switch.fr/cpanel/bases-de-donnees/postgresql/)).
- **Sous-comptes Lunes** : isolation cPanel documentée, distincte de Docker ([FAQ](https://faq.o2switch.fr/cpanel/o2switch/univers-web-sous-comptes/)).
- **Sécurité** : TigerProtect, ModSecurity, Imunify AV+, Let's Encrypt, MFA et JetBackup sont documentés. Ils ne dispensent pas de la sécurité métier, du contrôle des accès et des propres sauvegardes applicatives.
- **Docker, sudo/root, WebSockets persistants, SSE durable, workers 24/7, ports publics arbitraires et extensions Postgres** : vérifier au cas par cas, avec preuve ou support; ne conclure ni support ni impossibilité sans source claire.
- **Jamais de secrets** dans les réponses, commits ou captures : ni mot de passe Redis/cPanel, ni clés, tokens, dumps ou fichiers .env. Pas de changement de production sans approbation.

## Consultation locale

- [Navigation cPanel et liens officiels](references/00-plan-cpanel.md)
- [Référentiel des 31 capacités](references/capabilities.json)
- [Catalogue JSON des 65 outils](references/cpanel-catalog.json)
- [Notes de sécurité et de déploiement](references/architecture-notes.md)

Depuis ce dossier (Python standard seulement) : `python scripts/query.py "redis"`, `python scripts/query.py "nextjs"`, `python scripts/query.py --section securite`, `python scripts/query.py --all`; ajouter `--json` pour la sortie agent.

L'index local aide à chercher rapidement mais **n'a pas accès au cPanel privé** et ne constitue pas une garantie contractuelle. Vérifier la version/activation réelle et les sources officielles avant les décisions sensibles. Le skill reste inactif tant qu'un agent compatible ne l'a pas installé/chargé explicitement.
