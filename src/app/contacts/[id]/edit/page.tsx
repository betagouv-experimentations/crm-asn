import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { fr } from "@codegouvfr/react-dsfr";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { ContactForm } from "@/components/contact-form";
import { updateContact } from "@/app/contacts/actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContactPage({ params }: PageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const contactId = Number(id);

  const contact = await db.query.contacts.findFirst({
    where: eq(contacts.id, contactId),
  });

  if (!contact) notFound();

  const boundAction = updateContact.bind(null, contactId);

  return (
    <div className={fr.cx("fr-container", "fr-my-4w")}>
      <Breadcrumb
        homeLinkProps={{ href: "/" }}
        segments={[
          {
            label: `${contact.firstName} ${contact.lastName}`,
            linkProps: { href: `/contacts/${contactId}` },
          },
        ]}
        currentPageLabel="Modifier"
      />
      <h1>Modifier {contact.firstName} {contact.lastName}</h1>
      <ContactForm
        action={boundAction}
        contact={contact}
        submitLabel="Enregistrer les modifications"
      />
    </div>
  );
}
