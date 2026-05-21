# Backlog — Suivi des accompagnements ASN

Les tickets sont ordonnés par priorité de construction. Chaque ticket
correspond à un incrément livrable et testable.

---

## Ticket 1 — Créer et lister les interlocuteurs

**En tant que** chargé d'accompagnement,
**je veux** créer une fiche interlocuteur et voir la liste de tous les
interlocuteurs,
**afin de** centraliser mes contacts dans un seul endroit.

### Critères d'acceptation

- [x] Page d'accueil avec la liste des interlocuteurs (nom, administration)
- [x] Bouton "Ajouter un interlocuteur"
- [x] Formulaire : nom, prénom, administration, rôle, email, téléphone,
      contexte d'accompagnement
- [x] Validation des champs obligatoires (nom, prénom, administration)
- [x] L'interlocuteur créé apparaît dans la liste

---

## Ticket 2 — Fiche interlocuteur

**En tant que** chargé d'accompagnement,
**je veux** consulter et modifier la fiche d'un interlocuteur,
**afin de** voir ses informations et les maintenir à jour.

### Critères d'acceptation

- [x] Clic sur un interlocuteur dans la liste → page fiche
- [x] Affichage : nom, prénom, administration, rôle, email, téléphone,
      contexte d'accompagnement
- [x] Possibilité de modifier chaque champ
- [x] Possibilité de supprimer un interlocuteur (avec confirmation)

---

## Ticket 3 — Recherche et interlocuteurs récents

**En tant que** chargé d'accompagnement,
**je veux** trouver un interlocuteur en tapant 2-3 lettres et voir mes
contacts récents,
**afin de** retrouver le bon contact en moins de 10 secondes.

### Critères d'acceptation

- [x] Barre de recherche en haut de la page d'accueil, bien visible
- [x] Recherche sur le nom, le prénom et l'administration
- [x] Résultats affichés au fur et à mesure de la saisie (dès 2 caractères)
- [x] Section "Interlocuteurs récents" sous la barre de recherche (les
      derniers consultés)
- [x] Clic sur un résultat → fiche interlocuteur

---

## Ticket 4 — Ajouter une interaction

**En tant que** chargé d'accompagnement,
**je veux** ajouter une interaction depuis la fiche d'un interlocuteur,
**afin de** garder la trace de chaque échange en 30 secondes.

### Critères d'acceptation

- [x] Bouton "Ajouter une interaction" visible sur la fiche interlocuteur
- [x] Formulaire : date (préremplie à maintenant), type (réunion / appel /
      mail), note (texte libre)
- [x] Validation : la note ne peut pas être vide
- [x] L'interaction apparaît en haut de l'historique sur la fiche
- [x] Historique affiché en ordre chronologique inverse (plus récent en
      premier) avec date, type et note

---

## Ticket 5 — Relances sur une interaction

**En tant que** chargé d'accompagnement,
**je veux** associer une relance optionnelle à une interaction,
**afin de** ne pas oublier mes engagements.

### Critères d'acceptation

- [x] Dans le formulaire d'ajout d'interaction, section optionnelle
      "Prochaine relance"
- [x] Champs : date d'échéance + libellé court
- [x] La relance est visible sur l'interaction dans l'historique de la fiche
- [x] Possibilité de marquer une relance comme faite (elle disparaît de la
      vue relances mais reste visible dans l'historique)

---

## Ticket 6 — Vue "Mes relances cette semaine"

**En tant que** chargé d'accompagnement,
**je veux** voir toutes les relances de la semaine sur l'écran d'accueil,
**afin de** savoir immédiatement qui relancer en ouvrant l'outil le matin.

### Critères d'acceptation

- [x] Zone "Mes relances cette semaine" sur la page d'accueil, au-dessus
      de la liste des interlocuteurs
- [x] Relances triées par jour
- [x] Code couleur : rouge (en retard), jaune (aujourd'hui), gris (à venir
      cette semaine)
- [x] Chaque ligne affiche : libellé de la relance + nom de l'interlocuteur
      + date
- [x] Clic sur une relance → fiche de l'interlocuteur, scrollée à
      l'interaction d'origine

---

## Ticket 7 — Pages obligatoires

**En tant que** service public numérique,
**le produit doit** afficher les pages légales obligatoires,
**afin de** respecter les obligations réglementaires.

### Critères d'acceptation

- [x] Page `/mentions-legales`
- [x] Page `/accessibilite`
- [x] Page `/donnees-personnelles`
- [x] Liens vers ces pages dans le pied de page de toutes les pages
