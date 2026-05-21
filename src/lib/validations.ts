import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  administration: z.string().min(1, "L'administration est requise"),
  role: z.string().optional().default(""),
  email: z.union([z.string().email("Email invalide"), z.literal("")]).optional().default(""),
  phone: z.string().optional().default(""),
  context: z.string().optional().default(""),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const interactionSchema = z.object({
  contactId: z.number().int().positive(),
  date: z.string().min(1, "La date est requise"),
  type: z.enum(["meeting", "call", "email"], {
    errorMap: () => ({ message: "Type d'échange requis" }),
  }),
  note: z.string().min(1, "La note ne peut pas être vide"),
  followUpDueDate: z.string().optional().default(""),
  followUpLabel: z.string().optional().default(""),
});

export type InteractionFormData = z.infer<typeof interactionSchema>;
