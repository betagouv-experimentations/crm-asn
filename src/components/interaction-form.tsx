"use client";

import { useRef, useState } from "react";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { Select } from "@codegouvfr/react-dsfr/Select";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { fr } from "@codegouvfr/react-dsfr";
import { createInteraction } from "@/app/contacts/[id]/actions";

interface InteractionFormProps {
  contactId: number;
}

function toLocalDatetime(date: Date): string {
  const pad = (n: number): string => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function InteractionForm({ contactId }: InteractionFormProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData): Promise<void> {
    await createInteraction(formData);
    formRef.current?.reset();
    setIsOpen(false);
    setShowFollowUp(false);
  }

  if (!isOpen) {
    return (
      <Button
        iconId="fr-icon-add-line"
        onClick={() => setIsOpen(true)}
      >
        Ajouter une interaction
      </Button>
    );
  }

  return (
    <div className={fr.cx("fr-p-3w", "fr-mb-3w")} style={{ border: "1px solid var(--border-default-grey)" }}>
      <h3 className={fr.cx("fr-mb-2w")}>Nouvelle interaction</h3>
      <form ref={formRef} action={handleSubmit}>
        <input type="hidden" name="contactId" value={contactId} />
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
            <Input
              label="Date *"
              nativeInputProps={{
                name: "date",
                type: "datetime-local",
                required: true,
                defaultValue: toLocalDatetime(new Date()),
              }}
            />
          </div>
          <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
            <Select
              label="Type d'échange *"
              nativeSelectProps={{ name: "type", required: true }}
            >
              <option value="" disabled>
                Sélectionnez
              </option>
              <option value="meeting">Réunion</option>
              <option value="call">Appel</option>
              <option value="email">Mail</option>
            </Select>
          </div>
        </div>
        <Input
          label="Note *"
          hintText="Résumé, décisions prises, follow-up à prévoir"
          textArea
          nativeTextAreaProps={{
            name: "note",
            rows: 4,
            required: true,
          }}
        />

        {!showFollowUp ? (
          <Button
            type="button"
            priority="tertiary"
            iconId="fr-icon-calendar-line"
            onClick={() => setShowFollowUp(true)}
            className={fr.cx("fr-mb-2w")}
          >
            Ajouter une relance
          </Button>
        ) : (
          <fieldset className={fr.cx("fr-fieldset", "fr-mb-2w")}>
            <legend className={fr.cx("fr-fieldset__legend", "fr-text--bold")}>
              Prochaine relance (optionnel)
            </legend>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <div className={fr.cx("fr-col-12", "fr-col-md-4")}>
                <Input
                  label="Date de relance"
                  nativeInputProps={{
                    name: "followUpDueDate",
                    type: "date",
                  }}
                />
              </div>
              <div className={fr.cx("fr-col-12", "fr-col-md-8")}>
                <Input
                  label="Libellé"
                  hintText='Ex : "Appeler sur le marché cloud"'
                  nativeInputProps={{
                    name: "followUpLabel",
                  }}
                />
              </div>
            </div>
          </fieldset>
        )}

        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col")}>
            <Button type="submit" className={fr.cx("fr-mr-2w")}>
              Enregistrer
            </Button>
            <Button
              type="button"
              priority="secondary"
              onClick={() => {
                setIsOpen(false);
                setShowFollowUp(false);
              }}
            >
              Annuler
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
