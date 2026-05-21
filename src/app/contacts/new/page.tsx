import type { Metadata } from "next";
import { fr } from "@codegouvfr/react-dsfr";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { ContactForm } from "@/components/contact-form";
import { createContact } from "@/app/contacts/actions";

export const metadata: Metadata = {
  title: "Nouvel interlocuteur",
};

export default function NewContactPage(): React.ReactElement {
  return (
    <div className={fr.cx("fr-container", "fr-my-4w")}>
      <Breadcrumb
        homeLinkProps={{ href: "/" }}
        segments={[]}
        currentPageLabel="Nouvel interlocuteur"
      />
      <h1>Ajouter un interlocuteur</h1>
      <ContactForm action={createContact} submitLabel="Créer l'interlocuteur" />
    </div>
  );
}
