"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { interactions, followUps } from "@/db/schema";
import { interactionSchema } from "@/lib/validations";

export async function createInteraction(formData: FormData): Promise<void> {
  const raw = {
    contactId: Number(formData.get("contactId")),
    date: formData.get("date"),
    type: formData.get("type"),
    note: formData.get("note"),
    followUpDueDate: formData.get("followUpDueDate"),
    followUpLabel: formData.get("followUpLabel"),
  };

  const parsed = interactionSchema.parse(raw);

  const [created] = await db
    .insert(interactions)
    .values({
      contactId: parsed.contactId,
      date: new Date(parsed.date),
      type: parsed.type,
      note: parsed.note,
    })
    .returning({ id: interactions.id });

  if (parsed.followUpDueDate && parsed.followUpLabel) {
    await db.insert(followUps).values({
      interactionId: created!.id,
      contactId: parsed.contactId,
      dueDate: parsed.followUpDueDate,
      label: parsed.followUpLabel,
    });
  }

  revalidatePath(`/contacts/${parsed.contactId}`);
  revalidatePath("/");
}

export async function markFollowUpDone(followUpId: number, contactId: number): Promise<void> {
  await db
    .update(followUps)
    .set({ done: true })
    .where(eq(followUps.id, followUpId));

  revalidatePath(`/contacts/${contactId}`);
  revalidatePath("/");
}
