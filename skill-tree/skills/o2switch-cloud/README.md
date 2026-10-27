# o2switch Cloud Expert

Skill d'agent IA pour l'**Offre Unique Cloud o2switch**, organisé selon la page d'accueil cPanel. Il cherche une solution native **avant** de conclure qu'un service externe/VPS est nécessaire.

- [SKILL.md](SKILL.md) : activation, protocole de réponse et garde-fous.
- [Plan de cPanel](references/00-plan-cpanel.md) : **11 rubriques et 65 outils** liés aux pages officielles.
- [31 fiches de faisabilité](references/capabilities.json) : statuts séparant documentation et activation.
- [Catalogue machine-lisible](references/cpanel-catalog.json) et [notes techniques](references/architecture-notes.md).
- [Recherche locale](scripts/query.py) sans dépendance et sans accès cPanel.

## Utilisation

Depuis ce dossier :
```sh
python scripts/query.py "redis"
python scripts/query.py "nextjs" --json
python scripts/query.py --section securite
```

## Installation volontaire

Pour Codex, copier le **dossier complet** dans `~/.agents/skills/o2switch-cloud/`; pour Claude Code, dans `~/.claude/skills/o2switch-cloud/`. Selon le projet, utiliser `.agents/skills/` ou `.claude/skills/`. L'installation doit être explicitement choisie; la présence du fichier dans BAG ne l'active pas. Une session d'agent peut devoir être redémarrée.

**Provenance :** synthèse non officielle de https://faq.o2switch.fr/cpanel/ et de l'offre Cloud; données revues au 27 octobre 2026. Aucun accès au compte privé n'a été utilisé; les restrictions évolutives exigent une nouvelle vérification auprès d'o2switch.
