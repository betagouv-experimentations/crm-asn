# Suivi des accompagnements ASN

## Persona

**Chargé d'accompagnement** au département ASN (Accompagnement des Services
Numériques) de la DINUM. Il suit un portefeuille de 30 à 40 interlocuteurs
dans différentes administrations sur leurs projets numériques.

**Moments d'usage** : ponctuel mais récurrent dans la journée.
- Avant un échange (réunion, appel) : se remettre en tête le contexte.
- Juste après un échange : saisir ce qui vient de se passer tant que c'est
  frais.
- Le matin : voir les relances à traiter cette semaine.

Ce n'est pas un dashboard permanent ni un outil de planning.

## Problème

Aujourd'hui, l'historique des accompagnements est éparpillé entre un Excel
partagé, des notes Notion, des mails épinglés et la mémoire des chargés.

Conséquences :
- Après 3 semaines sans contact, le contexte du dernier échange est perdu.
- Les follow-up promis sont oubliés (rien ne les rappelle).
- Quand un collègue reprend un dossier, tout doit être réexpliqué à l'oral.
- Du temps est perdu à chercher "qu'est-ce qu'on s'était dit la dernière fois".

**Problème central** : pas d'endroit unique et fiable où retrouver l'historique
d'un accompagnement et les engagements pris.

## Promesse

> Tu tapes le nom d'un interlocuteur, tu vois tout ton historique d'échanges
> avec lui en 10 secondes, et tu ne rates plus une seule relance que tu avais
> promise.

Deux actions clés : **retrouver vite** et **ne rien oublier**.

## Parcours

### 1. Avant un échange — retrouver le contexte (2 clics, 10 secondes)

- L'écran d'accueil présente une barre de recherche bien visible et la liste
  des interlocuteurs récents.
- Le chargé tape 2-3 lettres (nom ou administration) ou clique sur un contact
  récent.
- Il arrive sur la **fiche interlocuteur** : informations de contact en haut,
  puis historique chronologique des interactions (la plus récente en premier)
  avec date, type d'échange et note.

### 2. Après un échange — saisir l'interaction (30 secondes)

- Depuis la fiche (souvent déjà ouverte), le chargé clique sur un bouton
  "Ajouter une interaction" bien visible.
- Un formulaire s'ouvre avec :
  - **Date** : préremplie à maintenant
  - **Type** : choix entre réunion, appel, mail
  - **Note** : texte libre (résumé, décisions, follow-up)
  - **Prochaine relance** (optionnel) : date + libellé court
- Validation : l'interaction apparaît en haut de l'historique.

### 3. Le matin — voir les relances de la semaine

- Sur l'écran d'accueil, une zone "Mes relances cette semaine" liste les
  relances dont la date arrive, triées par jour :
  - **Rouge** : relances en retard (date passée)
  - **Jaune** : relances du jour
  - **Gris** : relances à venir cette semaine
- Un clic sur une relance ramène à la fiche du contact et à l'interaction
  d'origine pour avoir tout le contexte.

## Données

### Interlocuteur

| Champ | Description |
|---|---|
| Nom | Nom de famille |
| Prénom | Prénom |
| Administration | Ministère ou direction (ex: DGFiP, DINUM) |
| Rôle | Fonction (ex: chef de projet numérique, DSI adjoint) |
| Email | Adresse mail professionnelle |
| Téléphone | Numéro direct |
| Contexte d'accompagnement | 2-3 lignes libres sur le sujet d'accompagnement |

### Interaction (rattachée à un interlocuteur)

| Champ | Description |
|---|---|
| Date | Date de l'échange (préremplie à maintenant) |
| Type | Réunion, appel ou mail |
| Note | Texte libre : résumé, décisions, follow-up |

### Relance (rattachée à une interaction)

| Champ | Description |
|---|---|
| Date d'échéance | Quand relancer |
| Libellé | Description courte auto-suffisante (ex: "Appeler sur le marché cloud") |

### Règles d'accès (V1)

- Toute l'équipe voit et modifie toutes les fiches et interactions.
- Pas d'authentification en V1 : le proto est accessible en interne sans login.
- Pas de notion d'utilisateur connecté, pas de trace de qui a saisi quoi.
- Pas de droits granulaires, pas de contacts privés.

### Hors périmètre V1

- Import de données (Excel ou autre)
- Authentification (ProConnect / AgentConnect)
- Auteur des interactions (lié à l'absence d'auth)
- Notifications (email, Slack)
- Photo, LinkedIn, organigramme sur les fiches

## Critères de succès

Après 1 mois d'utilisation par l'équipe ASN :

1. **Adoption** : 80% des chargés ouvrent l'outil au moins 1 fois par semaine.
   50% l'ouvrent plusieurs fois par jour (le réflexe avant/après échange est
   pris).
2. **Passation réussie** : au moins une passation de dossier se fait sans
   réexplication orale — le collègue reconstitue tout en lisant les fiches.
3. **Signal de confiance** : l'Excel partagé actuel n'est plus mis à jour.
