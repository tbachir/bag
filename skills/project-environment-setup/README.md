# Project Environment Setup Skill

> Initialisation et gouvernance outillée de dépôts : recherche amont de templates et librairies, limitation stricte du code custom et génération de `AGENTS.md`, `design.md`, et `CONTEXT.md`.

## Utilisation

```bash
# Rechercher dans le catalogue BAG
bag search setup
bag search template

# Prévisualiser l'installation du skill dans un projet (dry-run, rien n'est écrit)
bag skill add project-environment-setup --target ./mon-projet

# Installer réellement le skill (après relecture du dry-run)
bag skill add project-environment-setup --target ./mon-projet --apply
```

`skill add` copie uniquement le skill dans `.agents/skills/` du projet cible. Pour lancer le workflow d'initialisation, demandez ensuite à votre agent d'appliquer `project-environment-setup` : c'est lui qui exécute les étapes décrites dans `SKILL.md`.

## Contenu

- `SKILL.md` : Guide complet des règles d'or (Upstream Discovery, Minimisation du code custom, Gouvernance dès le jour 0) et du workflow pas à pas.
- `bag.item.json` : Métadonnées du catalogue BAG et prompts d'activation.
- `references/` : Modèles canoniques prêts à l'emploi :
  - `AGENTS.md.template`
  - `design.md.template`
  - `CONTEXT.md.template`
