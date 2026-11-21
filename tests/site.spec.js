import { test, expect } from "@playwright/test";

// Open a page and wait for the logo preloader to finish and leave the DOM.
async function open(page, path) {
  await page.goto(path);
  await expect(page.locator("#preloader")).toHaveCount(0, { timeout: 10000 });
}

const PAGES = [
  { hash: "", h1: /Two markets\.\s*One alliance\./ },
  { hash: "#about", h1: /Built on\s*trust\./ },
  { hash: "#services", h1: /Open doors\.\s*Close deals\./ },
  { hash: "#membership", h1: /Join the\s*alliance\./ },
  { hash: "#events", h1: /In the\s*same room\./ },
  { hash: "#impact", h1: /From talk\s*to trade\./ },
  { hash: "#contact", h1: /Start the\s*conversation\./ },
];

// Collect script errors on every page.
test.beforeEach(async ({ page }, info) => {
  info.errors = [];
  page.on("pageerror", (e) => info.errors.push(e.message));
  // Most tests start as a returning visitor who accepted cookies, so the
  // consent banner isn't in the way. Tests tagged @consent start fresh.
  if (!info.tags.includes("@consent")) {
    await page.addInitScript(() => {
      try { localStorage.setItem("nibg-consent", JSON.stringify({ choice: "all", at: "2026-11-20T00:00:00.000Z" })); } catch {}
    });
  }
});

for (const p of PAGES) {
  test(`page ${p.hash || "#home"} renders its hero, images and footer`, async ({ page }, info) => {
    test.setTimeout(60000);
    await open(page, `/${p.hash}`);
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(p.h1);

    // Hero text sits in the left part of the page.
    const box = await h1.boundingBox();
    const vw = page.viewportSize().width;
    expect(box.x).toBeLessThan(vw * 0.1);

    // Every image on the page loads.
    // Wait for the site's own images, not for third-party embeds like the
    // Google Map, which keep the network busy.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect.poll(() => page.$$eval("img", (imgs) => imgs.every((i) => i.complete || i.loading === "lazy")), { timeout: 20000 }).toBe(true);
    const broken = await page.$$eval("img", (imgs) =>
      imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src)
    );
    expect(broken).toEqual([]);
    expect(await page.locator("img").count()).toBeGreaterThanOrEqual(4);

    // No sideways scrolling.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);

    await expect(page.locator("footer")).toContainText("Nigerian Indonesian Business Group");
    expect(info.errors).toEqual([]);
  });
}

