import { expect, test } from "@playwright/test";

test("redirects dashboard visitors to sign in", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole("heading", { name: "Practice job interviews with AI" })).toBeVisible();
});

test("shows sign up page", async ({ page }) => {
  await page.goto("/sign-up");

  await expect(page.getByRole("button", { name: "Create an Account" })).toBeVisible();
});
