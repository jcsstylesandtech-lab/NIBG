// Screenshot every matching section of one page at desktop and phone width.
// Usage (with `npm run preview` running):
//   node scripts/shots.mjs membership ./out                 (statement sections)
//   node scripts/shots.mjs membership ./out ".cta--photo"    (any selector)
import { chromium } from "@playwright/test";

const [page = "", out = ".", selector = "section.statement"] = process.argv.slice(2);
const browser = await chromium.launch({ channel: "chrome" });
for (const [w, h, tag] of [[1440, 900, "desktop"], [390, 844, "phone"]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  await p.goto(`http://localhost:4173/#${page}`);
  await p.waitForSelector("#preloader", { state: "detached", timeout: 10000 });
  const count = await p.locator(selector).count();
  for (let i = 0; i < count; i++) {
    await p.evaluate(([sel, n]) => window.scrollTo(0, document.querySelectorAll(sel)[n].getBoundingClientRect().top + window.scrollY), [selector, i]);
    await p.waitForTimeout(2600);
    await p.screenshot({ path: `${out}/${page || "home"}-${tag}-${i}.png` });
  }
  await p.close();
}
await browser.close();
