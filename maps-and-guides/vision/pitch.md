# 🎤 BAG — Pitch de 3 minutes

> Texte à dire à voix haute : environ 480 mots, soit 3 minutes à environ 160 mots par minute. Les repères entre crochets sont des indications de scène et ne se prononcent pas. L'annexe technique est la [spécification de BAG](specification.md).

## [0:00 – 0:25] L'accroche

Levez la main si vous avez déjà résolu deux fois le même problème.

Le bon `.gitignore`, la config d'authentification qui tient la route, le prompt qui marche, la commande qu'on a mis trois heures à trouver… On a déjà tout ça quelque part : dans un favori, un vieux dépôt, un fil de discussion. Autant dire nulle part.

## [0:25 – 0:55] Le problème a changé d'échelle

Depuis qu'on travaille avec des agents IA, ce problème a doublé. Nos agents ont besoin de ce savoir, et on ne leur offre que deux mauvaises options : un wiki qu'ils ne savent pas exploiter, ou un script d'installation qu'ils exécutent sans demander. D'un côté on réinvente tout ; de l'autre, on fait une confiance aveugle.

## [0:55 – 1:35] La solution : BAG

BAG, c'est l'inventaire du développeur, au sens du jeu vidéo, en sept zones : l'Inventaire pour les bibliothèques, l'Équipement pour les outils et les configurations, l'Arbre de compétences pour les skills et les agents, le Grimoire pour les scripts, les Cartes pour les guides, le Butin pour ce qu'on n'a pas encore vérifié, et les Loadouts, qui assemblent le tout pour une mission.

Chaque objet est écrit une seule fois, en Markdown, avec sa source officielle, sa date de vérification et ses limites. Ce même objet se lit de trois façons :

- un humain le lit sur GitHub ou sur le site ;
- un agent l'interroge via un catalogue JSON et une petite CLI sans aucune dépendance ;
- on peut aussi le déléguer avec un prompt de trois lignes qui pointe vers lui.

## [1:35 – 2:15] Sûr par construction

Voici la règle d'or de BAG : lire, ce n'est pas installer. Documenter, ce n'est pas activer. Et un plan n'est pas une autorisation.

Je tape `bag plan ai-coding` en visant mon projet. Résultat : trois fichiers à créer, quatre références à lire, et rien n'est écrit. Je dis oui et j'ajoute `--apply` : la copie se fait. Si mon `AGENTS.md` existe déjà, BAG passe à la suite sans l'écraser. Il n'y a ni accès réseau, ni sous-processus, et les liens symboliques sont refusés.

Quand je délègue, mon agent lit les consignes de BAG, de la racine jusqu'à l'objet. Il inspecte mon projet et ne me pose que les questions qu'il ne peut pas trancher seul. Pour chaque vérification, son compte rendu dit « réussi », « échoué » ou « non exécuté ». Jamais « ça devrait marcher ».

## [2:15 – 2:45] Ça tourne déjà

Ce n'est pas une maquette. Le catalogue compte déjà dix objets et deux loadouts, validés à chaque commit.

L'authentification Supabase est découpée en sept tâches composables, avec leurs dépendances. Un skill d'hébergement relie soixante-cinq pages officielles et trente et une décisions de faisabilité. Il sépare ce qui est « documenté » de ce qui est « activé », et ce qui est « non confirmé » de ce qui est « impossible ». Enfin, un site statique publie chaque page aussi en Markdown, pour que les agents la lisent.

## [2:45 – 3:00] L'appel

Chaque problème résolu une fois devient un objet. Chaque objet peut se déléguer comme une mission, et chaque mission reste sous votre contrôle.

Ouvrez votre sac, équipez-vous… et arrêtez de résoudre deux fois le même problème.

---

## Fiche de préparation (ne se lit pas à voix haute)

### Trois idées à faire retenir

1. **Une seule source, plusieurs lectures.** Chaque objet est écrit une seule fois, puis lu par un humain, par une CLI ou par un agent délégué.
2. **Sûr par construction.** BAG distingue quatre états : documenté, installé, activé, digne de confiance. Une écriture demande toujours un accord explicite.
3. **Ça existe déjà.** Le catalogue, la CLI, la délégation, la composition de tâches et le site statique sont en place, testés en intégration continue.

### Chiffres vérifiés au 27/10/2026

| Élément | Valeur | Commande de vérification |
| --- | --- | --- |
| Zones | 7 | `node spellbook/scripts/validate.mjs` |
| Objets / loadouts dans le catalogue | 10 / 2 | `node spellbook/scripts/bag.mjs validate --json` |
| Tests du noyau | 10, tous réussis | `node --test tests/*.test.mjs` |
| Tâches Supabase Auth | 7 tâches en 3 groupes | [tasks/index.json](../../inventory/supabase/auth/tasks/index.json) |
| Skill o2switch | 65 pages officielles, 31 décisions | [tests du skill](../../tests/o2switch-skill.test.mjs) |
| Dépendances du noyau (CLI et validateurs) | 0 | bibliothèque standard de Node.js uniquement |

### Démo en direct (45 secondes au maximum)

Lancez-la depuis la racine de BAG, avec un dossier cible vide qui existe déjà :

```bash
node spellbook/scripts/bag.mjs search agents --json
node spellbook/scripts/bag.mjs plan ai-coding --target ../demo-projet
node spellbook/scripts/bag.mjs equip ai-coding --target ../demo-projet --apply
node spellbook/scripts/bag.mjs equip ai-coding --target ../demo-projet --apply
```

Voici ce qu'il faut montrer :

- `plan` annonce 3 `create` et 4 `reference-only`, et le dossier reste vide.
- Le premier `--apply` affiche 3 `created`.
- Le second affiche 3 `exists-skip` : les fichiers existants sont conservés.

N'utilisez qu'un dossier jetable préparé pour la démo, et jamais un vrai projet sans en avoir validé le plan.

### Objections probables

| Objection | Réponse courte |
| --- | --- |
| « C'est un dossier de favoris. » | Non. Chaque objet a une source officielle, une date, des limites et un contrat JSON validé. Il peut aussi se déléguer. Un favori n'a rien de tout ça. |
| « Pourquoi pas un gestionnaire de paquets ? » | C'est un choix délibéré. Installer relève du projet cible. BAG copie seulement des modèles locaux relus, après un accord explicite, sans jamais écraser. |
| « Et l'injection de prompt ? » | Le contenu de BAG est une donnée, pas une autorité. Les consignes du système, du projet cible et de l'utilisateur passent avant. Aucune note du catalogue ne vaut permission. |
| « Ça marche avec quel agent ? » | Avec n'importe lequel qui lit du Markdown et du JSON : Codex, Claude Code ou d'autres. L'installation des skills reste volontaire et dépend de chaque client. |
| « Pourquoi un vocabulaire de jeu vidéo ? » | C'est un modèle mental de rangement. Chaque objet a une seule maison principale et suit un cycle de vie explicite : butin, évaluation, prêt, équipé, archivé. |
| « Ça passe à l'échelle ? » | Le catalogue est relu depuis les fichiers à chaque appel : aucun index ne peut se périmer. Le site est statique, donc hébergeable partout, sans serveur. |
| « Pourquoi pas un formulaire web pour cadrer la mission ? » | L'entretien revient à l'agent, dans le projet cible et après inspection : c'est là que se trouvent les réponses. Le site se contente d'afficher le Markdown. |
