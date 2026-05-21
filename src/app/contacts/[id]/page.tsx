import { notFound } from "next/navigation";
import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { fr } from "@codegouvfr/react-dsfr";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { db } from "@/db";
import { contacts, interactions, followUps } from "@/db/schema";
import { InteractionForm } from "@/components/interaction-form";
import { DeleteContactButton } from "@/components/delete-contact-button";
import { MarkDoneButton } from "@/components/mark-done-button";

const TYPE_LABELS: Record<string, string> = {
  meeting: "Réunion",
  call: "Appel",
  email: "Mail",
};

const TYPE_SEVERITY: Record<string, "info" | "success" | "warning"> = {
  meeting: "info",
  call: "success",
  email: "warning",
};

function formatDateFr(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<{ title: string }> {
  const { id } = await params;
  const contact = await db.query.contacts.findFirst({
    where: eq(contacts.id, Number(id)),
  });
  if (!contact) return { title: "Interlocuteur introuvable" };
  return { title: `${contact.firstName} ${contact.lastName}` };
}

export default async function ContactPage({ params }: PageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const contactId = Number(id);

  const contact = await db.query.contacts.findFirst({
    where: eq(contacts.id, contactId),
  });

  if (!contact) notFound();

  // Update lastViewedAt
  await db
    .update(contacts)
    .set({ lastViewedAt: new Date() })
    .where(eq(contacts.id, contactId));

  const contactInteractions = await db
    .select()
    .from(interactions)
    .where(eq(interactions.contactId, contactId))
    .orderBy(desc(interactions.date));

  const interactionIds = contactInteractions.map((i) => i.id);
  const contactFollowUps =
    interactionIds.length > 0
      ? await db
          .select()
          .from(followUps)
          .where(eq(followUps.contactId, contactId))
      : [];

  const followUpsByInteraction = new Map<number, typeof contactFollowUps>();
  for (const fu of contactFollowUps) {
    const existing = followUpsByInteraction.get(fu.interactionId) ?? [];
    existing.push(fu);
    followUpsByInteraction.set(fu.interactionId, existing);
  }

  return (
    <div className={fr.cx("fr-container", "fr-my-4w")}>
      <Breadcrumb
        homeLinkProps={{ href: "/" }}
        segments={[]}
        currentPageLabel={`${contact.firstName} ${contact.lastName}`}
      />

      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mb-4w")}>
        <div className={fr.cx("fr-col-12", "fr-col-md-8")}>
          <h1>
            {contact.firstName} {contact.lastName}
          </h1>
          <p className={fr.cx("fr-text--lg", "fr-mb-1w")}>
            {contact.administration}
            {contact.role ? ` — ${contact.role}` : ""}
          </p>
          {contact.context && (
            <p className={fr.cx("fr-text--sm", "fr-mb-2w")}>{contact.context}</p>
          )}
          <div className={fr.cx("fr-mb-2w")}>
            {contact.email && (
              <p className={fr.cx("fr-mb-0")}>
                <span className={fr.cx("fr-icon-mail-line", "fr-mr-1w")} aria-hidden="true" />
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            )}
            {contact.phone && (
              <p className={fr.cx("fr-mb-0")}>
                <span className={fr.cx("fr-icon-phone-line", "fr-mr-1w")} aria-hidden="true" />
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </p>
            )}
          </div>
        </div>
        <div className={fr.cx("fr-col-12", "fr-col-md-4")} style={{ textAlign: "right" }}>
          <Button
            linkProps={{ href: `/contacts/${contactId}/edit` }}
            priority="secondary"
            iconId="fr-icon-edit-line"
            className={fr.cx("fr-mr-1w")}
          >
            Modifier
          </Button>
          <DeleteContactButton contactId={contactId} />
        </div>
      </div>

      <section aria-label="Interactions">
        <h2 className={fr.cx("fr-mb-2w")}>Historique des interactions</h2>

        <div className={fr.cx("fr-mb-3w")}>
          <InteractionForm contactId={contactId} />
        </div>

        {contactInteractions.length === 0 ? (
          <p>Aucune interaction enregistrée.</p>
        ) : (
          <div role="list">
            {contactInteractions.map((interaction) => {
              const fus = followUpsByInteraction.get(interaction.id) ?? [];
              return (
                <article
                  key={interaction.id}
                  id={`interaction-${interaction.id}`}
                  role="listitem"
                  className={fr.cx("fr-p-3w", "fr-mb-2w")}
                  style={{ border: "1px solid var(--border-default-grey)" }}
                >
                  <div className={fr.cx("fr-grid-row", "fr-mb-1w")}>
                    <div className={fr.cx("fr-col")}>
                      <Badge
                        severity={TYPE_SEVERITY[interaction.type] ?? "info"}
                        small
                        noIcon
                      >
                        {TYPE_LABELS[interaction.type] ?? interaction.type}
                      </Badge>
                      <span className={fr.cx("fr-ml-2w", "fr-text--sm")}>
                        {formatDateFr(interaction.date)}
                      </span>
                    </div>
                  </div>
                  <p className={fr.cx("fr-mb-1w")} style={{ whiteSpace: "pre-wrap" }}>
                    {interaction.note}
                  </p>
                  {fus.length > 0 && (
                    <div className={fr.cx("fr-mt-2w")}>
                      {fus.map((fu) => (
                        <div
                          key={fu.id}
                          className={fr.cx("fr-p-1w", "fr-mb-1w")}
                          style={{
                            background: "var(--background-alt-grey)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span
                            className={fr.cx("fr-icon-calendar-line")}
                            aria-hidden="true"
                          />
                          <span>
                            Relance : {fu.label} — {formatShortDate(fu.dueDate)}
                          </span>
                          {fu.done ? (
                            <Badge severity="success" small noIcon>
                              Fait
                            </Badge>
                          ) : (
                            <MarkDoneButton followUpId={fu.id} contactId={contactId} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
