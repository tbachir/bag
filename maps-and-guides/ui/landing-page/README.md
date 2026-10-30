# Landing page publique : gabarit et checklist de mise en ligne

> Un gabarit HTML autonome, prêt à adapter, et la checklist de ce qu'il faut mettre en place autour : outils, référencement, visibilité dans les IA et obligations légales en France / UE.

- **Catégorie :** maps-and-guides (guide UI)
- **Statut :** evaluating · gabarit relu et testé en navigateur, pas encore livré en production
- **Dernière vérification des sources :** 2026-10-30
- **S'applique à :** page publique d'une application ou d'un produit (visiteurs non connectés), hébergée n'importe où (fichier statique, Next.js, Astro…). Le volet réglementaire vise la France et l'Union européenne.
- **Fichiers :** [landing.html](landing.html) · [robots.txt.example](robots.txt.example) · [llms.txt.example](llms.txt.example)

> ⚠️ Ce guide résume des sources officielles pour éviter les oublis. Ce n'est pas un conseil juridique : pour un cas précis, faites relire les mentions et la politique de confidentialité.

## À quoi ça sert

La landing est la seule page que voient les visiteurs non connectés, les moteurs de recherche et les robots d'IA. Elle concentre donc des sujets qu'on traite d'habitude trop tard : balises et données structurées, robots.txt, bandeau cookies, mentions légales, accessibilité. Ce guide les regroupe en une passe, avec un gabarit qui les applique déjà.

À ne pas utiliser pour : l'interface connectée d'une application, ou un site éditorial à plusieurs pages (les principes restent valables, mais le gabarit est une page unique).

## Déléguer : utiliser cet item dans mon projet

À copier dans votre agent de code **depuis le projet cible** :

```text
Crée ou mets à niveau la landing page publique de mon projet en suivant ce guide BAG.

BAG item: https://github.com/tbachir/bag/tree/main/maps-and-guides/ui/landing-page

Lis le AGENTS.md racine de BAG et les AGENTS.md imbriqués jusqu'à cet item, puis ce README et landing.html. Inspecte mon projet (stack, jetons de design, routes d'inscription et de connexion, fonctions réellement activées) avant d'écrire. N'annonce aucune fonction désactivée. Applique les sections Référencement, IA et Réglementation, liste ce qui reste à fournir par moi (raison sociale, hébergeur, outil de mesure d'audience) et vérifie la page en mobile et en desktop.
```

### Déléguer cette étape : audit sans modification

```text
Audite la landing page publique de mon projet avec la checklist finale de ce guide BAG, sans modifier de fichier. Classe les manques par gravité (légal, accessibilité, référencement, confort).

BAG item: https://github.com/tbachir/bag/tree/main/maps-and-guides/ui/landing-page

Lis la chaîne AGENTS.md de BAG jusqu'à cet item et suis ses références.
```

## Le gabarit `landing.html`

Un seul fichier, sans dépendance ni build : polices système, CSS et JavaScript inline, thème clair/sombre automatique, mise en page mobile d'abord. Ouvrez-le directement dans un navigateur.

- **Mode annoté :** ajoutez `?notes` à l'URL (`landing.html?notes`). Chaque choix (balises du `<head>`, données structurées, accessibilité, pied de page légal) affiche une note qui renvoie à la section correspondante de ce guide.
- **À remplacer :** le produit fictif « Northwind », `https://example.com`, les liens `https://example.com/inscription`, `/connexion` et les pages légales, le logo SVG et les jetons de couleur dans `:root`.
- **Avant de livrer :** supprimez le bloc `<script type="application/json" id="notes">`, le script qui l'affiche et les attributs `data-note`.

Le gabarit reprend une direction volontairement sobre (une colonne, CTA dès le premier écran, FAQ en texte). Pour une autre direction, voir la section suivante.

## 1. Choisir une direction

Trois directions couvrent l'essentiel des cas. Elles ont été construites et comparées côte à côte sur un même produit avant d'écrire ce guide.

