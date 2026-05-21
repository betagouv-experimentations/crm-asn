import { NextRequest, NextResponse } from "next/server";
import { ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { contacts } from "@/db/schema";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const pattern = `%${q}%`;

  const results = await db
    .select({
      id: contacts.id,
      firstName: contacts.firstName,
      lastName: contacts.lastName,
      administration: contacts.administration,
      role: contacts.role,
    })
    .from(contacts)
    .where(
      or(
        ilike(contacts.firstName, pattern),
        ilike(contacts.lastName, pattern),
        ilike(contacts.administration, pattern),
        sql`${contacts.firstName} || ' ' || ${contacts.lastName} ilike ${pattern}`,
        sql`${contacts.lastName} || ' ' || ${contacts.firstName} ilike ${pattern}`,
      ),
    )
    .limit(10);

  return NextResponse.json(results);
}
