# 📐 BAG — Spécification technique

> Cette spécification est l'annexe du [pitch](pitch.md). Elle s'adresse aux ingénieurs, aux architectes et aux intégrateurs d'agents. Elle décrit BAG assez précisément pour qu'une équipe, ou un agent, puisse en reconstruire le résultat final avec toutes ses nuances, sans avoir à les redécouvrir.

| Propriété | Valeur |
| --- | --- |
| Version du document | 1.0 |
| État de référence | dépôt `tbachir/bag`, branche `main`, commit `10cdf52`, vérifié le 2026-10-27 |
| Statut | Référence de conception. En cas d'écart, les schémas JSON, le code et les tests font foi. |
| Langue | Français ; les identifiants techniques restent en anglais, comme dans le code |

## Conventions de lecture

- **DOIT, NE DOIT PAS, DEVRAIT, PEUT** : niveaux d'exigence au sens de la RFC 2119.
- **[Existant]** : comportement implémenté et vérifié à la date de référence, par une commande ou un test cité.
- **[Cible]** : comportement attendu du résultat final, pas encore implémenté. Chaque cible cite la page du dépôt qui l'annonce, ou porte la mention *proposition*.
- « Objet » traduit *item* ; « projet cible » désigne le dépôt dans lequel un utilisateur veut réutiliser un objet de BAG.

## Sommaire

