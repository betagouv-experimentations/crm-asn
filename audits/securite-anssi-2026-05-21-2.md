## Audit Sécurité ANSSI — Rapport de conformité

**Date :** 2026-05-21
**Périmètre audité :** Application "Suivi des accompagnements ASN" — code source, configuration, Dockerfile, dépendances (2e audit, après correction HSTS + CSP)
**Résultat global :** 7/12 domaines conformes (58% conforme)
(7 conformes, 1 non conforme, 1 partiel, 3 non applicables)

---

### Tableau de synthèse

| # | Domaine | Statut | Détail |
|---|---------|--------|--------|
| 1 | TLS / HTTPS | OK | HSTS `max-age=63072000; includeSubDomains; preload` configuré, TLS via Coolify/Traefik |
| 2 | Gestion des secrets | OK | Aucun secret dans le code, .env dans .gitignore |
| 3 | Authentification et contrôle d'accès | NA | Pas d'auth en V1 (choix produit documenté dans specs/SPEC.md) |
| 4 | Headers de sécurité HTTP | OK | 6/6 headers configurés : CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, HSTS |
| 5 | Validation des entrées | OK | Zod côté serveur, Drizzle ORM paramétré, bodySizeLimit 2mb, pas de dangerouslySetInnerHTML |
| 6 | Gestion des dépendances | Partiel | 0 high/critical, 6 moderate (esbuild dev-only, postcss via next) — non corrigibles sans casser les dépendances |
| 7 | Journalisation et monitoring | NA | Proto en phase d'expérimentation, pas de trafic réel |
| 8 | Protection des API | KO | API /search sans rate limiting ni pagination |
| 9 | Sécurité des conteneurs | OK | Image node:22-alpine, multi-stage build, NODE_ENV=production |
| 10 | Sécurité du poste de développement | NA | Hors périmètre code applicatif |
| 11 | Sauvegarde et continuité | OK | PostgreSQL volume Docker, migrations versionnées dans drizzle/ |
| 12 | Gestion des incidents | OK | Proto beta.gouv.fr, procédures DINUM applicables |

---

### Non-conformités détectées

**[KO] Domaine 8 — Protection des API**
- **Règle concernée :** Rate limiting pour prévenir les abus
- **Constat :** L'endpoint `GET /api/contacts/search?q=` n'a pas de rate limiting. La recherche est limitée à 10 résultats (OK) mais aucune limitation de débit par IP.
- **Risque :** Énumération des contacts par requêtes massives, surcharge de la base. Risque modéré car proto interne sans auth.
- **Correction :** Ajouter un rate limiter (middleware custom ou package `next-rate-limit`) sur l'API de recherche. Limiter à 30 req/min par IP.
- **Priorité :** 🟡 Modérée

---

### Conformités partielles

**[Partiel] Domaine 6 — Gestion des dépendances**
- **Règles respectées :** `package-lock.json` présent et versionné ✅, vulnérabilités high/critical corrigées (drizzle-orm 0.45.2, next 15.5.18) ✅, nombre de dépendances directes minimal (7 deps, 9 devDeps) ✅, audit régulier possible via `npm audit` ✅
- **Règles manquantes :** 6 vulnérabilités moderate restantes (esbuild dans drizzle-kit dev-only, postcss dans next). Ces dépendances ne peuvent pas être mises à jour sans breaking changes majeurs (downgrade next à 9.x). Les vulnérabilités esbuild ne s'appliquent qu'en environnement de développement local. Le scan d'images Docker (trivy) n'est pas configuré en CI.
- **Correction :** Surveiller les releases de drizzle-kit et next pour de futures corrections. Ajouter `trivy` dans le pipeline CI quand celui-ci sera mis en place.

---

### Domaines conformes

- **Domaine 1 — TLS / HTTPS** : HSTS avec `max-age=63072000` (~2 ans), `includeSubDomains`, `preload`. HTTPS en prod via Coolify/Traefik avec certificat Let's Encrypt. TLS 1.2+ avec suites modernes (configurées par le reverse proxy).
- **Domaine 2 — Gestion des secrets** : aucun secret dans le code source (vérifié par grep), `.env` et `.env.local` dans `.gitignore`, `DATABASE_URL` injectée par variable d'environnement, pas de `console.log` dans `src/`.
- **Domaine 4 — Headers de sécurité HTTP** : 6 headers configurés dans `next.config.ts` — `Content-Security-Policy` (default-src 'self', script-src, style-src, font-src, img-src, connect-src, frame-ancestors 'none'), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. Vérification par `curl -sI` confirmée.
- **Domaine 5 — Validation des entrées** : toutes les entrées validées côté serveur avec zod (`contactSchema`, `interactionSchema`), requêtes SQL via Drizzle ORM (paramétrage automatique), pas de `dangerouslySetInnerHTML`, taille de body limitée à 2mb.
- **Domaine 9 — Sécurité des conteneurs** : image `node:22-alpine` (minimale), build multi-stage (deps → build → runner), `NODE_ENV=production` dans l'image finale, séparation dev/prod.
- **Domaine 11 — Sauvegarde et continuité** : données PostgreSQL sur volume Docker persistant, migrations versionnées dans `drizzle/`, script `migrate.mjs` exécuté automatiquement au démarrage du container.
- **Domaine 12 — Gestion des incidents** : proto rattaché à beta.gouv.fr/DINUM, procédures de signalement existantes au niveau de l'organisation.

### Domaines non applicables

- **Domaine 3 — Authentification** : pas d'authentification en V1 (décision produit documentée dans specs/SPEC.md, proto interne)
- **Domaine 7 — Journalisation** : proto en phase d'expérimentation, pas de trafic réel justifiant un système de logs
- **Domaine 10 — Sécurité du poste** : hors périmètre de l'audit applicatif
