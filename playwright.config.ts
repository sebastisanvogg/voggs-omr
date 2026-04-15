import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright is wired ONLY for the screenshot script (`pnpm screenshots`).
 * We are not running E2E tests in this project — Vitest covers unit tests.
 */
export default defineConfig({
  testDir: "./scripts/playwright",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile",
      use: { ...devices["iPhone 14"] },
    },
  ],
});
