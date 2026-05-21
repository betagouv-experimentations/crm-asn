import Link from "next/link";
import { desc, eq, and, lte, gte, sql } from "drizzle-orm";
import { fr } from "@codegouvfr/react-dsfr";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { db } from "@/db";
import { contacts, followUps } from "@/db/schema";
import { SearchBar } from "@/components/search-bar";

function getWeekBounds(): { start: string; end: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10),
  };
}

function formatDateFr(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

function getFollowUpStatus(dueDate: string): "overdue" | "today" | "upcoming" {
  const today = new Date().toISOString().slice(0, 10);
  if (dueDate < today) return "overdue";
  if (dueDate === today) return "today";
  return "upcoming";
}

export default async function HomePage(): Promise<React.ReactElement> {
  const { start, end } = getWeekBounds();
  const today = new Date().toISOString().slice(0, 10);

  const weekFollowUps = await db
    .select({
      id: followUps.id,
      dueDate: followUps.dueDate,
      label: followUps.label,
      contactId: followUps.contactId,
      interactionId: followUps.interactionId,
      contactFirstName: contacts.firstName,
      contactLastName: contacts.lastName,
    })
    .from(followUps)
    .innerJoin(contacts, eq(followUps.contactId, contacts.id))
    .where(
      and(
        eq(followUps.done, false),
        lte(followUps.dueDate, end),
      ),
    )
    .orderBy(followUps.dueDate);

  const recentContacts = await db
    .select({
      id: contacts.id,
      firstName: contacts.firstName,
      lastName: contacts.lastName,
      administration: contacts.administration,
      role: contacts.role,
    })
    .from(contacts)
    .orderBy(desc(contacts.lastViewedAt))
    .limit(5);

  const allContacts = await db
    .select({
      id: contacts.id,
      firstName: contacts.firstName,
      lastName: contacts.lastName,
      administration: contacts.administration,
      role: contacts.role,
    })
    .from(contacts)
    .orderBy(contacts.lastName, contacts.firstName);

  return (
    <div className={fr.cx("fr-container", "fr-my-4w")}>
      <h1>Suivi des accompagnements</h1>

      {weekFollowUps.length > 0 && (
        <section className={fr.cx("fr-mb-4w")} aria-label="Relances de la semaine">
          <h2 className={fr.cx("fr-mb-2w")}>Mes relances cette semaine</h2>
          <div role="list">
            {weekFollowUps.map((fu) => {
              const status = getFollowUpStatus(fu.dueDate);
              return (
                <div
                  key={fu.id}
                  role="listitem"
                  className={fr.cx("fr-p-2w", "fr-mb-1w")}
                  style={{
                    border: "1px solid var(--border-default-grey)",
                    borderLeft: `4px solid ${
                      status === "overdue"
                        ? "var(--background-flat-error)"
                        : status === "today"
                          ? "var(--background-flat-warning)"
                          : "var(--border-default-grey)"
                    }`,
                  }}
                >
                  <Link
                    href={`/contacts/${fu.contactId}#interaction-${fu.interactionId}`}
                    className={fr.cx("fr-link")}
                  >
                    <span className={fr.cx("fr-text--bold")}>{fu.label}</span>
                    {" — "}
                    {fu.contactFirstName} {fu.contactLastName}
                  </Link>
                  <span className={fr.cx("fr-ml-2w", "fr-text--sm")}>
                    {formatDateFr(fu.dueDate)}
                  </span>
                  {status === "overdue" && (
                    <Badge severity="error" small noIcon className={fr.cx("fr-ml-1w")}>
                      En retard
                    </Badge>
                  )}
                  {status === "today" && (
                    <Badge severity="warning" small noIcon className={fr.cx("fr-ml-1w")}>
                      Aujourd&apos;hui
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className={fr.cx("fr-mb-4w")} aria-label="Recherche">
        <SearchBar />
      </section>

      <div className={fr.cx("fr-mb-3w")}>
        <Button
          linkProps={{ href: "/contacts/new" }}
          iconId="fr-icon-add-line"
        >
          Ajouter un interlocuteur
        </Button>
      </div>

      {recentContacts.length > 0 && (
        <section className={fr.cx("fr-mb-4w")} aria-label="Interlocuteurs récents">
          <h2 className={fr.cx("fr-mb-2w")}>Interlocuteurs récents</h2>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            {recentContacts.map((c) => (
              <div key={c.id} className={fr.cx("fr-col-12", "fr-col-md-6", "fr-col-lg-4")}>
                <div
                  className={fr.cx("fr-card", "fr-card--no-arrow", "fr-enlarge-link", "fr-p-2w")}
                >
                  <h3 className={fr.cx("fr-text--md", "fr-mb-0")}>
                    <Link href={`/contacts/${c.id}`} className="fr-card__link">
                      {c.firstName} {c.lastName}
                    </Link>
                  </h3>
                  <p className={fr.cx("fr-text--sm", "fr-mb-0")}>
                    {c.administration}
                    {c.role ? ` — ${c.role}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Tous les interlocuteurs">
        <h2 className={fr.cx("fr-mb-2w")}>Tous les interlocuteurs ({allContacts.length})</h2>
        {allContacts.length === 0 ? (
          <p className={fr.cx("fr-text--lg")}>
            Aucun interlocuteur pour le moment.{" "}
            <Link href="/contacts/new" className={fr.cx("fr-link")}>
              Ajouter le premier
            </Link>
          </p>
        ) : (
          <div className="fr-table" role="table">
            <table>
              <caption className="fr-sr-only">Liste des interlocuteurs</caption>
              <thead>
                <tr>
                  <th scope="col">Nom</th>
                  <th scope="col">Administration</th>
                  <th scope="col">Rôle</th>
                </tr>
              </thead>
              <tbody>
                {allContacts.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link href={`/contacts/${c.id}`} className={fr.cx("fr-link")}>
                        {c.lastName} {c.firstName}
                      </Link>
                    </td>
                    <td>{c.administration}</td>
                    <td>{c.role ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
