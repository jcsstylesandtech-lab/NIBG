// Smoke-test the live site: every page renders, its images load, no script errors.
// Usage: node scripts/check-live.mjs https://jcsstylesandtech-lab.github.io/NIBG/
import { chromium, devices } from "@playwright/test";
const base = process.argv[2];
const pages = ["", "about", "services", "membership", "events", "impact", "contact", "privacy", "terms"];
const browser = await chromium.launch({ channel: "chrome" });
let problems = 0;
for (const [name, ctxOpts] of [["desktop", { viewport: { width: 1440, height: 900 } }], ["phone", devices["Pixel 7"]]]) {
  const ctx = await browser.newContext(ctxOpts);
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.on("response", (r) => { if (r.status() >= 400 && r.url().startsWith(base)) errors.push(`${r.status()} ${r.url()}`); });
  for (const pg of pages) {
    await p.goto(`${base}#${pg}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForSelector("#preloader", { state: "detached", timeout: 20000 });
    const h1 = (await p.locator("h1").innerText()).replace(/\s+/g, " ");
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } });
    await p.waitForTimeout(1500);
    const broken = await p.$$eval("img", (imgs) => imgs.filter((i) => i.complete && i.naturalWidth === 0).length);
    const imgs = await p.locator("img").count();
    if (broken) problems++;
    console.log(`${name.padEnd(7)} #${(pg || "home").padEnd(10)} "${h1}"  images ${imgs - broken}/${imgs}`);
  }
  if (errors.length) { problems += errors.length; console.log(`${name} errors:`, errors.slice(0, 5)); }
  await ctx.close();
}
await browser.close();
console.log(problems ? `PROBLEMS: ${problems}` : "ALL GOOD");
