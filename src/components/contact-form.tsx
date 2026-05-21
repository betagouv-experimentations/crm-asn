"use client";

import { useRef } from "react";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import type { Contact } from "@/db/schema";

interface ContactFormProps {
  action: (formData: FormData) => Promise<void>;
  contact?: Contact;
  submitLabel: string;
}

export function ContactForm({ action, contact, submitLabel }: ContactFormProps): React.ReactElement {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action}>
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
          <Input
            label="Prénom *"
            nativeInputProps={{
              name: "firstName",
              required: true,
              defaultValue: contact?.firstName ?? "",
              autoComplete: "given-name",
            }}
          />
        </div>
        <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
          <Input
            label="Nom *"
            nativeInputProps={{
              name: "lastName",
              required: true,
              defaultValue: contact?.lastName ?? "",
              autoComplete: "family-name",
            }}
          />
        </div>
      </div>
      <Input
        label="Administration *"
        hintText="Ministère ou direction (ex : DGFiP, DINUM)"
        nativeInputProps={{
          name: "administration",
          required: true,
          defaultValue: contact?.administration ?? "",
        }}
      />
      <Input
        label="Rôle / fonction"
        nativeInputProps={{
          name: "role",
          defaultValue: contact?.role ?? "",
        }}
      />
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
          <Input
            label="Email"
            nativeInputProps={{
              name: "email",
              type: "email",
              defaultValue: contact?.email ?? "",
              autoComplete: "email",
            }}
          />
        </div>
        <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
          <Input
            label="Téléphone"
            nativeInputProps={{
              name: "phone",
              type: "tel",
              defaultValue: contact?.phone ?? "",
              autoComplete: "tel",
            }}
          />
        </div>
      </div>
      <Input
        label="Contexte d'accompagnement"
        hintText="2-3 lignes sur le sujet d'accompagnement"
        textArea
        nativeTextAreaProps={{
          name: "context",
          rows: 3,
          defaultValue: contact?.context ?? "",
        }}
      />
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
