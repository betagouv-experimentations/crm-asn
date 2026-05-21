Le PM décrit ce qu'il veut construire. Suis ce workflow en séquence.

## Phase 1 — Vérifier le cadrage

Vérifie si `specs/SPEC.md` existe :

- **Si `specs/SPEC.md` n'existe pas** :
  Affiche exactement ce message, puis STOP (pas de questions, pas de
  fichiers générés) :

  "Avant /build, on cadre le produit. Tape /cadrer — un dialogue
  d'environ 20 minutes (persona, problème, promesse, parcours, données,
  succès) qui produit specs/SPEC.md + specs/BACKLOG.md. Reviens ensuite
  sur /build."

- **Si `specs/SPEC.md` existe** :
  Lis `specs/SPEC.md` et `specs/BACKLOG.md`. Passe directement en
  Phase 2.

## Phase 2 — Valider la spec

Tu as déjà `specs/SPEC.md` et `specs/BACKLOG.md` produits par `/cadrer`.
Présente au PM un **résumé en 10-15 lignes max** qui couvre : persona
principal, parcours en 3-5 étapes, données clés, et les 3-5 premiers
tickets du backlog.

Demande : "Ça correspond à ce que tu veux ? Si oui je lance la
construction. Sinon, dis-moi ce qu'il faut changer dans specs/SPEC.md
ou specs/BACKLOG.md."

ATTENDS la validation explicite du PM avant de continuer.

## Phase 3 — Construire

Enchaîne SANS interruption :

1. **Planifier** : Écris le plan technique dans `specs/plan.md`
   (architecture, modèle de données détaillé, endpoints API, composants)

2. **Schéma DB** : Écris le schéma Drizzle dans `src/db/schema.ts`,
   génère et applique la migration :
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   ```

3. **Implémenter les tickets de `specs/BACKLOG.md` dans l'ordre** :
   Pour chaque ticket (du haut vers le bas du backlog) :
   a. Lis le ticket et son critère d'acceptation
   b. Implémente la page/composant/API correspondant dans `src/`
   c. Utilise UNIQUEMENT les composants `@codegouvfr/react-dsfr`.
      **Consulte la skill `react-dsfr`** avant d'écrire le composant
      (liste des composants disponibles, props, patterns d'usage,
      thème dark/light). Pour les formulaires et les pages,
      **consulte aussi `rgaa`** (labels, contrastes, navigation
      clavier, focus visible).
   d. Écris un test E2E Playwright qui couvre ce ticket
   e. Coche le ticket dans `specs/BACKLOG.md` (`[ ]` devient `[x]`)
   f. Passe au ticket suivant

   Ne pas sauter de ticket sans validation explicite du PM. Si un
   ticket bloque, demande-lui.

4. **Seed data** : Écris des données de test réalistes dans
   `scripts/seed.ts` et exécute `npm run seed`

5. **Tester** : Lance TOUS les tests E2E :
   ```bash
   npx playwright test
   ```
   Si un test échoue, corrige et relance jusqu'à 100% vert.

6. **Review rapide** : Vérifie en consultant les skills :
   - `react-dsfr` : tous les composants viennent bien de la skill, le
     thème dark/light n'a pas de glitch
   - `rgaa` : checklist accessibilité passée (lien d'évitement, lang,
     `<h1>` unique, labels, focus visible, contrastes)
   - `securite-anssi` : pas de secret en dur, validation zod sur toutes
     les entrées, headers de sécurité configurés
   - Les pages obligatoires existent (mentions, accessibilité, RGPD)
   - Les migrations sont commitées

7. **Dev server** : Lance le serveur :
   ```bash
   npm run dev
   ```

8. **Smoke test** : utilise le MCP Playwright pour vérifier que le
   serveur répond correctement AVANT de rendre la main au PM :

   - Navigue sur `http://localhost:3000`
   - Vérifie que la réponse HTTP est 200
   - Capture les messages console (`browser_console_messages`) — il
     ne doit pas y avoir d'erreur JS au chargement
   - Prends un snapshot accessibility (`browser_snapshot`) — vérifie
     qu'un `<h1>` est présent et que la page n'est pas cassée
   - Visite **au moins** un écran principal du parcours utilisateur
     (le plus important du plan), idem : pas d'erreur, page rend.

   Si le smoke test détecte un problème :
   - Diagnostique (route 404, erreur de serveur, erreur Hydration,
     bundle qui ne charge pas, etc.)
   - Corrige
   - Relance le dev server si besoin
   - Refais le smoke test
   - Itère jusqu'à ce que tout passe.

   NE rends PAS la main au PM tant que le smoke test n'est pas vert.

## Phase 4 — Livrer

Affiche au PM :

"✅ Ton proto est prêt !

→ Ouvre http://localhost:3000 dans ton navigateur pour le voir
→ Navigue dans les écrans, teste les formulaires
→ Dis-moi si tu veux changer quelque chose (/change)
→ Quand c'est bon, tape /save pour le mettre en ligne"