test("navigation reaches every page and marks the current one", async ({ page, isMobile }) => {
  test.setTimeout(90000); // seven page changes in one test
  await open(page, "/");
  for (const p of PAGES.slice(1)) {
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
    const nav = page.getByRole("navigation", { name: "Main" }).filter({ visible: true });
    const link = nav.getByRole("link", { name: new RegExp(`^${p.hash.slice(1)}$`, "i") });
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${p.hash}$`));
    await expect(page.locator("h1")).toHaveText(p.h1);
    if (!isMobile) await expect(link).toHaveAttribute("aria-current", "page");
  }
  // Home is in the navigation as well as on the logo.
  if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
  const homeLink = page.getByRole("navigation", { name: "Main" }).filter({ visible: true }).getByRole("link", { name: /^Home$/ });
  await homeLink.click();
  await expect(page.locator("h1")).toHaveText(PAGES[0].h1);
  if (!isMobile) await expect(homeLink).toHaveAttribute("aria-current", "page");
});

test("header takes the colour of the section beneath it", async ({ page }) => {
  await open(page, "/");
  await expect(page.locator(".site-header")).toHaveAttribute("data-field", "paper");
  await page.evaluate(() => {
    const s = document.querySelector("section.statement");
    window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY + 40);
  });
  await expect(page.locator(".site-header")).toHaveAttribute("data-field", "red");
});

test("business clock shows Lagos and Jakarta six hours apart", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-11-18T08:30:00Z")); // Wed 09:30 Lagos, 15:30 Jakarta
  await open(page, "/");
  const times = await page.locator("#clock time").allTextContents();
  expect(times).toEqual(["09:30", "15:30"]);
  await expect(page.getByTestId("clock-summary")).toHaveText(/Both markets are in office hours/);
});

test("business clock reports when offices are closed", async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-11-21T12:00:00Z")); // Saturday
  await open(page, "/");
  await expect(page.getByTestId("status-Lagos")).toHaveText(/Outside office hours/);
  await expect(page.getByTestId("clock-summary")).toHaveText(/Best time for a call/);
});

test("services explorer switches with click and arrow keys", async ({ page }) => {
  await open(page, "/#services");
  const panel = page.getByRole("tabpanel");
  await expect(panel).toContainText("Trade promotion and market access");
  await page.getByRole("tab", { name: "Investment facilitation" }).click();
  await expect(panel).toContainText("Joint ventures and strategic partnerships");
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("tab", { name: "Business matchmaking and networking" })).toBeFocused();
  await expect(panel).toContainText("Investor introductions");
});

test("contact form validates and never claims a message was sent without the host", async ({ page }) => {
  await open(page, "/#contact");
  await page.getByRole("button", { name: /Send message/ }).click();
  await expect(page.getByTestId("form-status")).toHaveText("");
  await page.fill("#name", "Test Person");
  await page.fill("#email", "test@example.com");
  await page.fill("#message", "Hello from the test suite.");
  await page.getByRole("button", { name: /Send message/ }).click();
  await expect(page.getByTestId("form-status")).toHaveText(/can’t send messages from this preview/);
  await expect(page.getByTestId("form-status")).not.toHaveText(/received/);
});

test("home page gives an overview of every page", async ({ page }) => {
  await open(page, "/");
  const tiles = page.locator("#overview a");
  await expect(tiles).toHaveCount(6);
  await tiles.filter({ hasText: "Services" }).click();
  await expect(page).toHaveURL(/#services$/);
});

test("navigation hides on scroll and returns when the mouse nears the top", async ({ page, isMobile }) => {
  test.skip(isMobile, "pointer behaviour; phones are covered by the next test");
  await open(page, "/");
  const hdr = page.locator(".site-header");
  await expect(hdr).toHaveAttribute("data-shown", "true");
  await page.mouse.move(700, 600);
  await page.evaluate(() => window.scrollTo(0, 1600));
  await expect(hdr).toHaveAttribute("data-shown", "false");
  await page.mouse.move(700, 30);
  await expect(hdr).toHaveAttribute("data-shown", "true");
  await page.mouse.move(700, 600);
  await expect(hdr).toHaveAttribute("data-shown", "false");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(hdr).toHaveAttribute("data-shown", "true");
});

test("on touch screens the navigation returns when scrolling back up", async ({ page, isMobile }) => {
  test.skip(!isMobile, "touch behaviour");
  await open(page, "/");
  const hdr = page.locator(".site-header");
  await page.evaluate(() => window.scrollTo(0, 1600));
  await expect(hdr).toHaveAttribute("data-shown", "false");
  await page.evaluate(() => window.scrollTo(0, 1200));
  await expect(hdr).toHaveAttribute("data-shown", "true");
});

test("no progress line or underline under the navigation", async ({ page }) => {
  await open(page, "/#about");
  expect(await page.locator("#bar").count()).toBe(0);
  const after = await page.locator(".nav-link").first().evaluate((el) => getComputedStyle(el, "::after").content);
  expect(["none", "normal"]).toContain(after);
});

test("logo preloader plays and gets out of the way", async ({ page }) => {
  // Record the preloader's state from inside the page the moment its HTML
  // has been parsed, so a slow test machine can't miss it.
  await page.addInitScript(() => {
    document.addEventListener("readystatechange", () => {
      if (document.readyState !== "interactive") return;
      window.__plAtStart = {
        shown: !!document.getElementById("preloader"),
        green: !!document.querySelector("#preloader .pl-g"),
        red: !!document.querySelector("#preloader .pl-r"),
        locked: document.documentElement.classList.contains("pl-lock"),
      };
    });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const pl = page.locator("#preloader");
  const atStart = await page.evaluate(() => window.__plAtStart);
  expect(atStart).toEqual({ shown: true, green: true, red: true, locked: true });
  await expect(pl).toHaveCount(0, { timeout: 4000 });
  // Page is scrollable again once it has gone.
  await page.evaluate(() => window.scrollTo(0, 600));
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test("site icon is the logo mark", async ({ page }) => {
  await open(page, "/");
  const href = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(href).toContain("favicon-32.png");
  const res = await page.request.get(new URL(href, page.url()).href);
  expect(res.status()).toBe(200);
});

test("hero headline: top half green, lower half white", async ({ page }) => {
  test.setTimeout(90000); // opens four pages
  for (const hash of ["", "#about", "#services", "#contact"]) {
    await open(page, `/${hash}`);
    expect(await page.locator(".hero-h1 .on-top").evaluate((el) => getComputedStyle(el).color)).toBe("rgb(0, 122, 67)");
    expect(await page.locator(".hero-h1 .on-low").evaluate((el) => getComputedStyle(el).color)).toBe("rgb(255, 255, 255)");
  }
});

test("contact page shows the contact email, also in the footer", async ({ page }) => {
  await open(page, "/#contact");
  const email = page.getByTestId("contact-email");
  await expect(email).toHaveText("info@nigeriaindonesiabusinessgroup.com");
  await expect(email).toHaveAttribute("href", "mailto:info@nigeriaindonesiabusinessgroup.com");
  await page.getByRole("button", { name: "Copy email" }).click();
  await expect(page.locator("#contact-details [role=status]").first()).toHaveText(/copied|Selected/);
  await expect(page.locator("footer")).toContainText("info@nigeriaindonesiabusinessgroup.com");
});

test("contact page shows the phone number and office address", async ({ page }) => {
  await open(page, "/#contact");
  const phone = page.getByTestId("contact-phone");
  await expect(phone).toHaveText("+234 803 640 4602");
  await expect(phone).toHaveAttribute("href", "tel:+2348036404602");
  const address = page.getByTestId("contact-address");
  await expect(address).toContainText("12 Dennis Osadebe Street");
  await expect(address).toContainText("Aso Villa, Abuja");
  await expect(address).toHaveAttribute("href", /google\.com\/maps\/search\/.*Dennis%20Osadebe/);
  await expect(page.locator("footer")).toContainText("+234 803 640 4602");
  await expect(page.locator("footer")).toContainText("12 Dennis Osadebe Street");
});

test("office section embeds a Google map of the address on the live site", async ({ page }) => {
  await open(page, "/#contact");
  await expect(page.getByRole("heading", { name: "Visit our office" })).toBeVisible();
  const map = page.getByTestId("office-map").locator("iframe");
  await expect(map).toHaveAttribute("src", /^https:\/\/www\.google\.com\/maps\?q=12%20Dennis%20Osadebe%20Street.*output=embed/);
  await expect(map).toHaveAttribute("title", /Map of the NIBG office/);
  await expect(page.getByRole("link", { name: /Get directions/ })).toHaveAttribute("href", /google\.com\/maps/);
});

test("inside a framed preview the map falls back to an Open in Google Maps link", async ({ page }) => {
  await page.goto("/");
  await page.setContent(`<iframe src="${page.url()}#contact" style="width:1200px;height:900px"></iframe>`);
  const frame = page.frameLocator("iframe");
  await expect(frame.locator("#preloader")).toHaveCount(0, { timeout: 10000 });
  const box = frame.getByTestId("office-map");
  await expect(box.locator("iframe")).toHaveCount(0);
  await expect(box.getByRole("link", { name: /Open in Google Maps/ })).toHaveAttribute("href", /google\.com\/maps\/search/);
});

test("every closing section has its own background photo", async ({ page }) => {
  test.setTimeout(150000); // visits seven pages
  const seen = new Set();
  for (const hash of ["", "#about", "#services", "#membership", "#events", "#impact", "#contact"]) {
    await open(page, `/${hash}`);
    const img = page.locator(".cta--photo .cta-bg img");
    await expect(img).toHaveCount(1);
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el) => el.complete && el.naturalWidth > 0)).toBe(true);
    seen.add(await img.getAttribute("src"));
  }
  expect(seen.size).toBe(7); // a different photo on each page
});

test("contact closing section's button scrolls up to the form", async ({ page }) => {
  test.setTimeout(60000);
  await open(page, "/#contact");
  await page.locator(".cta--photo").scrollIntoViewIfNeeded();
  await page.locator(".cta--photo").getByRole("button", { name: /Write to us/ }).click();
  await expect(page).toHaveURL(/#contact$/); // stays on the contact page
  await expect(page.locator("#name")).toBeInViewport({ timeout: 5000 });
});

test("first visit asks about cookies; Essential only keeps the map off and is remembered", { tag: "@consent" }, async ({ page }) => {
  await open(page, "/#contact");
  const banner = page.getByTestId("cookie-banner");
  await expect(banner).toBeVisible();
  await expect(banner.getByRole("heading", { name: "Cookies and storage" })).toBeVisible();
  await banner.getByRole("button", { name: "Essential only" }).click();
  await expect(banner).toHaveCount(0);
  const map = page.getByTestId("office-map");
  await expect(map.locator("iframe")).toHaveCount(0);
  await expect(map.getByRole("button", { name: "Show map" })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("nibg-consent")).choice)).toBe("essential");
  await page.reload();
  await expect(page.locator("#preloader")).toHaveCount(0, { timeout: 10000 });
  await expect(page.getByTestId("cookie-banner")).toHaveCount(0);
});

test("Accept all loads the Google map; footer Cookie settings reopens the banner", { tag: "@consent" }, async ({ page }) => {
  await open(page, "/#contact");
  await page.getByTestId("cookie-banner").getByRole("button", { name: "Accept all" }).click();
  await expect(page.getByTestId("cookie-banner")).toHaveCount(0);
  await expect(page.getByTestId("office-map").locator("iframe")).toHaveAttribute("src", /google\.com\/maps/);
  await page.locator("footer").getByRole("button", { name: "Cookie settings" }).click();
  const banner = page.getByTestId("cookie-banner");
  await expect(banner).toBeVisible();
  await expect(banner).toContainText("Current choice: all cookies accepted");
  await expect(banner.getByRole("button", { name: "Accept all" })).toBeFocused();
});

test("Show map on the contact page gives consent and loads the map", { tag: "@consent" }, async ({ page }) => {
  await open(page, "/#contact");
  await page.getByTestId("cookie-banner").getByRole("button", { name: "Essential only" }).click();
  await page.getByTestId("office-map").getByRole("button", { name: "Show map" }).click();
  await expect(page.getByTestId("office-map").locator("iframe")).toHaveCount(1);
});

test("privacy policy page is reachable from the footer on every page", async ({ page }) => {
  test.setTimeout(90000);
  for (const hash of ["", "#services", "#contact"]) {
    await open(page, `/${hash}`);
    await page.locator("footer").getByRole("link", { name: "Privacy policy" }).first().click();
    await expect(page).toHaveURL(/#privacy$/);
    await expect(page.locator("h1")).toHaveText(/Your privacy,\s*plainly put\./);
  }
  await expect(page).toHaveTitle(/Privacy policy \| Nigerian Indonesian Business Group/);
  for (const name of ["Who we are", "What we collect", "How we use it", "Where it is kept", "Cookies and browser storage", "Other services on this site", "Your rights", "Changes to this policy"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await expect(page.locator("#policy")).toContainText("info@nigeriaindonesiabusinessgroup.com");
});

test("privacy contents jump to a section and cookie settings open from the policy", async ({ page }) => {
  await open(page, "/#privacy");
  await page.getByRole("navigation", { name: "Privacy policy contents" }).getByRole("button", { name: "Your rights" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Your rights" })).toBeInViewport({ timeout: 5000 });
  await page.getByRole("button", { name: "open cookie settings" }).click();
  await expect(page.getByTestId("cookie-banner")).toBeVisible();
});

test("cookie banner links to the privacy policy", { tag: "@consent" }, async ({ page }) => {
  await open(page, "/");
  await page.getByTestId("cookie-banner").getByRole("link", { name: "Privacy policy" }).click();
  await expect(page).toHaveURL(/#privacy$/);
  await expect(page.locator("h1")).toHaveText(/Your privacy/);
});

test("terms and conditions page is reachable from the footer", async ({ page }) => {
  await open(page, "/#about");
  await page.locator("footer").getByRole("link", { name: "Terms and conditions" }).first().click();
  await expect(page).toHaveURL(/#terms$/);
  await expect(page.locator("h1")).toHaveText(/Clear terms,\s*fair use\./);
  await expect(page).toHaveTitle(/Terms and conditions \| Nigerian Indonesian Business Group/);
  for (const name of ["About these terms", "Using this website", "Information on this site", "Our name, logo and content", "Governing law", "Contact us"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await page.getByRole("navigation", { name: "Terms and conditions contents" }).getByRole("button", { name: "Governing law" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Governing law" })).toBeInViewport({ timeout: 5000 });
  await page.locator("#terms").getByRole("link", { name: "privacy policy" }).click();
  await expect(page).toHaveURL(/#privacy$/);
});

test.describe("smooth scrolling", () => {
  test("wheel scrolling glides to its target instead of jumping", async ({ page, isMobile }) => {
    test.skip(isMobile, "touch screens keep native momentum scrolling");
    await open(page, "/#about");
    expect(await page.evaluate(() => !!window.__lenis)).toBe(true);
    // Sample the scroll position every frame inside the page, so a slow test
    // machine can't distort the timing.
    const frames = await page.evaluate(() => new Promise((resolve) => {
      const ys = [];
      const t0 = performance.now();
      const tick = () => {
        ys.push(window.scrollY);
        if (performance.now() - t0 < 1800) requestAnimationFrame(tick); else resolve(ys);
      };
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: 800, bubbles: true, cancelable: true }));
      requestAnimationFrame(tick);
    }));
    const distinct = new Set(frames.map((y) => Math.round(y)));
    expect(distinct.size).toBeGreaterThan(6);                   // travelled over many frames
    expect(frames.at(-1)).toBeGreaterThan(600);                 // and arrived
    for (let i = 1; i < frames.length; i++) expect(frames[i]).toBeGreaterThanOrEqual(frames[i - 1] - 0.5); // never backtracks
  });

  test("scrolling is paused while the preloader plays", async ({ page, isMobile }) => {
    test.skip(isMobile, "pointer behaviour");
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => !!window.__lenis);
    // Read the lock and the scroller in the same instant: while the page is
    // locked under the preloader, smooth scrolling must be stopped.
    const state = await page.evaluate(() => ({
      locked: document.documentElement.classList.contains("pl-lock"),
      stopped: window.__lenis.isStopped,
    }));
    if (state.locked) expect(state.stopped).toBe(true);
    await expect(page.locator("#preloader")).toHaveCount(0, { timeout: 10000 });
    expect(await page.evaluate(() => window.__lenis.isStopped)).toBe(false);
  });

  test("parallax photos hold still between frames (no wobble)", async ({ page }) => {
    await open(page, "/#about");
    await page.evaluate(() => window.scrollTo(0, document.querySelector(".collage").getBoundingClientRect().top + window.scrollY - 300));
    await page.waitForTimeout(3000);   // let late layout (fonts, lazy images) settle
    const read = () => page.evaluate(() => {
      window.dispatchEvent(new Event("scroll"));   // ask the effect to recompute
      return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() =>
        r([...document.querySelectorAll("[data-parallax]")].map((el) => el.style.transform).join("|")))));
    });
    const first = await read();
    for (let i = 0; i < 4; i++) expect(await read()).toBe(first);
  });

  test("reduced motion turns smooth scrolling off", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page, "/");
    expect(await page.evaluate(() => !!window.__lenis)).toBe(false);
  });
});

test("every hero has a background photo; red content sections never do", async ({ page }) => {
  test.setTimeout(180000); // visits nine pages
  const pages = { "": true, "#about": true, "#services": true, "#membership": true, "#events": true, "#impact": true, "#contact": true, "#privacy": true, "#terms": true };
  for (const [hash, expectBg] of Object.entries(pages)) {
    await open(page, `/${hash}`);
    await expect(page.locator(".hero .hero-bg")).toHaveCount(expectBg ? 1 : 0);
    // No section with the red field ever carries a background photo.
    expect(await page.locator('section[data-field="red"] .cta-bg').count()).toBe(0);
  }
});

test("events gallery shows every photo and opens a full-screen viewer", async ({ page, isMobile }, info) => {
  test.setTimeout(120000);
  await open(page, "/#events");
  const gallery = page.getByTestId("gallery");
  await gallery.scrollIntoViewIfNeeded();
  const tiles = gallery.getByRole("button");
  const count = await tiles.count();
  expect(count).toBeGreaterThanOrEqual(18);
  // Photos load lazily as they scroll into view: bring each one in and check it.
  const imgs = gallery.locator("img");
  for (let i = 0; i < count; i++) {
    await imgs.nth(i).scrollIntoViewIfNeeded();
    await expect.poll(() => imgs.nth(i).evaluate((el) => el.complete && el.naturalWidth > 0), { timeout: 10000 }).toBe(true);
  }
  await gallery.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await gallery.screenshot({ path: `${info.outputDir}/../../gallery-${isMobile ? "phone" : "desktop"}.png` });

  // Open the second photo; step forwards and back; close with Escape.
  await tiles.nth(1).click();
  const box = page.getByTestId("lightbox");
  await expect(box).toBeVisible();
  await expect(box).toContainText(`2 / ${count}`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${info.outputDir}/../../lightbox-${isMobile ? "phone" : "desktop"}.png` });
  await page.keyboard.press("ArrowRight");
  await expect(box).toContainText(`3 / ${count}`);
  await box.getByRole("button", { name: "Previous photo" }).click();
  await expect(box).toContainText(`2 / ${count}`);
  await page.keyboard.press("Escape");
  await expect(box).toBeHidden();
  await expect(tiles.nth(1)).toBeFocused();   // focus returns to the photo that opened it
});
