# Storybook

Un atelier de développement en environnement isolé (*component workshop*) pour concevoir, tester et documenter des composants d'interface utilisateur, enrichi de manifestes et d'un serveur MCP pour guider les agents IA.

- **Official source:** https://storybook.js.org
- **Documentation IA & MCP :** https://storybook.js.org/docs/ai
- **Role:** Curated reference, atelier UI et socle de composants réutilisables.
- **Recommendation:** recommended for react, vue, svelte, nextjs, ui quand le projet développe une bibliothèque de composants ou une interface modulaire.
- **Reviewed:** 2026-10-30

## Guide de référence dédié

Pour comprendre l'architecture, la méthodologie de conception de stories et l'automatisation avec les agents de code IA, consultez le guide complet :
👉 [Storybook : Fondations, méthodologie et automatisation avec l'IA](../../../maps-and-guides/ui/storybook-fondations-et-automatisation.md)

## Practical workflow

1. Initialiser Storybook dans le projet : `npx storybook@latest init`.
2. Définir des composants typés avec des commentaires JSDoc clairs.
3. Rédiger une story par concept unitaire (`Default`, `Primary`, `Disabled`, etc.) plutôt que des catalogues denses.
4. Intégrer `@storybook/addon-mcp` pour exposer le catalogue aux agents de code locaux (Cursor, Claude Code, etc.).
5. Exclure les stories internes ou expérimentales du manifeste IA avec le tag `!manifest`.
6. Valider l'accessibilité avec `@storybook/addon-a11y` et les interactions via les `play` functions.

## Trade-offs

- **Discipline requise :** Nécessite une rigueur d'équipe pour maintenir les stories à jour au fil des évolutions des composants.
- **Temps de setup initial :** Configuration des dépendances (mocking d'API, wrappers de thèmes, providers de routeurs).
- **Gains majeurs :** Développement plus rapide sans dépendance backend, régression visuelle stoppée, et génération de code par IA fiabilisée.

## Delegate — project-aware integration

```text
Évalue l'intégration de Storybook dans mon projet actuel. BAG item: https://github.com/tbachir/bag/tree/main/inventory/libraries/storybook
Consulte les fichiers AGENTS.md, inspecte les frameworks frontend et composants existants, et propose une configuration Storybook minimale et pérenne avec support MCP pour assister le développement. N'installe rien sans validation préalable.
```

[Retour aux bibliothèques](../README.md).
