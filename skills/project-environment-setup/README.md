# Project Environment Setup Skill

> Initialisation et gouvernance outillée de dépôts : recherche amont de templates et librairies, limitation stricte du code custom et génération de `AGENTS.md`, `design.md`, et `CONTEXT.md`.

## Utilisation

```bash
# Rechercher dans le catalogue BAG
bag search setup
bag search template

# Appliquer le skill pour démarrer un projet
bag skill apply project-environment-setup
```

## Contenu

- `SKILL.md` : Guide complet des règles d'or (Upstream Discovery, Minimisation du code custom, Gouvernance dès le jour 0) et du workflow pas à pas.
- `bag.item.json` : Métadonnées du catalogue BAG et prompts d'activation.
- `references/` : Modèles canoniques prêts à l'emploi :
  - `AGENTS.md.template`
  - `design.md.template`
  - `CONTEXT.md.template`
