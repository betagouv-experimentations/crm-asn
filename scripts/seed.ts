import { db } from "../src/db";
import { contacts, interactions, followUps } from "../src/db/schema";

async function seed(): Promise<void> {
  console.log("→ Seeding database...");

  // Clean existing data
  await db.delete(followUps);
  await db.delete(interactions);
  await db.delete(contacts);

  const [alice, bob, claire, david, emma] = await db
    .insert(contacts)
    .values([
      {
        firstName: "Alice",
        lastName: "Durand",
        administration: "DGFiP",
        role: "Cheffe de projet numérique",
        email: "alice.durand@dgfip.finances.gouv.fr",
        phone: "01 44 12 34 56",
        context:
          "Refonte du portail agent interne. Accompagnement démarré en février 2026.",
      },
      {
        firstName: "Bob",
        lastName: "Martin",
        administration: "Ministère de l'Intérieur",
        role: "DSI adjoint",
        email: "bob.martin@interieur.gouv.fr",
        phone: "01 40 07 65 43",
        context:
          "Migration cloud de 3 applications métier. Phase de cadrage.",
      },
      {
        firstName: "Claire",
        lastName: "Petit",
        administration: "DINUM",
        role: "Responsable design",
        email: "claire.petit@modernisation.gouv.fr",
        phone: "01 42 75 80 00",
        context:
          "Mise en conformité DSFR d'un portail usager. Accompagnement ponctuel.",
      },
      {
        firstName: "David",
        lastName: "Leroy",
        administration: "ADEME",
        role: "Chef de projet SI",
        email: "david.leroy@ademe.fr",
        phone: "01 47 65 20 00",
        context:
          "Développement d'un outil de suivi des émissions carbone. Phase de construction.",
      },
      {
        firstName: "Emma",
        lastName: "Bernard",
        administration: "Ministère de la Santé",
        role: "Directrice du numérique",
        email: "emma.bernard@sante.gouv.fr",
        phone: "01 40 56 60 00",
        context:
          "Accompagnement sur l'accessibilité de 5 télé-services. Audit en cours.",
      },
    ])
    .returning();

  const today = new Date();
  const daysAgo = (n: number): Date => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d;
  };
  const daysFromNow = (n: number): string => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  const daysAgoStr = (n: number): string => {
    const d = new Date(today);
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  };

  const [i1, i2, i3, i4, i5] = await db
    .insert(interactions)
    .values([
      {
        contactId: alice!.id,
        date: daysAgo(3),
        type: "meeting",
        note: "Point d'avancement sur la refonte du portail. Maquettes validées. Prochain jalon : choix du prestataire d'intégration.",
      },
      {
        contactId: alice!.id,
        date: daysAgo(21),
        type: "call",
        note: "Appel rapide pour clarifier le périmètre fonctionnel. Alice confirme que le module RH est hors scope V1.",
      },
      {
        contactId: bob!.id,
        date: daysAgo(1),
        type: "call",
        note: "Discussion sur les prérequis techniques de la migration cloud. Bob attend la validation budgétaire de sa direction.",
      },
      {
        contactId: claire!.id,
        date: daysAgo(7),
        type: "email",
        note: "Envoi du guide DSFR et des recommandations de mise en conformité. Claire va transmettre à son équipe de devs.",
      },
      {
        contactId: david!.id,
        date: daysAgo(14),
        type: "meeting",
        note: "Atelier de cadrage avec l'équipe technique ADEME. Architecture micro-services validée. Besoin d'un accompagnement DevOps.",
      },
    ])
    .returning();

  await db.insert(followUps).values([
    {
      interactionId: i1!.id,
      contactId: alice!.id,
      dueDate: daysFromNow(2),
      label: "Envoyer la grille d'évaluation prestataires à Alice",
    },
    {
      interactionId: i3!.id,
      contactId: bob!.id,
      dueDate: daysFromNow(0),
      label: "Appeler Bob pour savoir si le budget est validé",
    },
    {
      interactionId: i4!.id,
      contactId: claire!.id,
      dueDate: daysAgoStr(2),
      label: "Relancer Claire sur le retour de son équipe",
    },
    {
      interactionId: i5!.id,
      contactId: david!.id,
      dueDate: daysFromNow(4),
      label: "Proposer un profil DevOps à David",
    },
  ]);

  console.log("✓ Seed terminé : 5 contacts, 5 interactions, 4 relances.");
}

seed()
  .catch((error: unknown) => {
    console.error("✗ Erreur durant le seed :", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
