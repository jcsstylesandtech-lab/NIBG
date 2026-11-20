import { defineConfig, devices } from "@playwright/test";

// Tests run against the production build (vite build + vite preview),
// in the locally installed Chrome, at desktop and phone sizes.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173/",
    channel: "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1440, height: 900 } } },
    { name: "phone", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
  webServer: {
    command: "npm run build && npm run preview",
    url: "http://localhost:4173/",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
