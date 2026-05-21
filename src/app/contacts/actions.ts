"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contacts } from "@/db/schema";
import { contactSchema } from "@/lib/validations";

export async function createContact(formData: FormData): Promise<void> {
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    administration: formData.get("administration"),
    role: formData.get("role"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    context: formData.get("context"),
  };

  const parsed = contactSchema.parse(raw);

  const [created] = await db
    .insert(contacts)
    .values({
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      administration: parsed.administration,
      role: parsed.role || null,
      email: parsed.email || null,
      phone: parsed.phone || null,
      context: parsed.context || null,
    })
    .returning({ id: contacts.id });

  redirect(`/contacts/${created!.id}`);
}

export async function updateContact(id: number, formData: FormData): Promise<void> {
  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    administration: formData.get("administration"),
    role: formData.get("role"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    context: formData.get("context"),
  };

  const parsed = contactSchema.parse(raw);

  await db
    .update(contacts)
    .set({
      firstName: parsed.firstName,
      lastName: parsed.lastName,
      administration: parsed.administration,
      role: parsed.role || null,
      email: parsed.email || null,
      phone: parsed.phone || null,
      context: parsed.context || null,
      updatedAt: new Date(),
    })
    .where(eq(contacts.id, id));

  redirect(`/contacts/${id}`);
}

export async function deleteContact(id: number): Promise<void> {
  await db.delete(contacts).where(eq(contacts.id, id));
  revalidatePath("/");
  redirect("/");
}