1. [Positionnement](#1-positionnement)
2. [Invariants de conception](#2-invariants-de-conception)
3. [Architecture](#3-architecture)
4. [Organisation du dépôt](#4-organisation-du-dépôt)
5. [Modèle de contenu](#5-modèle-de-contenu)
6. [Catalogue structuré](#6-catalogue-structuré)
7. [CLI bag](#7-cli-bag)
8. [Délégation à un agent externe](#8-délégation-à-un-agent-externe)
9. [Composition de tâches](#9-composition-de-tâches)
10. [Registre d'exposition](#10-registre-dexposition)
11. [Skills](#11-skills)
12. [Publication statique](#12-publication-statique)
13. [Qualité, tests et CI](#13-qualité-tests-et-ci)
14. [Modèle de menace](#14-modèle-de-menace)
15. [Écarts entre l'existant et la cible](#15-écarts-entre-lexistant-et-la-cible)
16. [Plan de reconstruction](#16-plan-de-reconstruction)
17. [Critères d'acceptation du résultat final](#17-critères-dacceptation-du-résultat-final)
18. [Glossaire](#18-glossaire)

## 1. Positionnement

### 1.1 Problème

Trois frictions se cumulent :

1. **Fragmentation.** Le savoir réutilisable d'un développeur est dispersé dans des favoris, des dépôts et des conversations. Il n'a ni source, ni date, ni limites explicites, si bien que les problèmes sont résolus plusieurs fois.
2. **Asymétrie entre humains et agents.** La documentation écrite pour les humains n'est pas exploitable de façon fiable par un agent. À l'inverse, l'outillage destiné aux agents (installeurs, scripts, serveurs MCP) agit sans contrat d'autorisation.
3. **Confiance implicite.** Un README, un `SKILL.md` ou une configuration MCP trouvés en ligne sont traités comme des instructions. Être documenté, disponible, activé et digne de confiance sont alors confondus.

### 1.2 Proposition

BAG est un **inventaire curé et versionné dans Git**. Chacun de ses objets :

- est **écrit une seule fois** : sa source canonique est un fichier Markdown ou un modèle local ;
- est **lisible par un humain**, sur GitHub ou sur le site statique ;
- est **interrogeable par une machine** : manifestes JSON, CLI, `llms.txt`, raccourcis Markdown ;
- peut être **délégué** à un agent externe, grâce à un prompt court, à la chaîne des `AGENTS.md` et à des tâches composables ;
- peut **équiper un projet**, mais uniquement par copie locale, après un plan et un accord explicite.

La métaphore du jeu de rôle (sept zones, butin, équipement, loadouts) n'a rien de décoratif. Elle sert de **modèle mental de rangement** : chaque objet a une seule maison principale et suit un cycle de vie explicite.

### 1.3 Non-objectifs

Les capacités suivantes DOIVENT rester hors périmètre. Chacune a une raison et une conséquence directe sur la conception.

| Non-objectif | Raison | Conséquence de conception |
| --- | --- | --- |
| Gestionnaire de paquets ou installeur | Installer engage le projet cible : versions, licences, sécurité. | `mode: copy` se limite à des fichiers locaux relus. Pas de téléchargement, de `npm install` ni de sous-processus. |
| Coffre à secrets | Le dépôt est public. | Configurations en `.example` ou `.template` ; le compilateur refuse les noms de fichiers de type secret. |
| Registre alimenté automatiquement, robot d'indexation | La curation fait la valeur de BAG. | Pas d'import automatique ni de synchronisation en arrière-plan. |
| Moteur d'exécution ou bac à sable | `--apply` est une écriture locale, pas une isolation. | Aucun objet n'est exécuté par BAG. |
| Autorité d'instructions pour d'autres dépôts | BAG est une référence. | Ses consignes sont lues explicitement, jamais actives implicitement dans un projet cible. |
| Formulaire web d'entretien | Les réponses se trouvent dans le projet cible. | L'agent externe interroge l'utilisateur, après avoir inspecté le projet. |
| Recherche sémantique par embeddings | Exigences de déterminisme, de fonctionnement hors ligne et de zéro dépendance. | Recherche par sous-chaînes (voir §6.5). |
| Activation de MCP, de plugins, de skills ou de réglages globaux | Les permissions et la compatibilité dépendent de chaque client. | Ces éléments sont documentés et proposés à l'adhésion volontaire, rien de plus. |

### 1.4 Acteurs

| Acteur | Contexte | Fait | Ne fait jamais |
| --- | --- | --- | --- |
| Mainteneur | Dépôt BAG | Curation, promotion, revue, datation | Publier un secret ou une donnée privée |
| Contributeur (humain ou agent) | Dépôt BAG, sous le `AGENTS.md` racine | Ajoute ou modifie des objets, lance les validations | Contourner la validation, inventer des faits |
| Agent découvreur | Clone local de BAG | `search`, `list`, `show`, `loadout`, `plan` en `--json` | `equip --apply` sans accord pour la cible concernée |
| Agent délégué | Projet cible, BAG servant de référence externe | Lit la chaîne d'instructions, inspecte, interroge, exécute ce qui est autorisé, rend compte | Faire passer BAG avant le projet cible ou l'utilisateur |
| Lecteur | GitHub ou site | Navigue, cherche, copie un prompt | — |
| CI | GitHub Actions | Valide, construit, publie depuis `main` | Publier depuis une PR |

### 1.5 Résultat final visé

Le résultat final est atteint quand toutes les conditions suivantes sont réunies :

- les étagères des sept zones contiennent des objets curés, datés et sourcés ;
- chaque objet réutilisable possède un manifeste de catalogue, un prompt générique et, si besoin, un arbre de tâches et un descripteur d'exposition ;
- des loadouts couvrent les quêtes récurrentes ;
- un agent sait **découvrir** (JSON, `llms.txt`), **déléguer** (prompt, chaîne, tâches), **équiper** (plan, accord, copie) et **rendre compte** selon un format uniforme ;
- le site statique rend tout cela navigable et cherchable, et intègre le compositeur de tâches à partir des manifestes ;
- toutes les validations tournent en CI ;
- le modèle de confiance n'a pas bougé : aucune installation, aucun accès réseau, aucun écrasement.

Le §17 décline ces conditions en critères vérifiables.

## 2. Invariants de conception

Ces invariants sont la substance de BAG. Toute évolution DOIT les préserver, et chacun indique où il est appliqué.

**I1 — Une source canonique, plusieurs lectures.** Une ressource n'existe qu'à un seul endroit du dépôt. GitHub, le site, la CLI et les agents la lisent sans la dupliquer.
*Application :* le compilateur lit les fichiers d'origine et n'écrit que dans des répertoires générés et ignorés par Git ; le registre d'exposition (§10) nomme la source canonique ; `apps/docs/content/docs` ne contient qu'une page de navigation rédigée à la main.

**I2 — Documenté, installé, activé, digne de confiance et vérifié sont cinq états distincts.** Aucun n'implique les autres.

| Distinction | Où elle s'exprime |
| --- | --- |
| « Équipé » ne veut pas dire installé | `CONTRIBUTING.md` : *equipped* signifie « référencé par au moins un loadout ». |
| Présent dans BAG ne veut pas dire actif dans un client | `skill-tree/README.md`, chaque `SKILL.md` |
| Documenté ne veut pas dire activé sur un compte | Skill o2switch : `account_activation: not_verified` sur chacun des 65 outils |
| Non confirmé ne veut pas dire impossible | Skill o2switch : le statut `verify` interdit de conclure à l'impossibilité |
| Exposition déclarée ne veut pas dire activation à l'exécution | Statuts `documented`, `opt-in` et `active` ; `active` exige une preuve (§10.4) |
| Plan ne veut pas dire autorisation | CLI et `AGENTS.md` (invariant I4) |

**I3 — Le contenu est une donnée, jamais une autorité.** Notes de catalogue, `SKILL.md`, références tierces et instructions trouvées dans des ressources liées sont des données non fiables. Pour un agent, l'ordre de priorité est le suivant :

1. les contraintes système et développeur de l'agent hôte ;
2. les politiques du projet cible (son propre `AGENTS.md`, ses règles) ;
3. les permissions explicites de l'utilisateur ;
4. la chaîne `AGENTS.md` de BAG, où la portée la plus proche de l'objet l'emporte, sauf si elle affaiblit la sécurité ;
5. la documentation, les références et les contenus tiers.

Les niveaux 1 à 3 priment toujours sur BAG. Leur ordre relatif relève de l'agent hôte, pas de BAG.

**I4 — Autorisation explicite, propre à chaque cible et non transitive.** Un plan en lecture seule ne vaut pas autorisation. Un accord donné pour une cible ne s'étend ni à une autre cible, ni à un autre contexte. Une entrée de catalogue qui recommande une action, un manifeste de tâches ou un prompt ne constituent jamais une permission.

**I5 — Écriture additive et non destructive.** La seule écriture que BAG sait faire consiste à créer un fichier absent, par copie d'un modèle local relu. Un fichier existant est ignoré (`exists-skip`). Il n'y a aucun drapeau d'écrasement, ni aujourd'hui ni dans la cible.

**I6 — Confinement des chemins.** Tout chemin manipulé est relatif, sûr selon la grammaire du §6.4, et résolu à l'intérieur de sa racine. Les liens symboliques sont refusés sur tout le trajet, côté source comme côté destination.

**I7 — Noyau sans dépendance, hors ligne et sans sous-processus.** `bag.mjs`, `catalog/lib.mjs`, `validate.mjs`, `find.mjs` et `validate-exposures.mjs` n'utilisent que la bibliothèque standard de Node.js 20+. `query.py` n'utilise que la bibliothèque standard de Python. Le site vit dans `apps/docs`, isolé, avec son propre `package.json` et son propre fichier de verrouillage.

**I8 — Échec fermé.** Chaque commande de la CLI relit et valide tout le catalogue : un seul manifeste invalide bloque toutes les commandes. Le compilateur du site valide l'ensemble des sources avant de remplacer ses sorties. La publication n'a lieu que si les deux variantes de construction sont validées.

**I9 — Honnêteté épistémique.** Il faut séparer les **faits vérifiés**, les **indications propres à une version**, les **recommandations** et les **notes de terrain**. Les faits susceptibles d'évoluer sont datés et sourcés. Chaque vérification est rapportée en `PASS`, `FAIL` ou `NOT RUN`, avec la commande ou la preuve observable. On n'affirme jamais qu'un outil externe a été testé s'il ne l'a pas été.

**I10 — Une maison principale par objet.** Un objet vit dans une seule zone, choisie selon sa finalité principale, et les autres zones pointent vers lui par des liens (§5.2).

**I11 — Markdown d'abord, amélioration progressive.** Tout DOIT rester lisible sur GitHub sans JavaScript. Les prompts sont des blocs de code `text` précédés d'un titre. Le site PEUT ajouter des fonctions de confort, comme la copie ou la recherche, mais n'exige ni MDX ni schéma propre à l'application.

**I12 — Prompts courts, documentation riche.** Un prompt ne porte que trois choses : le résultat attendu, l'URL de l'objet et la consigne de lire la chaîne `AGENTS.md`. Les procédures, critères et garde-fous vivent dans BAG.

**I13 — Instructions hiérarchiques, lues explicitement.** Les `AGENTS.md` imbriqués précisent la méthode à chaque niveau. Ils ne sont pas actifs automatiquement dans un projet cible : l'agent les lit délibérément.

**I14 — Aucun secret, jamais.** Cela couvre les jetons, mots de passe, clés, fichiers `.env`, chemins personnels, URL privées, configurations de production et contenus copiés sans licence (voir `.gitignore`, `SECURITY.md` et §12.7).

**I15 — Pas de coquilles vides.** Chaque dossier permanent a un README. On ne crée pas de `AGENTS.md` sans contenu utile. Une étagère vide l'annonce honnêtement (« *shelf ready; items to be curated* »). Git ne suit pas les dossiers vides, et BAG ne prétend pas le contraire.

**I16 — Identifiants stables.** Les `id` d'objets et de loadouts, les identifiants de tâches et les chemins d'objets cités dans des prompts publiés constituent une API. Un renommage DOIT s'accompagner d'un guide de migration.

**I17 — Déterminisme, aucun état dérivé persistant.** Le catalogue est relu depuis les fichiers à chaque appel, en ordre trié ; il n'existe aucun index qui puisse se périmer. Le compilateur est déterministe : deux générations successives produisent exactement le même résultat, comme le vérifie un test. Les sorties générées sont ignorées par Git.

## 3. Architecture

```text
+--------------------------- Dépôt Git : source unique ---------------------------+
| L0 Contenu       7 zones Markdown, templates/, guides                           |
| L1 Instructions  AGENTS.md racine > zone > étagère > objet > tâches             |
| L2 Catalogue     catalog/items/*.json, catalog/loadouts/*.json, schemas/        |
| L3 Délégation    prompts inline, protocole, <objet>/tasks/index.json            |
| L4 Exposition    catalog/exposures/*.json (canonique -> consommateurs)          |
+------------+---------------------------+---------------------------+------------+
             |                           |                           |
   L5a CLI bag (lecture, plan,   L5b Compilateur du site     L6 Validateurs, tests,
   copie locale approuvée)       (HTML, .md, llms.txt)       CI (échec fermé)
             |                           |
   agent découvreur (JSON)       humain (HTML), agent (Markdown)
   projet cible (copie)
Agent délégué : lit L0 à L3 (URL GitHub ou clone) et agit dans le projet cible.
```

| Couche | Artefacts | Consommateurs | Écrit hors de BAG ? |
| --- | --- | --- | --- |
| L0 Contenu | `*.md` des zones, `templates/` | Humains, agents, compilateur | Non |
| L1 Instructions | `AGENTS.md` à chaque niveau | Agents contributeurs et délégués | Non |
| L2 Catalogue | Manifestes JSON et schémas | CLI, agents, tests | Non |
| L3 Délégation | Prompts, `tasks/index.json`, fiches de tâches | Agents délégués, compositeur | Non |
| L4 Exposition | Descripteurs JSON | Mainteneurs, validateur | Non (déclaratif) |
| L5a CLI | `spellbook/scripts/bag.mjs`, `catalog/lib.mjs` | Agents, humains | **Oui, mais seulement `equip --apply`**, dans la cible et après accord |
| L5b Site | `apps/docs` | Lecteurs, agents | Non (artefact statique) |
| L6 Qualité | Validateurs, `tests/`, `.github/workflows/` | Contributeurs, CI | Non |

## 4. Organisation du dépôt

```text
bag/
  README.md  AGENTS.md  CONTRIBUTING.md  SECURITY.md      règles et navigation
  .editorconfig  .gitignore                                configuration utilisée par BAG lui-même
  inventory/        bibliothèques, dépôts, ressources ; objets délégables (supabase/auth)
  equipment/        tools/, configs/ (*.template proposés aux autres projets)
  skill-tree/       skills/ (paquets SKILL.md), agents/, plugins/, mcp/
  spellbook/        scripts/ (bag.mjs, find.mjs, validate*.mjs), commands/
  maps-and-guides/  guides, protocole, conventions, tutoriels, références, vision/
  loot/             inbox.md, découvertes non évaluées
  loadouts/         compositions lisibles par un humain (le pendant JSON est dans catalog/)
  catalog/          items/, loadouts/, exposures/, schemas/, lib.mjs
  templates/        item.md, delegable-item.md
  demo/             task-composer.html (prototype autonome)
  tests/            node:test pour le catalogue et les skills
  apps/docs/        site Fumadocs/Next.js isolé (dépendances et lockfile propres)
  .github/          validate.yml, docs.yml, modèle de PR
```

**Conventions [Existant] :**

- La navigation partagée est en anglais ; le français est bienvenu dans les notes et les guides.
- Les chemins sont en kebab-case minuscule, sauf les noms de fichiers standards d'un écosystème (`AGENTS.md`, `SKILL.md`, `README.md`).
- Les liens internes sont relatifs ; les sources externes sont citées par leur URL HTTPS canonique.
- Toute configuration partagée est livrée en `.example` ou `.template`, avec des valeurs fictives explicites.
- On n'ajoute pas de dépendance, d'installation automatique ni de changement global sur la machine sans besoin clair.

**Configuration utilisée par BAG ou configuration offerte ?** Le fichier `.editorconfig` à la racine configure BAG lui-même. `equipment/configs/.editorconfig.template` est un modèle offert aux autres projets. Le contenu est proche, mais les rôles sont distincts et NE DOIVENT PAS être fusionnés. De même, `.github/workflows/` est actif pour BAG, alors qu'un workflow rangé sous `spellbook/` n'est qu'un modèle.

## 5. Modèle de contenu

### 5.1 Zones

| Zone | Contenu (maison principale) | `kind` typiques |
| --- | --- | --- |
| `inventory/` | Bibliothèques, dépôts et ressources externes ; objets délégables | `library`, `repository`, `resource` |
| `equipment/` | Outils utilisés au quotidien, environnements, configurations réutilisables | `tool`, `config` |
| `skill-tree/` | Skills, consignes d'agents, plugins, catalogue MCP | `skill`, `agent`, `plugin`, `mcp` |
| `spellbook/` | Scripts, commandes, extraits de code, automatisations | `script` |
| `maps-and-guides/` | Tutoriels, pratiques, références, notes de terrain | `guide` |
| `loot/` | Découvertes non évaluées | tous |
| `loadouts/` | Compositions d'objets existants pour une quête | (non concerné : un loadout n'est pas un objet) |

`loadouts` est bien une zone de navigation, mais pas une valeur de `zone` dans le schéma des objets. C'est voulu : un loadout est une composition, pas un objet.

### 5.2 Règle de routage

On choisit **une** maison principale selon la finalité dominante, puis on relie les autres zones à cet objet par des liens, sans copier-coller. Exemple de référence (`CONTRIBUTING.md`) : un formateur TypeScript relève de l'Équipement en tant qu'outil quotidien. Un script qui l'enveloppe relève du Grimoire, et un article sur la conception des formateurs relève des Cartes.

### 5.3 Cycle de vie

`loot → evaluating → ready → equipped`, plus `archived`. Ce sont des **étiquettes documentaires**, pas des statuts gérés automatiquement.

| État | Sens | Représentation |
| --- | --- | --- |
| Loot | Intéressant, rien n'est vérifié | Entrée dans `loot/inbox.md`, ou `zone: loot` |
| Evaluating | Lecture de la documentation, tests, comparaison | `status: evaluating` |
| Ready | Assez vérifié pour être recommandé ; limites énoncées | `status: ready` |
| Equipped | Référencé par au moins un loadout ; **ne signifie pas installé** | Dérivé : n'est pas stocké dans le manifeste |
| Archived | Utile pour l'historique, plus d'actualité | `status: archived` |

Contraintes appliquées par le validateur : seul un objet `ready` PEUT être en `mode: copy`, et seul un objet `ready` PEUT figurer dans un loadout.

### 5.4 Fiche objet

Le gabarit est [templates/item.md](../../templates/item.md).

- **En-tête :** catégorie, statut, source officielle, documentation, licence, date de dernière revue, compatibilité (OS, runtime, client, versions).
- **Sections :** pourquoi le garder, quand l'utiliser, démarrage rapide (commandes relues, sans aucune donnée de compte), compromis et sécurité, équipement associé.

### 5.5 Objet délégable

Le gabarit est [templates/delegable-item.md](../../templates/delegable-item.md).

- **Proposition de valeur** en une phrase, source officielle, documentation amont, statut avec date de dernière vérification, périmètre d'application.
- **Sections :**
  - à quoi il sert, et à quoi il ne sert pas ;
  - **un prompt générique « utilise cet objet dans mon projet »** ;
  - démarrage rapide ;
  - tutoriels avec prompts intégrés au fil du texte ;
  - recommandations et notes de terrain, séparées des faits vérifiés ;
  - ressources BAG liées. Leur disponibilité ne vaut pas autorisation.

Une seule exigence de qualité, issue de `CONTRIBUTING.md`, s'applique aux deux gabarits. L'objet a un nom clair et une finalité en une phrase. Il cite sa source canonique et, si besoin, sa licence. Il donne un usage concret, ses prérequis et contraintes d'environnement, ses limites, une date de revue pour les informations instables, et des liens qui fonctionnent. Il ne contient ni doublon ni secret.

## 6. Catalogue structuré

### 6.1 Découverte [Existant]

Le catalogue est lu dans `catalog/items/` et `catalog/loadouts/`, en ordre trié par nom de fichier. Seuls des fichiers `.json` y sont admis : tout sous-dossier ou autre fichier provoque une erreur (`Unexpected catalog entry`). Le catalogue est relu à chaque invocation, sans cache ni index généré. Le contrat formel est décrit par les schémas de [catalog/schemas](../../catalog/README.md).

### 6.2 Manifeste d'objet (`schemaVersion: 1`)

| Champ | Type | Requis | Contraintes |
| --- | --- | --- | --- |
| `schemaVersion` | entier | oui | constante `1` |
| `id` | chaîne | oui | `^[a-z0-9]+(?:-[a-z0-9]+)*$`, égal au nom du fichier sans `.json`, unique |
| `title`, `summary` | chaîne | oui | non vides après suppression des espaces |
| `zone` | énumération | oui | `inventory`, `equipment`, `skill-tree`, `spellbook`, `maps-and-guides` ou `loot` |
| `kind` | énumération | oui | `library`, `repository`, `resource`, `tool`, `config`, `skill`, `agent`, `plugin`, `mcp`, `script` ou `guide` |
| `status` | énumération | oui | `evaluating`, `ready` ou `archived` |
| `tags` | chaîne[] | oui | uniques, en kebab-case ; liste vide autorisée |
| `source` | objet | oui | `{ "type": "local", "path": <chemin sûr> }`. Le chemin désigne un **fichier régulier**, sans lien symbolique sur tout le trajet. |
| `mode` | énumération | oui | `copy` ou `reference` |
| `files` | `{from, to}[]` | si `copy` | interdit en `reference`. `from` est un fichier régulier de BAG ; `to` est un chemin sûr relatif à la cible. |
| `notes` | chaîne | non | texte libre, purement descriptif (invariant I3) |

Règles transversales : `additionalProperties: false` à tous les niveaux, y compris `source` et les entrées de `files` ; `mode: copy` exige `status: ready` et une liste `files` non vide.

### 6.3 Manifeste de loadout (`schemaVersion: 1`)

| Champ | Contraintes |
| --- | --- |
| `schemaVersion`, `id`, `title`, `summary` | Mêmes règles que pour les objets ; l'`id` correspond au nom du fichier. |
| `items` | Liste non vide de `{ "id": <objet existant>, "note"?: <chaîne> }` |

Le validateur rejette les objets inconnus, les doublons, les objets qui ne sont pas `ready` et les **collisions de destination** : deux objets en `copy` ne peuvent pas viser le même `to`.

### 6.4 Grammaire des chemins relatifs sûrs

Un chemin est sûr s'il respecte toutes les règles suivantes :

- il n'est absolu ni au sens POSIX ni au sens Windows ;
- il ne contient pas de `\` ;
- ses segments, séparés par `/`, sont non vides et ne valent ni `.` ni `..` ;
- chaque segment n'utilise que les caractères `[A-Za-z0-9._-]`.

Le schéma JSON exprime la même règle avec l'expression `^(?!/)(?!.*//)(?!.*(?:^|/)\.{1,2}(?:/|$))[A-Za-z0-9._/-]+$`. Un test vérifie que la fonction JavaScript `safeRelative` et l'expression du schéma donnent le même verdict. Exemples rejetés : `../escape`, `x/../escape`, `/absolute`, `C:\private`, `x\evil`, `.`, la chaîne vide, `x//y`, `x/./y`.

### 6.5 Recherche [Existant]

La requête est mise en minuscules et découpée sur les espaces. Un objet correspond si **chaque** terme est une sous-chaîne de la concaténation de `id`, `title`, `summary`, `zone`, `kind` et `tags`. Les `notes`, le chemin source et le contenu des documents ne sont pas indexés. Les résultats suivent l'ordre du catalogue, sans classement.

La recherche plein texte dans le Markdown relève d'un autre outil, `find.mjs` : recherche insensible à la casse, ligne par ligne, limitée à 40 résultats.

### 6.6 Contenu du catalogue au 2026-10-27

| `id` | Zone | `kind` | `mode` | Destination si `copy` |
| --- | --- | --- | --- | --- |
| `agent-rules` | skill-tree | agent | copy | `AGENTS.md` |
| `editorconfig` | equipment | config | copy | `.editorconfig` |
| `node-gitignore` | equipment | config | copy | `.gitignore` |
| `ai-skill-template` | skill-tree | skill | reference | — |
| `bag-inventory-skill` | skill-tree | skill | reference | — |
| `o2switch-cloud` | skill-tree | skill | reference | — |
| `mcp-catalog` | skill-tree | mcp | reference | — |
| `plugin-catalog` | skill-tree | plugin | reference | — |
| `bag-agent-guide` | maps-and-guides | guide | reference | — |
| `markdown-search` | spellbook | script | reference | — |

Le catalogue contient deux loadouts :

- `ai-coding` regroupe 7 objets : tous ceux du tableau, sauf `o2switch-cloud`, `bag-agent-guide` et `markdown-search` ;
- `node-project` regroupe `editorconfig` et `node-gitignore`.

## 7. CLI bag

### 7.1 Commandes [Existant]

Toutes les commandes s'exécutent depuis la racine de BAG avec `node spellbook/scripts/bag.mjs <commande>`.

| Commande | Arguments | Écrit ? | Sortie `--json` |
| --- | --- | --- | --- |
| `validate` | aucun | non | `{ valid, schemaVersion, items, loadouts }` |
| `list` | aucun | non | `Item[]` |
| `search <mots…>` | au moins 1 | non | `Item[]` |
| `show <id>` | exactement 1 | non | `Item` |
| `loadouts` | aucun | non | `Loadout[]` |
| `loadout <id>` | exactement 1 | non | `Loadout` plus `resolvedItems[{ id, note?, item }]` |
| `plan <id> --target <dossier>` | exactement 1 | non | `Plan` (`dryRun: true`) |
| `equip <id> --target <dossier>` | exactement 1 | non (simulation identique à `plan`) | `Plan` (`dryRun: true`) |
| `equip <id> --target <dossier> --apply` | exactement 1 | **oui**, dans la cible uniquement | `Plan` (`dryRun: false`) |

### 7.2 Analyse des arguments

- Les seuls drapeaux sont `--json`, `--apply` et `--target <valeur>`. Toute autre option `--x` est refusée (`Unknown option`). Une valeur de `--target` qui commence par `--` est refusée.
- `--apply` n'est valide qu'avec `equip`, et `--target` qu'avec `plan` ou `equip`, qui l'exigent.
- Un nombre d'arguments incorrect provoque une erreur explicite (`show needs one item id`, etc.).
- Sans commande, ou avec `help`, la CLI affiche l'aide sans lire le catalogue. Toute autre commande lit et valide le catalogue d'abord (invariant I8).
- En cas d'erreur, la CLI écrit `BAG: <message>` sur la sortie d'erreur et sort avec le code 1.
- En mode texte, une liste s'affiche à raison d'un objet par ligne (`id` aligné, titre, résumé) ; un plan affiche `PREVIEW (no files written)` ou `APPLIED`, puis une ligne par action.

### 7.3 Format du plan

```json
{
  "loadout": "ai-coding",
  "target": "/chemin/réel/résolu/du/projet",
  "dryRun": true,
  "actions": [
    { "item": "agent-rules", "mode": "copy", "source": "skill-tree/agents/AGENTS.example.md", "destination": "AGENTS.md", "status": "create" },
    { "item": "ai-skill-template", "mode": "reference", "source": "skill-tree/skills/_template/SKILL.md", "status": "reference-only" }
  ]
}
```

| `status` | Apparaît dans | Sens |
| --- | --- | --- |
| `create` | plan | La destination est absente et sera créée si l'utilisateur donne son accord. |
| `exists-skip` | plan, apply | La destination existe : elle ne sera jamais modifiée. |
| `reference-only` | plan, apply | Pointeur de découverte : rien n'est copié. |
| `created` | apply | Le fichier a été créé par copie exclusive. |

### 7.4 Algorithme `plan`

1. La cible DOIT exister et être un vrai dossier, pas un lien symbolique, vérifié avec `lstat`. Elle est ensuite résolue avec `realpath`.
2. Pour chaque objet du loadout, dans l'ordre :
   - un objet en `reference` produit une action `reference-only` ;
   - un objet en `copy` est traité fichier par fichier : le chemin `to` est vérifié segment par segment depuis la racine de la cible.
3. Pendant cette vérification :
   - tout segment qui est un lien symbolique provoque une erreur ;
   - tout parent existant qui n'est pas un dossier provoque une erreur ;
   - une destination existante qui n'est pas un fichier régulier provoque une erreur.
4. L'action vaut `exists-skip` si la destination existe, `create` sinon.
5. Rien n'est écrit.

### 7.5 Algorithme `apply`

Cette étape n'a lieu qu'après accord explicite de l'utilisateur pour cette cible.

1. Recalculer le plan, sans réutiliser un plan antérieur.
2. Pour chaque action `create` :
   1. revérifier la source (fichier régulier dans BAG, sans lien symbolique) ;
   2. revérifier la destination ; si elle existe désormais, passer en `exists-skip` ;
   3. créer les dossiers parents (`mkdir -p`), puis revérifier la destination (protection contre une course entre la vérification et l'écriture) ;
   4. copier avec `COPYFILE_EXCL`, qui refuse d'écraser un fichier au niveau du système ; une erreur `EEXIST` donne `exists-skip`, toute autre erreur est propagée ;
   5. marquer l'action `created`.
3. Renvoyer le plan avec `dryRun: false`. L'agent DOIT comparer ce résultat au plan présenté à l'utilisateur et signaler tout écart.

### 7.6 Messages d'erreur à préserver

Ces messages servent de contrat aux tests et aux agents :

- `Target must be an existing, real directory` ;
- `Destination contains a symbolic link` ;
- `Destination parent is not a directory` ;
- `Destination is not a regular file` ;
- `Source missing or symbolic link` ;
- `Source is not a regular file` ;
- `Unsafe relative path` et `Path escapes root` ;
- `invalid local source` ;
- `only ready items may be copied` ;
- `reference items must not carry copy files` ;
- `duplicate destination` ;
- `unknown item` et `not ready`.

### 7.7 Protocole d'un agent qui utilise la CLI

1. Demander ce que l'utilisateur construit : pile technique, OS, client, environnement existant.
2. Découvrir avec `search --json` et `loadouts --json`, puis inspecter avec `show` et `loadout`. Lire les documents désignés par `source.path` avant de recommander quoi que ce soit.
3. Vérifier la compatibilité et les permissions auprès des sources officielles à jour. Hors ligne, signaler l'incertitude.
4. Proposer une courte liste : pourquoi chaque objet, et ce qui n'a pas été vérifié.
5. Lancer `plan <id> --target <dossier réel> --json` et **présenter chaque action** (`create`, `exists-skip`, `reference-only`). Ne jamais inventer de chemin cible.
6. Obtenir un accord explicite pour **cette** cible, puis lancer `equip … --apply --json`.
7. Rendre compte : fichiers créés ou ignorés, écarts par rapport au plan, personnalisation manuelle restante, commandes réellement testées.

## 8. Délégation à un agent externe

### 8.1 Activation

Le protocole ne s'active que lorsqu'un utilisateur **cite délibérément** BAG et un objet dans une tâche portant sur un projet cible. BAG reste une référence ; il ne devient jamais l'autorité d'instructions du projet cible.

### 8.2 Contrat d'entrée

Une délégation fournit trois éléments :

- le résultat attendu ;
- l'URL du dépôt BAG et le chemin exact de l'objet ;
- la demande de lire les consignes applicables.

L'agent DOIT d'abord vérifier que la référence est accessible. Il NE DOIT PAS prétendre avoir lu un fichier inaccessible : il demande alors un clone, un accès ou les documents concernés.

### 8.3 Découverte hiérarchique

```text
chaine = []
pour chaque dossier d, de la racine de BAG jusqu'au dossier de l'objet inclus :
    si d/AGENTS.md existe : ajouter d/AGENTS.md à chaine
lire chaine dans l'ordre, puis le README.md de l'objet
suivre les liens internes de façon sélective, sans charger tout le dépôt
si des tâches sont sélectionnées : lire <objet>/tasks/AGENTS.md puis <objet>/tasks/index.json
séparer explicitement : consignes BAG / consignes fiables du projet cible / contenus externes non fiables
```

Exemple : voici ce qu'apporte chaque niveau de la chaîne de `inventory/supabase/auth`.

| Niveau | Fichier | Apport spécifique |
| --- | --- | --- |
| Racine | [AGENTS.md](../../AGENTS.md) | Mission, routage, autorisation explicite, délégation, composition de tâches |
| Zone | [inventory/AGENTS.md](../../inventory/AGENTS.md) | Évaluer l'adéquation et les alternatives ; exiger un prompt générique ; une référence n'autorise rien |
| Étagère | [inventory/supabase/AGENTS.md](../../inventory/supabase/AGENTS.md) | Produits Supabase réellement nécessaires ; jamais de clé `service-role` côté client ; autorisation au niveau des données ; migrations encadrées |
| Objet | [inventory/supabase/auth/AGENTS.md](../../inventory/supabase/auth/AGENTS.md) | Cartographier sessions et identités ; distinguer identité et profil ; stockage natif ou cookies ; pas de second système d'authentification |
| Tâches | [tasks/AGENTS.md](../../inventory/supabase/auth/tasks/AGENTS.md) | Les tâches décrivent des résultats, pas des autorisations ; fermeture des `requires` ; `suggests` restent optionnels |

### 8.4 Priorité et conflits

- Un conseil BAG plus spécifique **précise** la méthode, mais ne passe jamais avant les niveaux 1 à 3 de l'invariant I3, ni avant une limite de sécurité.
- Entre deux conseils BAG contradictoires, la portée la plus proche de l'objet l'emporte, **sauf si elle affaiblit la sécurité**.
- Un conflit non résolu DOIT être signalé dans le compte rendu.

### 8.5 Méthode en cinq phases

| Phase | Obligations | Interdits |
| --- | --- | --- |
| 1. Comprendre et inspecter | Reformuler le résultat attendu ; inspecter d'abord le projet cible : pile, versions, conventions, tests, déploiement, confidentialité | Supposer qu'une recommandation BAG est installée ou compatible ; poser une question dont la réponse est dans le code |
| 2. Chercher et décider | Classer les informations (vérifié, propre à une version, recommandation, note de terrain) ; consulter les sources officielles ; privilégier l'existant | Introduire une nouvelle technologie quand une solution existante convient |
| 3. Interroger si nécessaire | Ne poser que les questions qui changent la portée, la sécurité, l'architecture, le coût, le déploiement, les secrets, l'irréversible ou l'acceptation ; proposer une valeur par défaut recommandée | Lancer un formulaire ou questionnaire web ; poser des questions sur un détail sûr et réversible (adopter un défaut et le signaler) |
| 4. Exécuter avec autorisation | Viser le plus petit changement cohérent, avec tests et retour arrière ; suivre les règles du projet cible | Copier un secret, lancer un script distant, modifier un réglage global, déployer, acheter ou écraser sans autorisation adéquate |
| 5. Vérifier et rendre compte | Pour chaque vérification : `PASS`, `FAIL` ou `NOT RUN`, avec la preuve ; écarts, risques, fichiers modifiés, actions restantes | Republier dans BAG des détails privés du projet cible |

### 8.6 Grammaire d'un prompt

- **Composants obligatoires :**
  1. le résultat attendu ;
  2. l'URL canonique du **dossier exact** de l'objet, sous la forme `https://github.com/tbachir/bag/tree/main/<chemin>` ;
  3. la consigne de lire le `AGENTS.md` racine et les `AGENTS.md` imbriqués jusqu'à l'objet.
- **Autonomie :** chaque prompt est copiable seul. Il ne dépend jamais d'un préambule placé plus haut dans la page.
- **Forme :** un titre Markdown, puis un bloc de code `text`.
- **Exclusions :** la procédure détaillée (elle vit dans BAG), les secrets, toute promesse de sûreté ou d'installation d'un composant tiers.
- **Couverture :** chaque objet **réutilisable et permanent** DOIT exposer dans son README **au moins un** prompt générique. Il PEUT en ajouter autant que nécessaire ailleurs dans sa documentation, par exemple pour un audit, une migration ou un débogage, y compris entre deux étapes d'un tutoriel.
- **Dépôts dérivés :** pour un fork privé, une version figée ou un usage hors ligne, on remplace l'URL par le dépôt ou la référence accessible. Avant de diffuser un prompt comme prêt pour la production, on vérifie que le chemin existe.

```text
Integrate Supabase Auth into my project using its existing architecture and security conventions.

BAG item: https://github.com/tbachir/bag/tree/main/inventory/supabase/auth

Read BAG's root AGENTS.md and the nested AGENTS.md files down to this item. Use its documentation and official references, inspect my project, ask only for missing decisions, implement the appropriate changes, and verify them.
```

### 8.7 Compte rendu final

```text
Résultat : <atteint | partiel | bloqué> - <une phrase>
Périmètre effectif : <objet BAG, tâches demandées + prérequis ajoutés>
Fichiers modifiés : <liste>
Vérifications :
  PASS    <commande ou preuve>
  FAIL    <commande> - <cause>
  NOT RUN <vérification> - <raison>
Écarts par rapport au plan / au conseil BAG : <liste et justification>
Risques non résolus : <liste>
Actions restant à l'utilisateur : <liste>
Suggestions pour BAG (séparées, sans détails privés) : <liste>
```

## 9. Composition de tâches

### 9.1 Manifeste `tasks/index.json`

| Champ | Type | Sens |
| --- | --- | --- |
| `version` | entier | `1` |
| `item` | chaîne | Chemin de l'objet dans BAG, par exemple `inventory/supabase/auth` |
| `groups[]` | `{ id, title, tasks: id[] }` | Regroupement pour l'affichage. Chaque tâche appartient à exactement un groupe. |
| `tasks.<id>.title` | chaîne | Libellé lisible par un humain |
| `tasks.<id>.file` | chemin | Fiche Markdown de la tâche, relative au dossier `tasks/` |
| `tasks.<id>.default` | booléen | Présélection proposée par le compositeur |
| `tasks.<id>.requires` | id[] | Prérequis **obligatoires**, résolus de façon transitive |
| `tasks.<id>.suggests` | id[] | Recommandations **facultatives**, jamais ajoutées d'office |
| `tasks.<id>.conflicts` | id[] | Combinaisons incompatibles, à signaler |
| `tasks.<id>.provides` | chaîne[] | Capacités produites, par exemple `auth-client` |

### 9.2 Sémantique

| Relation | Effet sur la sélection | Divulgation |
| --- | --- | --- |
| `requires` | Ajoute la fermeture transitive des prérequis | Les prérequis ajoutés DOIVENT apparaître dans le compte rendu |
| `suggests` | Aucun effet | Proposé à l'utilisateur, qui décide |
| `conflicts` | Bloque l'exécution de la combinaison | Le conflit DOIT être signalé avant toute action |
| `default` | Présélection dans l'interface uniquement | — |
| `provides` | *Proposition* : permettre plus tard des prérequis exprimés en capacités, y compris entre objets | — |

L'agent NE DOIT PAS élargir le périmètre au-delà de la sélection et de ses prérequis obligatoires.

### 9.3 Résolution

L'algorithme ci-dessous est la **cible**. Le prototype ne réalise aujourd'hui que la fermeture des `requires`.

```text
entrée : S, l'ensemble des tâches choisies
R := fermeture transitive de S par requires
si le graphe des requires contient un cycle : erreur (manifeste invalide)
C := couples (a, b) de R tels que b ∈ conflicts(a) ou a ∈ conflicts(b)
si C est non vide : signaler et ne rien exécuter
P := R \ S                       # prérequis ajoutés, à divulguer
G := (union des suggests(t) pour t dans R) \ R   # suggestions, non ajoutées
ordre := tri topologique de R selon requires
sortie : ordre, P, G, C
```

### 9.4 Fiche de tâche

Chaque fiche contient les rubriques suivantes :

- **Outcome :** le résultat attendu ;
- **Preconditions :** ce qu'il faut inspecter et confirmer d'abord ;
- **Guidance :** les sources officielles et les garde-fous ;
- **Acceptance :** les vérifications observables, rapportées en `PASS`, `FAIL` ou `NOT RUN`.

Une fiche décrit un **résultat**, jamais une suite de commandes à exécuter aveuglément.

### 9.5 Prompt de tâches

Format produit par le prototype :

```text
Intègre ces tâches BAG dans mon projet :
https://github.com/tbachir/bag/tree/main/inventory/supabase/auth
Tâches : setup, sessions, oauth
Suis les AGENTS.md de BAG de la racine à cet item.
```

Le prompt reste court. Les corps des tâches et les détails de validation restent dans BAG.

### 9.6 Compositeur

- **[Existant]** [demo/task-composer.html](../../demo/task-composer.html) est une page autonome, sans dépendance :
  - les prérequis résolus sont cochés et verrouillés, avec la mention « (requis) » ;
  - un bouton copie le prompt ;
  - les données sont **intégrées en dur**, et le manifeste reste la source de vérité.
- **[Cible]** Le compositeur DEVRAIT être généré au moment de la construction du site, à partir de chaque `tasks/index.json`. Il DEVRAIT reprendre `default`, signaler les `conflicts`, afficher les `suggests` sans les cocher, et rester un simple générateur de prompt, sans exécuter quoi que ce soit (source : [demo/README.md](../../demo/README.md), « future production integrations »).

### 9.7 Exemple : Supabase Auth

```text
Une flèche A --> B signifie « B requiert A ».

setup --> sessions --> password            (default : setup, sessions, password)
                   +--> magic-link
                   +--> oauth
                   +--> account-isolation
rls  (aucun prérequis)  ··· suggère ···>  account-isolation
```

- Choisir `oauth` seul donne le périmètre effectif `setup`, `sessions`, `oauth`, avec les prérequis ajoutés `setup` et `sessions`.
- Choisir `rls` seul donne le périmètre `rls`, avec la suggestion `account-isolation`. Si l'utilisateur l'accepte, `sessions` et `setup` s'ajoutent.

## 10. Registre d'exposition

### 10.1 Trois relations distinctes

- **Canonique :** le fichier ou dossier qui fait autorité, maintenu à sa place.
- **Documenté :** le site et le Markdown de BAG rendent ou lient cette source, sans la copier.
- **Consommé :** un projet ou un agent l'utilise depuis un chemin que son environnement d'exécution reconnaît réellement.

Apparaître dans BAG ou sur le site ne signifie **pas** être installé, activé, digne de confiance ou synchronisé.

### 10.2 Descripteur `catalog/exposures/<item-id>.json`

| Champ | Contraintes |
| --- | --- |
| `schemaVersion` | `1` |
| `item` | Identifiant d'un objet existant dans `catalog/items/` ; égal au nom du fichier |
| `canonical` | Chemin local existant (fichier ou dossier), sans lien symbolique, dont le `realpath` est identique au chemin résolu |
| `docs[]` | Fichiers d'origine à rendre ou à lier, jamais à copier ; mêmes contrôles que `canonical` |
| `consumers[]` | `{ id (unique), kind, strategy, target, status, notes? }` |

Valeurs autorisées pour `kind` : `agent-skill`, `config`, `ci-workflow`, `script`, `asset`, `documentation`.

### 10.3 Stratégies

| Stratégie | Sens | Limite |
| --- | --- | --- |
| `reference` | Lien vers l'original | Aucune activation à l'exécution |
| `symlink` | Le consommateur pointe localement vers l'original | Non portable : le support dépend de l'OS, de l'agent et du checkout ; peut exiger le mode développeur sous Windows |
| `copy` | Installation curée et explicite d'un modèle | Diverge de l'original après copie ; passer par `bag plan` et `bag equip`, sans écrasement |
| `generate` | Production d'une sortie à partir de la source | Seulement avec un générateur relu séparément et des règles de propriété claires (le compilateur du site en est un exemple) |
| `native-reuse` | Mécanisme de réutilisation natif de la plateforme, par exemple `workflow_call` | Dépend de la plateforme |

Les entrées `symlink`, `generate` et `native-reuse` NE DOIVENT PAS être interprétées comme des instructions exécutables. Pour l'installation, la politique `reference` ou `copy` du catalogue reste la seule qui fasse autorité.

### 10.4 Statuts des consommateurs

| Statut | Sens |
| --- | --- |
| `documented` | Décrit ; aucune prétention d'activation |
| `opt-in` | Mise en place possible si un développeur le choisit ; rien n'est automatique |
| `active` | Utilisé à l'exécution : **ce statut exige une preuve** dans le chemin réellement lu par le consommateur |

### 10.5 Cas particuliers

- **Skills :** le **paquet complet** (`SKILL.md`, `references/`, `scripts/`) reste dans `skill-tree/skills/<slug>/`. Un lien symbolique local, par exemple vers `.agents/skills/<slug>`, n'est créé que par adhésion volontaire. La procédure PowerShell refuse d'agir si la destination existe. On ne suppose jamais qu'un agent suit les liens symboliques ou leur fait confiance.
- **CI :** seul `.github/workflows/` est actif. Pour réutiliser un workflow, on passe par `workflow_call`. GitHub ne découvre pas les workflows au travers de liens symboliques : il ne faut jamais compter dessus.
- **Configurations :** on conserve un seul modèle curé, que le projet cible adopte vers un chemin déclaré, puis dont il relit les valeurs propres. Les réglages existants ne sont jamais écrasés.

### 10.6 Validation [Existant]

`validate-exposures.mjs` vérifie que :

- l'objet existe dans le catalogue ;
- `canonical` et `docs` existent dans BAG, sans remontée de dossier ni ambiguïté de lien symbolique ;
- les identifiants de consommateurs sont uniques ;
- `kind`, `strategy` et `status` ont des valeurs connues, et `target` n'est pas vide.

La preuve d'un statut `active` relève de la revue humaine.

## 11. Skills

### 11.1 Paquet de skill

```text
skill-tree/skills/<slug>/
  SKILL.md        en-tête YAML (name, description) + déclencheur, entrées, méthode, sortie, sécurité, références
  references/     uniquement si nécessaire
  scripts/        assistants relus, documentés, sans effet de bord sur des comptes ou des projets
```

Un skill répond à trois questions : *quand l'utiliser*, *de quelles entrées a-t-il besoin*, *qu'est-ce qui compte comme terminé*. Il n'est jamais actif tant qu'un client compatible ne l'a pas installé et chargé explicitement. Les chemins d'installation varient selon le produit. D'après le README du skill o2switch, il s'agit de `~/.agents/skills/` ou `.agents/skills/` pour Codex, et de `~/.claude/skills/` ou `.claude/skills/` pour Claude Code. Ces chemins sont à revérifier dans la documentation officielle de chaque client, et une session peut devoir être redémarrée.

### 11.2 Méta-skill `bag-inventory`

Ce skill apprend à un agent le protocole décrit au §7.7. Il précise ses préconditions (un clone local, Node.js 20+), sépare la découverte et la préparation (lecture seule) de l'équipement (après accord), et indique quand s'arrêter ou demander. Il impose aussi un compte rendu normalisé : recommandation, plateformes, cible, opérations prévues, limite de l'accord, fichiers créés ou ignorés, travail manuel restant, commandes réellement testées.

### 11.3 Gabarit « skill de domaine à preuves »

Le skill [o2switch Cloud](../../skill-tree/skills/o2switch-cloud/SKILL.md) en est l'implémentation de référence. Tout skill qui porte sur un fournisseur ou une plateforme DEVRAIT reprendre les sept éléments suivants.

1. **Périmètre exact.** L'Offre Unique Cloud, et non un hébergement mutualisé générique ou un VPS avec accès root.
2. **Miroir de l'interface réelle.** 11 rubriques et 65 outils, dans l'ordre de cPanel, chacun lié à sa page officielle.
3. **Taxonomie de preuves.**

   | Statut | Sens | Effectif (31 décisions) |
   | --- | --- | --- |
   | `documented` | Documenté ; activation sur le compte non vérifiée | 17 |
   | `conditional` | Possible sous conditions critiques | 6 |
   | `verify` | Preuve insuffisante : ni « possible », ni « impossible » | 7 |
   | `not_suitable` | Présent, mais inadapté à l'usage visé (par exemple une file de tâches sur un Redis non sauvegardé) | 1 |
   | `unsupported_confirmed` | Interdiction explicite et récente, avec source | 0 |

   Règle : on ne transforme **jamais** « non confirmé » en « impossible ». Le fait qu'aucune décision ne soit classée `unsupported_confirmed` découle directement de cette règle.

4. **Ordre de recherche, natif d'abord.** Dans l'ordre :
   1. un outil exclusif du fournisseur ;
   2. une fonction de cPanel ;
   3. un runtime ou l'accès SSH de l'utilisateur ;
   4. une adaptation de l'architecture à l'offre ;
   5. une clarification auprès du support ;
   6. en dernier recours seulement, une solution externe.
5. **Format de réponse.** Verdict, puis solution native, chemin dans cPanel, procédure, limites, vérification à faire sur le compte et URL officielle. Le plan B vient après la solution native.
6. **Index hors ligne** (`query.py`, bibliothèque standard uniquement) :
   - les accents sont normalisés (NFKD) et la requête est découpée en mots ;
   - des synonymes élargissent la recherche (`nextjs` vers `nodejs passenger next_ssr`, etc.) ;
   - score : 100 si l'identifiant est exact, 15 par mot trouvé dans le titre, 2 par mot trouvé dans le corps ;
   - seuls les 8 meilleurs résultats sont gardés ;
   - la réponse rappelle toujours : « documenté n'est pas activé sur le compte ».
7. **Datation et provenance.** `verified_at: 2026-10-27`, `account_access: false`, aucune donnée de compte. Les tests figent les invariants : 11 rubriques, 65 URL officielles, `account_activation: not_verified` pour chaque outil, 31 décisions avec leurs statuts clés, et présence d'une source officielle comme d'une vérification de compte pour chaque décision.

## 12. Publication statique

### 12.1 Principe

Le site est **une vue en lecture** de BAG, jamais un second lieu de rédaction. Il est construit avec Fumadocs et Next.js en export statique : ni base de données, ni clé d'API, ni serveur Node.js à l'exécution. Il est versionné à part, dans `apps/docs`.

Versions épinglées au 2026-10-27 : Node.js 22+, pnpm 10.34.5, Next 16.4.2, fumadocs-core et fumadocs-ui 16.17.8, fumadocs-mdx 15.4.10, React 19.3, TypeScript 7.

### 12.2 Pipeline

```text
git ls-files ──> generate.mjs ──> .generated/content/*.md + meta.json + manifest.json
                              └──> public/files/<chemin> (ressources techniques)
next build (export, webpack, 1 CPU) ──> out/ (HTML, recherche, llms, OG)
finalize.mjs ──> out/docs/<page>.md (raccourcis Markdown) + out/.nojekyll
check-export.mjs ──> audit : pages, raccourcis, ressources, liens et ancres
```

### 12.3 Règles de compilation [Existant]

- **Périmètre :**
  - seuls les fichiers **suivis par Git** sont lus ; un nouveau fichier doit passer par `git add` avant d'apparaître ;
  - sont publiés : les 7 zones, `catalog/`, `templates/`, `demo/` et le Markdown placé à la racine ;
  - ne sont pas publiés : `apps/`, `tests/` et `.github/`.
- **Routage :**
  - les chemins sont mis en minuscules (`SKILL.md` devient `skill`, `AGENTS.md` devient `agents`) ;
  - un `README` devient la page `index` de son dossier ;
  - deux sources qui produisent la même URL provoquent une erreur.
- **Métadonnées :**
  - titre : celui du frontmatter, sinon le premier H1, sinon le nom du fichier ;
  - description : celle du frontmatter, sinon le premier paragraphe tronqué à 180 caractères ;
  - le H1 est retiré du corps s'il répète le titre.
- **Identifiants de titres :** calculés comme sur GitHub (`github-slugger`). La syntaxe `{#id}` est prise en charge, et les sélecteurs de variante d'emoji sont normalisés.
- **Neutralisation :**
  - le HTML brut est converti en texte ;
  - les exemples qui ressemblent à du JSX ou contiennent des accolades sont affichés tels quels, jamais exécutés comme du MDX ;
  - les scripts et manifestes sont servis comme fichiers, jamais exécutés.
- **Ressources :** tout fichier non Markdown est publié sous `/files/<chemin>` et listé sur la page générée `/docs/downloads/`.
- **Sorties :**
  - le fichier `manifest.json` (`version`, `pages`, `assets`) trace la correspondance entre source et URL ;
  - chaque `meta.json` fixe l'ordre de navigation : introduction, zones, 7 zones, `catalog`, `templates`, `demo`, téléchargements, puis le reste par ordre alphabétique.

### 12.4 Réécriture des liens

| Lien rencontré | Traitement |
| --- | --- |
| Avec un schéma (`https:`, `mailto:`) ou commençant par `//` | Inchangé |
| `#ancre` | Résolu vers l'identifiant réel du titre dans la page |
| `/docs/...` écrit à la main | Vérifié contre la table des routes ; erreur s'il est inconnu |
| Relatif, ou absolu depuis la racine du dépôt | Résolu ; une sortie de BAG provoque une erreur |
| Vers une page, ou vers un dossier contenant un README | URL de la page, ancre convertie |
| Vers une ressource | `/files/<chemin>` |
| Vers un fichier suivi mais hors périmètre | `https://github.com/tbachir/bag/blob/main/<chemin>` |
| Vers une cible inexistante ou non suivie par Git | Erreur `Missing local link` |

Les liens écrits sous forme de définition de référence (`[x]: chemin`) sont traités de la même façon.

### 12.5 Garde-fous

La génération échoue, sans toucher à la génération précédente, dans les cas suivants :

- une source est un lien symbolique ;
- un chemin remonte au-dessus de la racine ;
- un nom de fichier ressemble à un secret : `.env*` (sauf `.env.example`, `.env.sample` et `.env.template`), `*.pem`, `*.key`, `*.p12`, `*.pfx` ou `*.secret` ;
- deux sources produisent la même route ;
- un lien local est cassé.

Le compilateur ne possède que `.generated/` et `public/files/`, qu'il remplace intégralement.

### 12.6 Surfaces pour les agents

| URL | Contenu |
| --- | --- |
| `/llms.txt` | Index de la documentation |
| `/llms-full.txt` | Texte complet concaténé |
| `/llms.mdx/docs/<page>/content.md` | Markdown traité d'une page |
| `/docs/<page>.md` | Raccourci Markdown, servi comme vrai fichier, sans négociation de contenu |
| `/api/search` | Index de recherche précalculé (Orama), interrogé dans le navigateur |
| `/files/...`, `/docs/downloads/` | Fichiers techniques d'origine |

### 12.7 Hébergement

- `DOCS_SITE_URL` donne l'origine publique, sans chemin.
- `DOCS_BASE_PATH` est vide ou de la forme `/seg(/seg)*`, avec des segments en `[A-Za-z0-9_-]`. Il ne contient ni origine, ni `..`, ni chaîne de requête. Il est appliqué aux ressources, à la recherche, aux liens, au Markdown, aux téléchargements et aux images OG.
- Le site sert de vrais fichiers `index.html`, avec de vraies réponses 404 et sans redirection globale vers une page d'application. Le fichier `.nojekyll` préserve `_next/` sur GitHub Pages.
- Hébergement par défaut : `https://tbachir.github.io/bag/`. Vercel est possible en option, avec le dossier racine `apps/docs` et la sortie dans `out`.

### 12.8 Contraintes d'exploitation

- La construction utilise Webpack plutôt que Turbopack, sans cache en production, avec `experimental.cpus = 1`. Playwright tourne avec un seul worker. Ces choix tiennent dans une machine à mémoire limitée.
- `lightningcss` est forcé en 1.33.0 pour prendre en charge les sélecteurs `::highlight()` de la recherche.
- `apps/docs/AGENTS.md` est réécrit par `next dev`. Il est conservé dans Git pour éviter un écart récurrent dans l'arbre de travail.

## 13. Qualité, tests et CI

### 13.1 Validateurs

| Commande | Vérifie | Ne vérifie pas |
| --- | --- | --- |
| `node spellbook/scripts/validate.mjs` | Présence des README des 7 zones ; existence des cibles de liens Markdown locaux (images exclues) ; aucune sortie du dépôt | URL externes, ancres, liens par référence. Attention : les blocs de code sont analysés comme du texte, donc un exemple de lien dans un bloc de code est vérifié comme un vrai lien. |
| `node spellbook/scripts/bag.mjs validate --json` | Tout le §6 | La pertinence des contenus |
| `node spellbook/scripts/validate-exposures.mjs` | Tout le §10.6 | La preuve d'un statut `active` |
| `node --test tests/*.test.mjs` | Voir §13.2 | — |
| `pnpm test:unit`, `pnpm build`, `pnpm types:check`, `pnpm test:e2e` (dans `apps/docs`) | Compilateur, export, types, parcours dans le navigateur | — |

### 13.2 Tests

**Noyau** : [tests/catalog.test.mjs](../../tests/catalog.test.mjs) et [tests/o2switch-skill.test.mjs](../../tests/o2switch-skill.test.mjs), soit 10 tests réussis le 2026-10-27.

- Le catalogue est valide et cohérent : la recherche positive et la recherche négative fonctionnent, et un loadout inconnu est refusé.
- Les chemins sûrs et dangereux sont classés correctement, et la grammaire concorde avec l'expression du schéma.
- `plan` n'écrit rien (3 `create`, 4 `reference-only`). `apply` crée les 3 fichiers. Une seconde application donne 3 `exists-skip` et **préserve le contenu modifié** par l'utilisateur.
- Un lien symbolique en destination est refusé, et rien n'est écrit hors de la cible.
- Un manifeste dont la source est dangereuse est refusé.
- La CLI émet un JSON exploitable.
- Les invariants du skill o2switch sont figés (§11.3).

**Site** : [apps/docs/scripts/generate.test.mjs](../../apps/docs/scripts/generate.test.mjs) couvre la compilation, les liens par référence, la préservation des exemples, le déterminisme et le nettoyage, les collisions (sans écraser une génération valide), les liens manquants ou qui sortent du dépôt, les liens symboliques, les noms de type secret, la réécriture des préfixes, l'audit avec et sans préfixe, et les ancres avec emoji.

**Parcours dans le navigateur** : 4 scénarios, sur bureau et sur mobile.

- Navigation entre les zones.
- Recherche d'une page profonde (`account-isolation`).
- Lecture d'un skill, avec un lien vers la source GitHub d'origine.
- Raccourcis Markdown, téléchargements, textes pour les LLM, image OG et vraie réponse 404.

### 13.3 Workflows

- [validate.yml](../../.github/workflows/validate.yml) se déclenche à chaque push et à chaque PR, avec Node.js 24 et le droit `contents: read`. Il lance `validate.mjs`, `bag.mjs validate --json` et `node --test tests/*.test.mjs`.
- [docs.yml](../../.github/workflows/docs.yml) se déclenche sur les PR, les push sur `main` et à la demande.
  - Une matrice séquentielle construit deux variantes : `root` (sans préfixe) et `github-pages` (`/bag`).
  - Chaque variante enchaîne : installation avec lockfile figé, tests unitaires, construction, vérification des types, Playwright et artefacts.
  - Sur `main` seulement, l'export `/bag` est empaqueté avec `tar`. L'action officielle d'upload ignore les fichiers commençant par un point, ce qui supprimerait `.editorconfig.template` et `.gitignore.template` de `/files/`.
  - Un job de déploiement séparé est le seul à recevoir `pages: write` et `id-token: write`. Une PR ne publie jamais, et un échec de validation bloque la publication.

### 13.4 Définition de « terminé » pour une contribution

- L'index de zone le plus proche est à jour et les liens croisés pertinents sont en place.
- Les faits ont été vérifiés auprès des sources primaires, ou ce qui reste non vérifié est indiqué, avec la date et la version.
- La contribution ne contient ni secret, ni chemin privé, ni contenu sans licence.
- Toutes les validations du §13.1 qui concernent la modification réussissent.
- Pour un loadout : les conflits de destination ont été inspectés et l'absence d'écrasement a été testée.
- Le compte rendu indique exactement ce qui a changé, ce qui a été vérifié et ce qui ne l'a pas été.

## 14. Modèle de menace

| Menace | Vecteur | Contre-mesure | Où |
| --- | --- | --- | --- |
| Injection d'instructions | Note de catalogue, `SKILL.md` tiers, README externe | Contenu traité comme donnée, ordre de priorité, aucune exécution | I3, protocole, `bag-inventory` |
| Écriture hors du projet | `"to": "../../.bashrc"` | Grammaire des chemins, `inRoot`, schéma JSON | `catalog/lib.mjs` |
| Évasion par lien symbolique | Lien dans la cible ou dans un parent de la destination | Contrôle `lstat` de chaque segment, refus | `checkDestination`, test |
| Course entre vérification et écriture | Fichier créé entre le plan et l'application | Revérification, `COPYFILE_EXCL`, `EEXIST` traité en `exists-skip` | `applyPlan` |
| Écrasement | Destination existante | `exists-skip`, aucun drapeau d'écrasement | CLI, test de préservation |
| Source piégée | Lien symbolique dans BAG pointant vers un secret | La source doit être un fichier régulier, sans lien symbolique sur tout le trajet | `safeSource`, compilateur |
| Fuite de secret | `.env`, clés | `.gitignore`, refus par le compilateur, `SECURITY.md`, révocation (l'historique Git persiste) | Dépôt, `generate.mjs` |
| Chaîne d'approvisionnement | Dépendances npm | Noyau sans dépendance ; site isolé, versions épinglées, installation `--frozen-lockfile` | `apps/docs`, CI |
| Exécution de contenu publié | MDX, JSX ou HTML dans le Markdown | HTML converti en texte, pas de MDX exécuté, scripts servis comme fichiers | Compilateur, tests |
| Privilèges CI excessifs | Workflow | `contents: read` par défaut ; écriture Pages limitée au job de déploiement sur `main` | `docs.yml` |
| Fait périmé présenté comme vrai | Évolution de l'offre d'un fournisseur | Datation, provenance, statuts de preuve, revérification à la source | Gabarits, skills |
| Autorisation implicite | « Recommandé » interprété comme permission | I4 : un plan ne vaut pas accord, l'accord est donné par cible | `AGENTS.md`, CLI |
| Collision de destinations | Deux objets visent le même fichier | Rejet par la validation du loadout | `validateLoadout` |
| Fuite du projet cible vers BAG | Un agent republie des détails privés | Suggestions pour BAG séparées et expurgées | Protocole, phase 5 |

## 15. Écarts entre l'existant et la cible

| # | Écart | Constat | Cible | Priorité |
| --- | --- | --- | --- | --- |
| E1 | La validation des expositions n'est pas lancée en CI | `validate.yml` n'appelle pas `validate-exposures.mjs`, que la documentation impose pourtant | Ajouter l'étape au workflow | Haute |
| E2 | Le schéma d'exposition est plus permissif que son validateur | `canonical` accepte des segments `.` et `//`, et `docs[]` n'a pas de motif | Reprendre la grammaire `relativePath` du §6.4, avec un test de concordance (précédent : commit `cf238c9` pour les objets) | Haute |
| E3 | Le manifeste de tâches n'a ni schéma ni validateur | Rien ne vérifie l'existence des fichiers, les identifiants, l'absence de cycle ou la partition en groupes | Ajouter `catalog/schemas/tasks.schema.json` et un validateur sans dépendance, exécuté en CI | Haute |
| E4 | Le compositeur est indépendant du manifeste | Données intégrées en dur ; présélection de `setup` et `sessions` alors que le manifeste indique aussi `password` en `default` ; `suggests` et `conflicts` sont ignorés | Le générer à la construction du site depuis les manifestes (§9.6) | Moyenne |
| E5 | Objet délégable absent du catalogue | Supabase Auth n'a pas de manifeste, car c'est un *documentation scaffold* | Ajouter un manifeste `status: evaluating`, `mode: reference` | Moyenne |
| E6 | Tableaux Markdown altérés | Un `\n` littéral apparaît dans une ligne de tableau de [loadouts/README.md](../../loadouts/README.md) (corrigé dans [maps-and-guides/README.md](../README.md) par cette contribution) | Corriger | Basse |
| E7 | Étagères vides | Bibliothèques, dépôts, ressources, outils, commandes, pratiques, tutoriels, références, MCP, plugins et profils d'agents sont marqués « *to be curated* » | Remplissage curé (M8) | Continue |
| E8 | Loadouts peu nombreux | Seuls `ai-coding` et `node-project` existent | Développement Windows, Next.js, Expo mobile, offline-first, auto-hébergement, observabilité, à mesure que des objets `ready` existent (source : [loadouts/README.md](../../loadouts/README.md)) | Continue |
| E9 | « Equipped » n'est visible nulle part | L'état est dérivé mais jamais calculé | *Proposition* : `show` liste les loadouts qui contiennent l'objet, en lecture seule | Basse |
| E10 | Fraîcheur non mesurée | La date de revue n'existe que dans les fiches Markdown | *Proposition* : un champ de date de revue optionnel et un rapport de péremption en lecture seule. Comme `additionalProperties` vaut `false`, ce changement appelle une politique de version de schéma (E11). | Basse |
| E11 | Pas de politique d'évolution des schémas | Tout est en `schemaVersion: 1` | *Proposition* : un ajout facultatif reste en v1 si le validateur est mis à jour dans le même commit ; une rupture passe en v2, la CLI lisant v1 et v2 pendant une transition documentée | Basse |
| E12 | Pas de gabarit de compte rendu de délégation | Le format n'est décrit que dans le protocole | *Proposition* : `templates/delegation-report.md` (voir §8.7) | Basse |

## 16. Plan de reconstruction

Chaque jalon est livrable seul et vérifiable. M0 à M7 reproduisent l'existant ; M8 et M9 atteignent la cible.

| Jalon | Livrables | Critères d'acceptation |
| --- | --- | --- |
| **M0 Fondations** | README racine (7 zones, boucle de jeu, règles), `AGENTS.md`, `CONTRIBUTING.md`, `SECURITY.md`, zones et étagères avec README, `templates/item.md`, `.editorconfig`, `.gitignore`, modèle de PR, `loot/inbox.md`, `validate.mjs`, `find.mjs`, `validate.yml` | `validate.mjs` réussit. Chaque dossier a un README. Aucun motif de secret n'est suivi par Git. |
| **M1 Catalogue et CLI** | Schémas d'objets et de loadouts, `catalog/lib.mjs`, `bag.mjs`, au moins 8 objets et 2 loadouts, `tests/catalog.test.mjs` | Les tests du §13.2 réussissent. `plan` n'écrit rien. Une seconde application préserve le contenu. Les liens symboliques et les chemins dangereux sont refusés. Grammaire et schéma concordent. |
| **M2 Skills** | `_template/SKILL.md`, skill `bag-inventory`, manifestes `reference` | Le skill ne cite que des commandes qui existent. L'adhésion volontaire est explicite. |
| **M3 Délégation** | Protocole, guide des prompts intégrés, gabarit d'objet délégable, chaîne `AGENTS.md` de la zone à l'objet, objet Supabase Auth avec prompt générique et prompts de tutoriel | Chaque prompt contient ses trois composants et se copie seul. Chaque maillon de la chaîne apporte une consigne propre. |
| **M4 Tâches** | `tasks/index.json`, fiches de tâches, `tasks/AGENTS.md`, README des sous-dossiers, `task-composer.html`, guide | Toutes les fiches existent. Les `requires` sont acycliques. Les groupes forment une partition des tâches. Le compositeur verrouille les prérequis. |
| **M5 Skill à preuves** | Skill o2switch : plan cPanel, catalogue JSON, 31 capacités, notes, `query.py`, tests | Invariants du §11.3 figés par les tests. Aucune donnée de compte. Corpus daté. |
| **M6 Exposition** | Schéma, descripteur, `validate-exposures.mjs`, guide | Le validateur réussit. Aucun consommateur n'est `active` sans preuve. |
| **M7 Publication** | `apps/docs` : compilateur, finalisation, audit, tests unitaires et de parcours, `docs.yml` avec déploiement Pages | Construction avec et sans `/bag`. Audit sans erreur. 4 scénarios sur 2 formats d'écran. Une PR ne publie jamais. |
| **M8 Consolidation** | Écarts E1 à E6, puis E9 à E12 selon les priorités | Les nouvelles validations tournent en CI. Le compositeur est dérivé des manifestes. |
| **M9 Remplissage** | Objets curés dans chaque étagère, nouveaux loadouts, descripteurs d'exposition pour les ressources à plusieurs consommateurs | Chaque objet satisfait le §5.5 et le §13.4. |

Dépendances : M1 dépend de M0. M2, M3 et M5 dépendent de M1. M4 dépend de M3. M6 dépend de M1 et M5. M7 dépend de M0, et plus il arrive tard, plus il a de contenu à montrer. M8 dépend de M4, M6 et M7.

## 17. Critères d'acceptation du résultat final

Le résultat final est atteint quand chaque affirmation ci-dessous est vraie et vérifiable par une commande, un test ou une revue.

**Contenu**

- [ ] Chaque étagère contient au moins un objet `ready`, ou annonce honnêtement qu'elle est vide.
- [ ] Chaque objet `ready` indique sa source officielle, sa date de revue, sa compatibilité et ses limites.
- [ ] Le Butin ne contient que des entrées datées, avec une prochaine étape.

**Machine**

- [ ] Chaque objet réutilisable possède un manifeste valide.
- [ ] Chaque loadout ne référence que des objets `ready`, sans collision de destination.
- [ ] `bag.mjs validate` et tous les validateurs réussissent en CI.

**Délégation**

- [ ] Chaque objet réutilisable et permanent expose un prompt générique autonome.
- [ ] Chaque arbre de tâches est validé par un schéma : fichiers présents, aucun cycle, partition en groupes.
- [ ] Le compositeur du site est dérivé des manifestes.

**Sécurité**

- [ ] Aucune commande n'écrit sans `--apply`.
- [ ] Aucune écriture n'écrase un fichier.
- [ ] Aucun accès réseau ni sous-processus dans le noyau.
- [ ] Aucun secret dans l'historique publié.
- [ ] Aucun consommateur `active` sans preuve.

**Publication**

- [ ] Chaque page source a une page HTML et un raccourci `.md`.
- [ ] `llms.txt` liste toutes les pages.
- [ ] L'audit de l'export ne relève aucun lien ni aucune ancre cassés, avec et sans préfixe.
- [ ] Seul `main` publie.

**Honnêteté**

- [ ] Chaque compte rendu, humain ou agent, classe ses vérifications en `PASS`, `FAIL` ou `NOT RUN`.
- [ ] Aucun fait daté n'est présenté sans sa date.

## 18. Glossaire

| Terme | Définition |
| --- | --- |
| Objet (*item*) | Unité curée de BAG : fiche Markdown et, si elle est réutilisable par une machine, manifeste JSON |
| Zone | L'une des sept grandes sections de navigation |
| Étagère (*shelf*) | Sous-section d'une zone, par exemple `inventory/libraries` |
| Butin (*loot*) | Découverte non évaluée, qui n'a valeur ni de recommandation ni d'invitation à exécuter |
| Loadout | Composition d'objets `ready` pour une quête, à la fois guide humain et manifeste JSON |
| Plan | Prévisualisation en lecture seule des actions d'un `equip` |
| Équiper | Copier dans un projet existant, après accord, les seuls modèles locaux déclarés `copy` |
| Référence | Objet de découverte, jamais installé |
| Canonique | Emplacement unique qui fait autorité pour une ressource |
| Consommateur | Projet, agent ou site qui utilise une ressource canonique selon une stratégie déclarée |
| Chaîne `AGENTS.md` | Suite ordonnée des `AGENTS.md`, de la racine de BAG jusqu'au dossier d'un objet |
| Délégation | Transmission d'un objet BAG à un agent travaillant dans un projet cible, selon le protocole du §8 |
| Tâche | Résultat composable d'un objet, décrit par une fiche et relié par `requires`, `suggests` et `conflicts` |
| `PASS`, `FAIL`, `NOT RUN` | Les trois seuls verdicts admis pour une vérification rapportée |
