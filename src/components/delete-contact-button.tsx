"use client";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { deleteContact } from "@/app/contacts/actions";

interface DeleteContactButtonProps {
  contactId: number;
}

export function DeleteContactButton({ contactId }: DeleteContactButtonProps): React.ReactElement {
  async function handleDelete(): Promise<void> {
    const confirmed = window.confirm(
      "Supprimer cet interlocuteur et tout son historique ? Cette action est irréversible.",
    );
    if (!confirmed) return;
    await deleteContact(contactId);
  }

  return (
    <Button
      priority="tertiary"
      iconId="fr-icon-delete-line"
      onClick={handleDelete}
    >
      Supprimer
    </Button>
  );
}
