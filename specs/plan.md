# Plan technique — Suivi des accompagnements ASN

## Architecture

- **Next.js 15 App Router** (déjà en place)
- **Server Components** par défaut, Client Components pour la recherche
  live et les formulaires interactifs
- **Server Actions** pour les mutations (créer/modifier/supprimer)
- **Drizzle ORM + PostgreSQL** pour la persistance
- **zod** pour la validation des entrées
- **@codegouvfr/react-dsfr** pour tous les composants UI

## Modèle de données

### Table `contacts`

| Colonne | Type | Contrainte |
|---|---|---|
| id | serial | PK |
| first_name | text | NOT NULL |
| last_name | text | NOT NULL |
| administration | text | NOT NULL |
| role | text | |
| email | text | |
| phone | text | |
| context | text | |
| last_viewed_at | timestamp(tz) | DEFAULT now() |
| created_at | timestamp(tz) | DEFAULT now(), NOT NULL |
| updated_at | timestamp(tz) | DEFAULT now(), NOT NULL |

### Table `interactions`

| Colonne | Type | Contrainte |
|---|---|---|
| id | serial | PK |
| contact_id | integer | FK → contacts.id, NOT NULL, ON DELETE CASCADE |
| date | timestamp(tz) | NOT NULL |
| type | text | NOT NULL (enum: meeting, call, email) |
| note | text | NOT NULL |
| created_at | timestamp(tz) | DEFAULT now(), NOT NULL |

### Table `follow_ups`

| Colonne | Type | Contrainte |
|---|---|---|
| id | serial | PK |
| interaction_id | integer | FK → interactions.id, NOT NULL, ON DELETE CASCADE |
| contact_id | integer | FK → contacts.id, NOT NULL, ON DELETE CASCADE |
| due_date | date | NOT NULL |
| label | text | NOT NULL |
| done | boolean | DEFAULT false, NOT NULL |
| created_at | timestamp(tz) | DEFAULT now(), NOT NULL |

Note : `contact_id` dupliqué dans `follow_ups` pour simplifier la requête
"relances de la semaine" (jointure directe sans passer par interactions).

## Routes (pages)

| Route | Description |
|---|---|
| `/` | Accueil : relances de la semaine + recherche + contacts récents |
| `/contacts/new` | Formulaire création contact |
| `/contacts/[id]` | Fiche contact + historique interactions |
| `/contacts/[id]/edit` | Formulaire modification contact |
| `/mentions-legales` | Déjà existante |
| `/accessibilite` | Déjà existante |
| `/donnees-personnelles` | Déjà existante |

## API Routes / Server Actions

| Action | Fichier |
|---|---|
| createContact | `src/app/contacts/actions.ts` |
| updateContact | `src/app/contacts/actions.ts` |
| deleteContact | `src/app/contacts/actions.ts` |
| createInteraction | `src/app/contacts/[id]/actions.ts` |
| markFollowUpDone | `src/app/contacts/[id]/actions.ts` |

| API Route | Usage |
|---|---|
| GET `/api/contacts/search?q=` | Recherche live (appelée côté client) |

## Composants

| Composant | Type | Usage |
|---|---|---|
| `SearchBar` | Client | Barre de recherche avec résultats live |
| `ContactForm` | Client | Formulaire création/édition contact |
| `InteractionForm` | Client | Formulaire ajout interaction + relance |
| `FollowUpList` | Server | Zone relances de la semaine sur l'accueil |
| `ContactList` | Server | Liste des contacts récents |
| `InteractionHistory` | Server | Historique des interactions sur la fiche |

## Composants DSFR utilisés

- `fr.cx()` pour les classes utilitaires
- `Input` pour les champs texte
- `Select` pour le type d'interaction
- `Button` pour les actions
- `Alert` pour les messages de succès/erreur
- `Badge` pour les tags de type d'interaction
- `Table` pour les listes si pertinent
- Classes DSFR natives pour le layout (fr-container, fr-grid-row, etc.)

## Ordre d'implémentation

1. Schéma DB + migration
2. Ticket 1 : CRUD contacts + liste
3. Ticket 2 : Fiche contact
4. Ticket 3 : Recherche + récents
5. Ticket 4 : Interactions
6. Ticket 5 : Relances
7. Ticket 6 : Vue relances semaine
8. Ticket 7 : Pages obligatoires (déjà faites, vérifier les liens)
9. Seed data
10. Tests E2E
11. Review finale
