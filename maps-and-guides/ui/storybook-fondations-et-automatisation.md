# Storybook : Fondations, méthodologie et automatisation avec l'IA

Guide pratique et architectural pour faire de [Storybook](https://storybook.js.org/) le socle de développement d'interface (UI) de vos projets modernes, structurer un catalogue de composants vivant et outiller les agents d'intelligence artificielle via le protocole MCP.

---

## 1. Pourquoi faire de Storybook le socle de vos projets ?

Dans le développement web classique, les composants d'interface sont souvent conçus directement imbriqués dans les pages de l'application. Cette approche introduit rapidement des frictions :
- Dépendance vis-à-vis des données d'API distantes et de l'état global (authentification, session, routing).
- Difficulté à reproduire les états limites (chargement, erreurs réseau, permissions partielles, textes longs).
- Absence de documentation centralisée : les développeurs et agents de code réinventent des boutons, modales ou formulaires déjà existants.

### Le paradigme Component-Driven Development (CDD)
Storybook isole l'interface utilisateur. Vous concevez vos composants du plus simple (atomes comme les boutons, badges, icônes) au plus complexe (organismes comme les formulaires, headers, pages entières) dans un environnement dédié, rapide et indépendant du backend.

**Bénéfices clés pour vos projets :**
1. **Atelier d'isolation :** Développement instantané sans lancer toute la chaîne applicative backend.
2. **Contrat d'interface fiable :** Chaque variante d'un composant est formalisée et vérifiable visuellement.
3. **Documentation vivante :** Les composants, leurs propriétés (*props*) et leurs exemples d'usage sont toujours synchronisés avec le code source.
4. **Machine-readable context :** Storybook compile vos composants en manifestes exploitables par les modèles et agents d'IA (Cursor, Claude Code, Antigravity, etc.).

---

## 2. Méthodologie : Structurer et rédiger des stories efficaces

Pour qu'un catalogue Storybook reste lisible pour votre équipe et parfaitement compréhensible par les agents IA, appliquez cette méthodologie.

### Règle d'or : 1 concept par story
Évitez la story « fourre-tout » qui affiche une grille de 20 boutons de toutes les tailles et couleurs dans un seul composant. Préférez des stories dédiées et explicites :
- `Default` : l'état standard recommandé.
- `Primary` / `Secondary` / `Destructive` : les variantes visuelles majeures.
- `Loading` / `Disabled` : les états interactifs et asynchrones.
- `WithError` : le comportement face à une validation défaillante.

### Documenter l'intention (le « Pourquoi » autant que le « Comment »)
Les agents et développeurs consultent la documentation pour savoir **quand** utiliser une variante.
- Utilisez des commentaires **JSDoc** soignés directement sur le composant et sur chaque champ TypeScript de son interface.
- Configurez `react-docgen-typescript` dans votre fichier `.storybook/main.ts` (ou équivalent selon votre framework) pour extraire fidèlement les descriptions de types et les valeurs par défaut.

Exemple de composant et de story :

```tsx
// Button.tsx
export interface ButtonProps {
  /** Variantes visuelles du bouton selon la hiérarchie d'action */
  variant?: 'primary' | 'secondary' | 'danger';
  /** État de chargement désactivant les clics et affichant un indicateur */
  loading?: boolean;
  /** Libellé textuel ou contenu interactif du bouton */
  children: React.ReactNode;
  /** Gestionnaire d'événement de clic */
  onClick?: () => void;
}

/**
 * Bouton principal utilisé pour les actions utilisateur majeures.
 */
export const Button = ({ variant = 'primary', loading = false, children, onClick }: ButtonProps) => {
  // Implémentation du composant
};
```

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Bouton d’action unifié pour le design system.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Confirmer',
  },
};

export const LoadingState: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Sauvegarde...',
  },
};
```

---

## 3. Automatisation et synergie avec les agents IA

Storybook transforme votre design system en une source de vérité exploitable à chaud par les outils d'IA grâce au protocole **Model Context Protocol (MCP)** et aux **manifestes de composants**.

### Le serveur MCP Storybook (`@storybook/addon-mcp`)
Le protocole MCP permet à un assistant (comme Cursor, Claude Code ou Antigravity) d'interroger directement votre Storybook en cours d'exécution au lieu de deviner le nom des composants et des props.

Installation dans votre projet Storybook :
```bash
npx storybook add @storybook/addon-mcp
```

Configuration dans `.storybook/main.ts` :
```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-mcp',
      options: {
        toolsets: {
          dev: true,   // Outils de modification, aperçu et compréhension de code
          docs: true,  // Recherche de composants, propriétés et guides
          test: true,  // Exécution de tests dans la boucle d'auto-réparation
        },
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};

