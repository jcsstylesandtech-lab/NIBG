# Nigerian Indonesian Business Group (NIBG) website

The website of the Nigerian Indonesian Business Group, built with React, Vite and Tailwind CSS.

## Run it

Needs Node.js 20 or newer.

```bash
npm install
npm run dev        # local development server
npm run build      # production build into dist/
npm run preview    # serve the production build on http://localhost:4173
```

Upload the contents of `dist/` to any static web host. Pages use hash links
(`#about`, `#services` …), so no server routing setup is needed.

## Where things are

| Path | What it holds |
| --- | --- |
| `src/content.js` | All text, contact details, images and the map address. Edit words here. |
| `src/pages/` | One file per page: Home, About, Services, Membership, Events, Impact, Contact, Privacy, Terms. |
| `src/components/` | Header and footer, page blocks, the business clock, cookie consent, legal page layout. |
| `src/motion.js` | Smooth scrolling (Lenis), parallax and scroll animation. |
| `src/index.css` | Colours, type sizes, neumorphism and section styles. |
| `index.html` | Page shell and the logo preloader. |
| `public/img/` | Photos, logo and site icons. |
| `tests/site.spec.js` | Browser tests (Playwright). |

## Tests

```bash
npx playwright test
```

Runs in the installed Google Chrome at desktop and phone sizes against the production build.

## Before launch

- Have the Privacy policy and Terms and conditions reviewed by NIBG's legal adviser.
- Confirm the governance structure, priority sectors and membership details on the site.
- Set the exact office location for the map (`MAP` in `src/content.js`).
- The contact form saves messages through the hosting platform's data service
  (`/_sdk/...` script in `index.html`); it only works on that host.