| Direction | Forme | Quand c'est le bon choix | Son coût |
| --- | --- | --- | --- |
| **Pamphlet** | Un écran, la connexion est le héros : choix de la méthode puis « Continuer » | Les visiteurs ont déjà un compte (app mobile d'abord, outil interne) : il faut les faire entrer vite | Peu mémorable ; convainc mal un nouveau visiteur |
| **Editorial** | Récit en chapitres numérotés, grande typographie ; le titre sert de sommaire | Produit grand public ou nouveau : il faut convaincre et donner une personnalité | Long défilement ; paraît vide si le produit offre peu de fonctions |
| **Tour** | Aperçu interactif du produit (données d'exemple), un onglet par public | B2B, outils d'équipe, API : montrer l'écran vaut mieux que le décrire | Le plus dense ; l'aperçu doit suivre les vrais écrans, sinon il ment |

Deux règles quelle que soit la direction :

- **N'annoncer que ce qui est activé.** Dérivez la liste des fonctions (méthodes de connexion, organisations, clés API…) de la configuration réelle du produit, pas d'une liste écrite à la main. Une fonction désactivée affichée sur la landing est une promesse non tenue.
- **Comparer avant de choisir.** Construisez les directions candidates en entier, avec du vrai contenu, et passez de l'une à l'autre au même endroit, en taille réelle, avant d'en garder une. Des vignettes côte à côte faussent l'échelle et l'espacement.

## 2. Outils à mettre en place

| Besoin | Quoi | Remarque |
| --- | --- | --- |
| Indexation | [Google Search Console](https://search.google.com/search-console) et [Bing Webmaster Tools](https://www.bing.com/webmasters) | Déclarez le domaine, soumettez `sitemap.xml`, surveillez la couverture. |
| Performance réelle | [PageSpeed Insights](https://pagespeed.web.dev/) (données terrain CrUX) | Voir les seuils Core Web Vitals plus bas. |
| Mesure d'audience | Un outil configurable pour rester **exempté de consentement** (voir Cookies) | Sinon il faut un bandeau de consentement. Vérifiez la configuration, pas la réputation de l'outil. |
| Disponibilité et erreurs | Une sonde de disponibilité et un suivi d'erreurs front | Utile dès le lancement ; à déclarer dans la politique de confidentialité si des données personnelles sont traitées. |
| Données structurées | [Schema Markup Validator](https://validator.schema.org/) et le [test des résultats enrichis](https://search.google.com/test/rich-results) | Le nom de site (`WebSite`) n'est pas couvert par le test des résultats enrichis : utilisez le validateur schema.org. |

## 3. Référencement (SEO)

- **Balises de base :** un `<title>` unique, une `meta description`, `<link rel="canonical">`, `lang` sur `<html>`, Open Graph (`og:title`, `og:description`, `og:image`, `og:site_name`) pour les aperçus de liens.
- **Contenu en texte :** le message principal, les fonctions et la FAQ doivent exister en texte HTML, pas seulement dans des images ou du rendu côté client tardif.
- **`robots.txt` et `sitemap.xml`** à la racine. N'y bloquez pas les ressources (CSS, JS, images) nécessaires au rendu. Exemple commenté : [robots.txt.example](robots.txt.example).
- **Nom du site :** données structurées `WebSite` (`name`, `url`, éventuellement `alternateName`) **sur la page d'accueil**. Google tient aussi compte de `og:site_name`, du `<title>` et des titres. Un seul nom par domaine ou sous-domaine.
- **Organisation :** données structurées `Organization` sur l'accueil ou la page « À propos ». Aucune propriété n'est obligatoire ; Google recommande `name`, `url`, `logo` (112×112 px minimum), `sameAs` et les moyens de contact pertinents. JSON-LD est le format recommandé.
- **Cohérence :** ne balisez que ce qui est visible sur la page.
- **Core Web Vitals** (75ᵉ percentile des visites, mobile et desktop séparés) : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.

## 4. Visibilité dans les IA

- **Google (AI Overviews, AI Mode) :** aucune exigence ni optimisation spéciale. Google indique qu'il n'est pas nécessaire de créer des fichiers dédiés aux IA ni un balisage particulier : les bonnes pratiques SEO ci-dessus suffisent (exploration autorisée, liens internes, contenu en texte, données structurées conformes au texte visible).
- **Robots d'IA : séparer entraînement et recherche.** Chaque éditeur publie des jetons distincts, réglables indépendamment dans `robots.txt` :

| Éditeur | Entraînement des modèles | Recherche / citation | Requête d'un utilisateur |
| --- | --- | --- | --- |
| OpenAI | `GPTBot` | `OAI-SearchBot` | `ChatGPT-User` (OpenAI précise que `robots.txt` peut ne pas s'appliquer) |
| Anthropic | `ClaudeBot` | `Claude-SearchBot` | `Claude-User` |
| Google | `Google-Extended` (entraînement Gemini et ancrage ; **sans effet** sur Google Search) | Googlebot (Search classique) | — |

  Bloquer un robot de recherche retire le site des réponses de ce moteur ; bloquer un robot d'entraînement n'a pas cet effet. Le cas courant pour un produit qui veut être trouvé : laisser passer la recherche, décider séparément pour l'entraînement.
- **`llms.txt` :** une **proposition** (Jeremy Howard, 2024), pas un standard. Fichier Markdown à la racine (`/llms.txt`) : un titre H1 (seule section obligatoire), un résumé en citation, puis des listes de liens sous des titres H2, avec une section `## Optional` pour ce qu'un agent peut ignorer. Utile aux agents qui le lisent ; aucun effet démontré sur le référencement Google. Exemple : [llms.txt.example](llms.txt.example).

## 5. Réglementation (France / UE)

### Mentions légales

Obligatoires sur tout site professionnel (LCEN, loi n° 2004-575, art. 1-1, 1-2 et 19), sur une page dédiée ou dans les CGV :

- **Identité :** dénomination sociale, forme juridique et capital (société) ; ou nom, prénom et mention « entrepreneur individuel » / « EI » (personne physique).
- **Contact :** siège social ou adresse de domiciliation, adresse e-mail, numéro de téléphone.
- **Immatriculation :** numéro RCS et/ou RNE selon l'activité ; numéro de TVA intracommunautaire le cas échéant.
- **Hébergeur :** nom ou raison sociale, adresse et téléphone.
- **Selon le cas :** directeur de la publication ; autorité ayant délivré une autorisation (activité réglementée) ; titre professionnel et ordre (profession réglementée).

Manquement : jusqu'à 375 000 € d'amende pour une société et 75 000 € pour une entreprise individuelle. Source : [entreprendre.service-public.gouv.fr — F37351](https://entreprendre.service-public.gouv.fr/vosdroits/F37351).

### Cookies et traceurs

- **Principe :** tout traceur non indispensable requiert un consentement préalable. Refuser doit être **aussi simple** qu'accepter, et retirer son consentement aussi simple que le donner.
- **Mesure d'audience exemptée de consentement** si les quatre conditions de la CNIL sont réunies : finalité strictement limitée à la mesure d'audience pour le compte exclusif de l'éditeur ; statistiques anonymes uniquement ; aucun recoupement avec d'autres traitements ni transmission de données non anonymes à des tiers ; aucun suivi d'une personne d'un site à l'autre.
- **Recommandations CNIL pour cette exemption :** informer les utilisateurs (politique de confidentialité), limiter la durée de vie des traceurs (par exemple 13 mois, sans prolongation automatique à chaque visite), conserver les données au plus 25 mois. Attention aux outils dont l'éditeur réutilise les données pour son compte et aux transferts hors UE. La CNIL fournit un [outil d'auto-évaluation](https://www.cnil.fr/sites/default/files/2025-07/outil_d_auto-evaluation_mesure_d_audience.pdf).
- **Conséquence pratique :** une landing sans traceur, ou avec une mesure d'audience exemptée, n'a pas besoin de bandeau. Le lien « Confidentialité » reste nécessaire dès qu'on traite des données personnelles (formulaire, mesure d'audience, journaux).

Sources : [CNIL — mesure d'audience](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience) · [CNIL — que dit la loi](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi) · [entreprendre.service-public.gouv.fr — F31228](https://entreprendre.service-public.gouv.fr/vosdroits/F31228).

### Accessibilité

- **European Accessibility Act** ([directive (UE) 2019/882](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882)) : appliquée depuis le **28 juin 2025**. Elle couvre notamment les **services de commerce électronique** (services à distance, par site web ou application, à la demande d'un consommateur, en vue de conclure un contrat), la banque, les livres numériques et le transport de passagers. Les **micro-entreprises qui fournissent des services** (moins de 10 personnes et chiffre d'affaires ou total de bilan annuel ≤ 2 M€) sont exemptées. Période de transition : les contrats de service conclus avant le 28 juin 2025 peuvent continuer jusqu'à leur terme, au plus cinq ans.
- **RGAA** (version 4.1.2, 106 critères ; la version 5 est annoncée pour fin 2026) : obligatoire pour les personnes morales de droit public et assimilées, et pour les entreprises dont le chiffre d'affaires en France dépasse **250 M€**. Il s'appuie sur la norme EN 301 549 (WCAG 2.1 niveaux A et AA). Les organismes concernés publient une **déclaration d'accessibilité**, accessible depuis toutes les pages, et affichent leur état : « totalement », « partiellement » (au moins 50 % des critères) ou « non conforme ».
- **Pour tous :** même hors obligation, viser WCAG 2.1 AA coûte peu sur une landing (contrastes, focus visible, textes alternatifs, titres hiérarchisés, lien d'évitement, mouvement réduit). Le gabarit le fait.

Sources : [Commission européenne — EAA](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en) · [accessibilite.numerique.gouv.fr — champ d'application](https://accessibilite.numerique.gouv.fr/obligations/champ-application/) · [déclaration d'accessibilité](https://accessibilite.numerique.gouv.fr/obligations/declaration-accessibilite/).

### Données personnelles (RGPD)

Dès qu'un formulaire, une mesure d'audience ou un outil de suivi d'erreurs traite des données personnelles, publiez une politique de confidentialité (responsable du traitement, finalités, base légale, durées, destinataires, transferts hors UE, droits et contact). Ce guide ne détaille pas son contenu : partez des [modèles et fiches de la CNIL](https://www.cnil.fr/fr/rgpd-par-ou-commencer).

## 6. Checklist avant mise en ligne

- [ ] La direction choisie correspond au cas (accès rapide, conviction, démonstration).
- [ ] Les fonctions affichées sont dérivées de la configuration réelle ; aucune fonction désactivée n'apparaît.
- [ ] Les CTA « Créer un compte » et « Se connecter » sont visibles dès le premier écran et mènent aux bonnes routes.
- [ ] `<title>`, `meta description`, `canonical`, `lang`, Open Graph et image de partage sont renseignés.
- [ ] JSON-LD `WebSite` et `Organization` validés, cohérents avec le texte visible.
- [ ] `robots.txt` et `sitemap.xml` publiés ; choix explicite entraînement / recherche pour les robots d'IA.
- [ ] Search Console et Bing Webmaster Tools configurés, sitemap soumis.
- [ ] Core Web Vitals dans le vert sur mobile (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1).
- [ ] Mentions légales complètes, hébergeur compris.
- [ ] Aucun traceur avant consentement, ou mesure d'audience vérifiée comme exemptée ; refus aussi simple qu'acceptation.
- [ ] Politique de confidentialité publiée si des données personnelles sont traitées.
- [ ] Accessibilité : navigation au clavier, focus visible, contrastes, alternatives textuelles, mouvement réduit ; déclaration d'accessibilité si l'organisme est concerné.
- [ ] Notes du gabarit retirées (`#notes`, `data-note`).

## Sources vérifiées le 2026-10-30

| Sujet | Source officielle |
| --- | --- |
| Core Web Vitals | [web.dev — Web Vitals](https://web.dev/articles/vitals) |
| Données structurées | [Google — Organization](https://developers.google.com/search/docs/appearance/structured-data/organization) · [Google — noms de site](https://developers.google.com/search/docs/appearance/site-names) · [Google — introduction](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data) |
| IA dans Google Search | [Google — AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) |
| Robots d'IA | [OpenAI — bots](https://developers.openai.com/api/docs/bots) · [Anthropic — crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) · [Google — robots courants](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers) |
| `llms.txt` | [llmstxt.org](https://llmstxt.org/) |
| Cookies | [CNIL — mesure d'audience](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience) · [CNIL — que dit la loi](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/que-dit-la-loi) |
| Mentions légales | [entreprendre.service-public.gouv.fr — F37351](https://entreprendre.service-public.gouv.fr/vosdroits/F37351) |
| Accessibilité | [Directive (UE) 2019/882](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32019L0882) · [RGAA](https://accessibilite.numerique.gouv.fr/) |

Les jetons des robots d'IA et le statut de `llms.txt` évoluent vite : revérifiez-les à chaque utilisation.

## Ressources BAG liées

- [UI/UX Design Review](../../../skill-tree/skills/ui-ux-design-review/SKILL.md) : revue d'accessibilité et de qualité d'interface, utile sur la landing une fois adaptée.
