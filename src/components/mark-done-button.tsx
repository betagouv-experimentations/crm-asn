"use client";

import { Button } from "@codegouvfr/react-dsfr/Button";
import { markFollowUpDone } from "@/app/contacts/[id]/actions";

interface MarkDoneButtonProps {
  followUpId: number;
  contactId: number;
}

export function MarkDoneButton({ followUpId, contactId }: MarkDoneButtonProps): React.ReactElement {
  async function handleClick(): Promise<void> {
    await markFollowUpDone(followUpId, contactId);
  }

  return (
    <Button
      priority="tertiary no outline"
      size="small"
      iconId="fr-icon-check-line"
      onClick={handleClick}
    >
      Fait
    </Button>
  );
}
