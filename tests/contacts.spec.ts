import { test, expect } from "@playwright/test";

test.setTimeout(60000);

async function createContact(
  page: import("@playwright/test").Page,
  data: { firstName: string; lastName: string; administration: string },
): Promise<void> {
  await page.goto("/contacts/new");
  await page.getByRole("textbox", { name: "Prénom *" }).fill(data.firstName);
  await page.getByRole("textbox", { name: "Nom *", exact: true }).fill(data.lastName);
  await page.getByRole("textbox", { name: "Administration *" }).fill(data.administration);
  await page.getByRole("button", { name: "Créer l'interlocuteur" }).click();
  await page.waitForURL(/\/contacts\/\d+/, { timeout: 30000 });
}

test.describe("Suivi des accompagnements ASN", () => {
  test("page d'accueil affiche le titre et la recherche", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Suivi des accompagnements");
    await expect(page.getByLabel("Rechercher un interlocuteur")).toBeVisible();
  });

  test("créer un interlocuteur et le retrouver", async ({ page }) => {
    await page.goto("/contacts/new");
    await expect(page.locator("h1")).toContainText("Ajouter un interlocuteur");

    await page.getByRole("textbox", { name: "Prénom *" }).fill("Jean");
    await page.getByRole("textbox", { name: "Nom *", exact: true }).fill("Dupont");
    await page.getByRole("textbox", { name: "Administration *" }).fill("DINUM");
    await page.getByRole("textbox", { name: "Rôle" }).fill("Chef de projet");
    await page.getByRole("textbox", { name: "Email" }).fill("jean.dupont@modernisation.gouv.fr");
    await page.getByRole("textbox", { name: "Téléphone" }).fill("01 42 75 80 00");
    await page.getByRole("textbox", { name: "Contexte" }).fill("Test de cadrage");

    await page.getByRole("button", { name: "Créer l'interlocuteur" }).click();
    await page.waitForURL(/\/contacts\/\d+/, { timeout: 30000 });

    await expect(page.locator("h1")).toContainText("Jean Dupont");
    await expect(page.getByText("DINUM")).toBeVisible();
    await expect(page.getByText("Chef de projet")).toBeVisible();
  });

  test("modifier un interlocuteur", async ({ page }) => {
    await createContact(page, { firstName: "Marie", lastName: "Modif", administration: "DGFiP" });
    await expect(page.locator("h1")).toContainText("Marie Modif");

    await page.getByRole("link", { name: "Modifier" }).click();
    await page.waitForURL(/\/edit/, { timeout: 15000 });

    await page.getByRole("textbox", { name: "Administration *" }).fill("Ministère de l'Intérieur");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await page.waitForURL(/\/contacts\/\d+$/, { timeout: 30000 });

    await expect(page.getByText("Ministère de l'Intérieur")).toBeVisible();
  });

  test("supprimer un interlocuteur", async ({ page }) => {
    await createContact(page, { firstName: "Temp", lastName: "Supprimable", administration: "Test" });
    await expect(page.locator("h1")).toContainText("Temp Supprimable");

    page.on("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Supprimer" }).click();
    await page.waitForURL("/", { timeout: 30000 });

    await expect(page.locator("h1")).toContainText("Suivi des accompagnements");
  });

  test("ajouter une interaction avec relance", async ({ page }) => {
    await createContact(page, { firstName: "Paul", lastName: "Interact", administration: "ADEME" });
    await expect(page.locator("h1")).toContainText("Paul Interact");

    await page.getByRole("button", { name: "Ajouter une interaction" }).click();
    await page.getByRole("combobox", { name: "Type d'échange *" }).selectOption("call");
    await page.getByRole("textbox", { name: "Note *" }).fill("Appel de suivi sur le projet.");
    await page.getByRole("button", { name: "Ajouter une relance" }).click();
    await page.getByRole("textbox", { name: "Libellé" }).fill("Relancer Paul sur le rapport");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);
    await page.getByLabel("Date de relance").fill(dateStr);

    await page.getByRole("button", { name: "Enregistrer" }).click();

    await expect(page.getByText("Appel de suivi sur le projet.")).toBeVisible({ timeout: 15000 });
    await expect(page.getByText("Relancer Paul sur le rapport")).toBeVisible();
  });

  test("recherche d'interlocuteur", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.getByLabel("Rechercher un interlocuteur");
    await searchInput.fill("Ali");

    await expect(
      page.locator("[role='option']").filter({ hasText: "Alice" }).first(),
    ).toBeVisible({ timeout: 5000 });
  });

  test("pages obligatoires accessibles", async ({ page }) => {
    await page.goto("/mentions-legales");
    await expect(page.locator("h1")).toContainText("Mentions légales");

    await page.goto("/accessibilite");
    await expect(page.locator("h1")).toContainText("accessibilité");

    await page.goto("/donnees-personnelles");
    await expect(page.locator("h1")).toContainText("Données personnelles");
  });

  test("liens footer présents sur la page d'accueil", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Mentions légales" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Données personnelles" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Accessibilité/ })).toBeVisible();
  });
});
