# Notes de déploiement et de sécurité — Offre Unique Cloud

Corpus documenté : 2026-10-27. Les captures attestent la présence des tuiles; les versions, quotas et activations exacts restent propres au compte. Ne pas conserver d'IP de compte, chemins de home, emails ou autres identifiants ici.

## Caches
Redis et Memcached sont natifs; éviter d'utiliser le cache non sauvegardé comme stockage durable ou unique source de vérité des files de travaux. Pour du cache HTTP, comparer LSCache, xtremCache/Varnish et PageSpeed selon le framework, puis tester les règles d'invalidation.

## Runtimes et données
Node.js/Passenger ne démontre ni prise en charge universelle des processus de longue durée, ni Next.js SSR selon toute version, ni privilèges root. Une SPA statique convient plus simplement au serveur HTTP; tester les routes profondes. Les environnements PHP, Python et Ruby sont décrits dans cPanel. PostgreSQL requiert contrôle de version et d'extensions (PostGIS et pgvector non confirmés); MySQL est documenté, avec accès distant conditionnel.

## Sécurité
Le WAF TigerProtect/ModSecurity, l'antivirus ImunifyAV+, Let's Encrypt et la MFA cPanel sont complémentaires. Garder des règles applicatives : session, CSRF, validation, autorisations objet, mises à jour, journalisation et sauvegardes restaurables. SSH peut nécessiter une exception pare-feu et n'implique pas sudo.

## En production
Vérifier limites mémoire/processus/I/O et la configuration du compte via Utilisation des ressources, journaux, sauvegardes JetBackup et test de restauration. Respecter le domaine isolé et les Lunes. Demander confirmation officielle pour Docker, ouverture de ports, workers continus, SSE/WebSockets longs, extensions non documentées. Ne jamais promettre disponibilité sans mesures.