export default config;
```

### Les 3 toolsets MCP et la boucle d'auto-réparation
1. **`docs` :** L'agent consulte la liste exacte des composants existants avant de générer du code UI. Il ne réinvente pas un composant personnalisé quand une primitive du design system existe déjà.
2. **`dev` :** L'agent accède à la structure des fichiers de stories pour proposer de nouvelles variantes conformes aux conventions du projet.
3. **`test` (Self-healing loop) :** En combinant Storybook avec `@storybook/addon-vitest`, l'agent peut modifier un composant, exécuter la story via l'outil de test MCP, constater une erreur ou une régression, et ajuster son code jusqu'au succès sans intervention humaine.

### Curation du manifeste IA avec le tag `!manifest`
Par défaut, Storybook inclut toutes vos stories dans le manifeste `components.json` transmis à l'IA. Pour les stories de bac à sable interne, les brouillons ou les tests visuels spécifiques que vous ne voulez pas voir réutilisés par l'agent, excluez-les via le tag `!manifest` :

```ts
export const InternalExperiment: Story = {
  tags: ['!manifest'], // Masque cette story aux agents IA
  args: {
    // ...
  },
};
```

---

## 4. Outils et extensions complémentaires recommandés

Pour compléter votre environnement Storybook et maximiser l'efficacité :

1. **Tokens de design & intégration Tailwind :**
   - [`storybook-addon-design-system-docs`](https://storybook.js.org/addons/storybook-addon-design-system-docs) : génère automatiquement une documentation dynamique des couleurs, espacements et typographies à partir de votre configuration `tailwind.config.js`.
2. **Tests d'accessibilité (a11y) :**
   - `@storybook/addon-a11y` : exécute le moteur de test `axe-core` en continu dans le volet Storybook pour signaler les contrastes insuffisants, les attributs ARIA manquants ou les balises sémantiques mal ordonnées.
3. **Tests d'interaction (`play` functions) :**
   - `@storybook/addon-interactions` : simule les interactions utilisateur (clics, saisies clavier) directement dans la story et vérifie le résultat via `@storybook/test`.
4. **Publication et partage d'équipe :**
   - [Chromatic](https://www.chromatic.com/) : outil créé par les mainteneurs de Storybook pour héberger les revues d'interface en équipe, exécuter des tests de non-régression visuelle pixel-perfect et exposer un point de terminaison MCP public pour les agents distants.

---

## 5. Checklist pour démarrer un nouveau projet

Quand vous lancez un nouveau projet (React, Next.js, Vite) :

- [ ] **Initialiser Storybook :** `npx storybook@latest init`
- [ ] **Configurer le typage strict :** Activer TypeScript et la documentation automatique des props (`react-docgen-typescript`).
- [ ] **Ajouter l'addon MCP :** `npx storybook add @storybook/addon-mcp` et configurer les toolsets voulus.
- [ ] **Créer les atomes fondateurs :** Boutons, champs de texte, cartes, badges avec leurs stories représentatives.
- [ ] **Instaurer la convention 1-concept / story :** Valider les noms clairs et documentés avec des commentaires JSDoc.
- [ ] **Tester avec votre agent IA :** Demander à l'agent de composer une nouvelle vue en lui indiquant explicitement d'inspecter Storybook via MCP.

---

## 6. Prompt prêt à l'emploi pour agent IA

Copiez ce prompt dans votre IDE (Cursor, Windsurf, Claude Code, Antigravity) lors du développement d'une nouvelle fonctionnalité :

```text
Consulte le serveur Storybook MCP et notre catalogue de composants avant d'écrire du code UI.
Utilise en priorité les primitives existantes du design system documentées dans nos stories.
Si un nouveau composant est nécessaire, crée d'abord son fichier .tsx avec typage JSDoc complet, puis son fichier .stories.tsx avec au moins deux stories distinctes (état par défaut et état alternatif/limite).
Vérifie le respect de l'accessibilité et valide la story avant de poursuivre.
```

---

[Retour au sommaire UI](README.md) · [Fiche d'inventaire Storybook](../../inventory/libraries/storybook/README.md)
