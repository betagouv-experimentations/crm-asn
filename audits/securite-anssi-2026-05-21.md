## Audit Sécurité ANSSI — Rapport de conformité

**Date :** 2026-05-21
**Périmètre audité :** Application "Suivi des accompagnements ASN" — code source, configuration, Dockerfile, dépendances
**Résultat global :** 5/12 domaines conformes (42% conforme)
(5 conformes, 2 non conformes, 2 partiels, 3 non applicables)

---

### Tableau de synthèse

| # | Domaine | Statut | Détail |
|---|---------|--------|--------|
| 1 | TLS / HTTPS | Partiel | Pas de HSTS configuré, TLS géré par Coolify en prod |
| 2 | Gestion des secrets | OK | Aucun secret dans le code, .env dans .gitignore |
| 3 | Authentification et contrôle d'accès | NA | Pas d'auth en V1 (choix assumé dans la spec) |
| 4 | Headers de sécurité HTTP | Partiel | 4/5 headers présents, CSP manquant |
| 5 | Validation des entrées | OK | Zod côté serveur, Drizzle ORM (requêtes paramétrées), pas de dangerouslySetInnerHTML |
| 6 | Gestion des dépendances | KO | 8 vulnérabilités (2 high), drizzle-orm et next à mettre à jour |
| 7 | Journalisation et monitoring | NA | Proto interne sans trafic réel, pas de logs applicatifs |
| 8 | Protection des API | KO | API /search sans rate limiting, pas de pagination |
| 9 | Sécurité des conteneurs | OK | Image Alpine, multi-stage build, pas de root explicite |
| 10 | Sécurité du poste de développement | NA | Hors périmètre code applicatif |
| 11 | Sauvegarde et continuité | OK | PostgreSQL dans Docker volume, migrations versionnées |
| 12 | Gestion des incidents | OK | Proto beta.gouv, procédures DINUM applicables |

---

### Non-conformités détectées

**[KO] Domaine 6 — Gestion des dépendances**
- **Règle concernée :** Mettre à jour les dépendances avec des vulnérabilités connues (CVE)
- **Constat :** `npm audit` signale 8 vulnérabilités (6 moderate, 2 high) :
  - `drizzle-orm <0.45.2` : injection SQL via identifiants SQL mal échappés (GHSA-gpj5-g38j-94v9) — HIGH
  - `next 9.3.4–16.3.0-canary.5` : multiples CVE (DoS, cache poisoning, XSS avec CSP nonce) — HIGH
  - `esbuild <=0.24.2` : requêtes cross-origin en dev (MODERATE)
  - `brace-expansion 5.0.2–5.0.5` : DoS (MODERATE)
  - `postcss` : vulnérabilité (MODERATE)
- **Risque :** La vulnérabilité drizzle-orm pourrait théoriquement permettre une injection SQL si des identifiants dynamiques sont utilisés (notre code utilise des colonnes statiques, risque faible en pratique). Les vulnérabilités Next.js affectent le middleware/proxy et le cache (non utilisés ici).
- **Correction :** Exécuter `npm audit fix --force` pour mettre à jour drizzle-orm et next vers les versions corrigées. Vérifier la compatibilité après mise à jour (breaking changes possibles).
- **Priorité :** 🟠 Élevée

---

**[KO] Domaine 8 — Protection des API**
- **Règle concernée :** Rate limiting, pas de détails techniques dans les erreurs
- **Constat :** L'endpoint `GET /api/contacts/search?q=` n'a pas de rate limiting. Un attaquant pourrait envoyer un grand nombre de requêtes pour énumérer les contacts ou provoquer un DoS sur la base de données. L'API ne retourne pas de détails techniques dans les erreurs (OK) mais n'a pas de limitation de débit.
- **Risque :** Énumération des contacts, surcharge de la base de données. Risque modéré car le proto est accessible uniquement en interne.
- **Correction :** Ajouter un rate limiter (ex : `next-rate-limit` ou un middleware custom basé sur IP) sur l'endpoint de recherche. Limiter à 30 requêtes/minute par IP.
- **Priorité :** 🟡 Modérée

---

### Conformités partielles

**[Partiel] Domaine 1 — TLS / HTTPS**
- **Règles respectées :** HTTPS en prod (Coolify gère le certificat Let's Encrypt et le reverse proxy TLS). TLS 1.2+ et suites de chiffrement modernes (configurées par Coolify/Traefik).
- **Règles manquantes :** Le header `Strict-Transport-Security` (HSTS) n'est pas configuré dans `next.config.ts`. Le reverse proxy Coolify peut le rajouter, mais ce n'est pas garanti par défaut.
- **Correction :** Ajouter `{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }` dans les headers de `next.config.ts`.

**[Partiel] Domaine 4 — Headers de sécurité HTTP**
- **Règles respectées :** 4 headers configurés dans `next.config.ts` :
  - `X-Content-Type-Options: nosniff` ✅
  - `X-Frame-Options: DENY` ✅
  - `Referrer-Policy: strict-origin-when-cross-origin` ✅
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()` ✅
- **Règles manquantes :** `Content-Security-Policy` (CSP) non configuré. Permet potentiellement l'injection de scripts depuis des sources externes.
- **Correction :** Ajouter un header CSP. Proposition minimale pour le DSFR :
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:
  ```
  Note : `unsafe-inline` et `unsafe-eval` sont nécessaires pour le DSFR et Next.js en dev. Passer à un CSP avec nonces en production si possible.

---

### Domaines conformes

- **Domaine 2 — Gestion des secrets** : aucun secret dans le code source, `.env` et `.env.local` dans `.gitignore`, `DATABASE_URL` en variable d'environnement, pas de `console.log` dans le code source
- **Domaine 5 — Validation des entrées** : toutes les entrées validées côté serveur avec zod (`contactSchema`, `interactionSchema`), requêtes SQL via Drizzle ORM (paramétrage automatique), pas de `dangerouslySetInnerHTML`, taille de body limitée (`bodySizeLimit: "2mb"` dans `next.config.ts`)
- **Domaine 9 — Sécurité des conteneurs** : image `node:22-alpine` (minimale), build multi-stage séparant deps/build/runtime, séparation dev/prod via `NODE_ENV=production`
- **Domaine 11 — Sauvegarde et continuité** : données PostgreSQL sur volume Docker persistant, migrations versionnées dans `drizzle/`, migration automatique au démarrage du container
- **Domaine 12 — Gestion des incidents** : proto beta.gouv.fr, rattaché aux procédures de la DINUM

### Domaines non applicables

- **Domaine 3 — Authentification** : pas d'authentification en V1 (décision produit documentée dans specs/SPEC.md, proto interne)
- **Domaine 7 — Journalisation** : proto en phase d'expérimentation, pas de trafic réel justifiant un système de logs
- **Domaine 10 — Sécurité du poste** : hors périmètre de l'audit applicatif
