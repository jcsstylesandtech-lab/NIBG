import { IMG, PAGES, OVERVIEW } from "../content.js";
import { scrollToId } from "../motion.js";

/** Background photo for a coloured section: drifts slowly with the scroll,
 *  under an overlay tinted with the section's own colour (see .cta-bg). */
export function SectionBg({ src, pos = "50% 50%", speed = -0.1 }) {
  return (
    <div className="cta-bg" aria-hidden="true">
      <img src={src} alt="" width="1920" height="1080" loading="lazy" style={{ objectPosition: pos }} data-parallax={speed} />
    </div>
  );
}

/** Hero: paper above, one flag colour below; the two-line headline sits on
 *  the left, crosses the seam and changes ink where it does. */
export function Hero({ field = "green", lines, sentence, action, img, alt = "", imgPos = "50% 50%", bg }) {
  const [a, b] = lines;
  const withBg = bg && field !== "red";   // red fields stay plain
  const isLink = action.to?.startsWith("#");
  return (
    <section className={`hero${withBg ? " hero--bg" : ""}`} data-field="paper">
      <div className="hero-top" />
      {withBg && (
        // Background photo behind the coloured lower half, tinted with its colour.
        <div className="hero-bg" data-field={field} aria-hidden="true">
          <SectionBg src={bg} speed={-0.08} />
        </div>
      )}
      <h1 className="hero-h1">
        <span className="on-top">{a}<br />{b}</span>
        <span className="on-low" aria-hidden="true">{a}<br />{b}</span>
      </h1>
      <div className="hero-low" data-field={field}>
        <div className="wrap hero-low-in">
          <div className="hero-text">
            <p className="rise t-lead leading-snug">{sentence}</p>
            <div className="rise mt-8" style={{ "--i": 1 }}>
              {isLink ? (
                <a className="btn" href={action.to}>{action.label} <span className="arr" aria-hidden="true">→</span></a>
              ) : (
                <button type="button" className="btn" onClick={() => scrollToId(action.scroll)}>{action.label} <span className="arr" aria-hidden="true">→</span></button>
              )}
            </div>
          </div>
        </div>
        {/* Desktop: placed against the whole hero, crossing the seam.
            Phone: sits in the lower field under the text. */}
        <figure className="hero-fig" data-parallax="-0.06">
          <img src={img} alt={alt} width="1920" height="1080" fetchPriority="high" style={{ objectPosition: imgPos }} />
        </figure>
      </div>
    </section>
  );
}

/** A statement: heading (with its picture) on the left, the statement and
 *  any supporting text on the right. Nothing overlaps the text. */
export function Intro({ field = "paper", id, heading, statement, children, chip, chips, bg }) {
  const pics = chips ?? (chip ? [chip] : []);
  return (
    <section id={id} data-field={field} className={bg ? "has-bg relative overflow-hidden" : undefined}>
      {bg && <SectionBg src={bg} />}
      <div className="wrap relative z-10 grid gap-10 py-28 md:grid-cols-12 md:gap-6 md:py-40">
        <div className="md:col-span-5">
          <h2 className="slide t-head">{heading}</h2>
          {pics.length > 0 && (
            // A small fanned stack of photos; each opens like a blind as it arrives.
            <div className={`collage collage--${Math.min(pics.length, 3)} mt-12`} data-parallax="0.08">
              {pics.slice(0, 3).map((src, i) => (
                <img key={src} src={src} alt="" width="480" height="600" loading="lazy" className={`collage-${i} wipe`} style={{ "--i": i + 1 }} />
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-7">
          <p className="rise max-w-[30ch] t-lead font-medium leading-[1.2] tracking-[-0.015em]" style={{ "--i": 1 }}>
            {statement}
          </p>
          {children && <div className="rise mt-10 grid max-w-[62ch] gap-5" style={{ "--i": 2 }}>{children}</div>}
        </div>
      </div>
    </section>
  );
}

/** Statement fields: one claim per flat colour field, mirrored alternately.
 *  The big phrase glides in, then grows as the field scrolls through. */
export function Statements({ items }) {
  return items.map((s, i) => (
    <section key={s.title} id={s.id} data-field={s.field} data-scrub className={`statement${i % 2 ? " mirror" : ""}${s.bg && s.field !== "red" ? " has-bg relative overflow-hidden" : ""}`}>
      {s.bg && s.field !== "red" && <SectionBg src={s.bg} />}
      <div className="wrap relative z-10">
        <div className="st-p rise">
          <p className="t-lead leading-snug">{s.text}</p>
          {s.link && (
            <a className="link mt-5 inline-block font-semibold" href={s.link.to}>{s.link.label} →</a>
          )}
        </div>
        {s.img && (
          <figure className="st-img wipe" data-parallax="0.05">
            <img src={s.img} alt={s.alt || ""} width="800" height="600" loading="lazy" />
          </figure>
        )}
        <h2 className="st-h slide" style={{ "--i": 1 }}>
          <span className="scrub-scale inline-block">{s.title}</span>
        </h2>
      </div>
    </section>
  ));
}

/** The close: the page's colours inverted, the idea said again. */
export function Cta({ lines, sentence, action = { label: "Contact NIBG", to: "#contact" }, bg, bgPos = "50% 50%" }) {
  return (
    <section data-field="ink" data-scrub className={`relative flex min-h-[80svh] overflow-hidden md:min-h-[90svh]${bg ? " cta--photo" : ""}`}>
      {bg && <SectionBg src={bg} pos={bgPos} speed={-0.12} />}
      <div className="wrap relative z-10 flex flex-col justify-between gap-16 py-24">
        <h2 className="slide t-hero leading-[.9] tracking-[-0.04em]">
          <span className="scrub-x block">{lines[0]}</span>
          <span className="block">{lines[1]}</span>
        </h2>
        <div className="grid items-end gap-8 md:grid-cols-12">
          <p className="rise soft t-lead leading-snug md:col-span-6" style={{ "--i": 1 }}>{sentence}</p>
          <div className="rise md:col-span-4 md:col-start-9 md:justify-self-end" style={{ "--i": 2 }}>
            {action.scroll ? (
              <button type="button" className="btn w-full md:w-auto" onClick={() => scrollToId(action.scroll)}>{action.label} <span className="arr" aria-hidden="true">→</span></button>
            ) : (
              <a className="btn w-full md:w-auto" href={action.to}>{action.label} <span className="arr" aria-hidden="true">→</span></a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Home: a guide to the whole site, one soft tile per page. */
export function Overview() {
  return (
    <section id="overview" data-field="paper">
      <div className="wrap py-28 md:py-36">
        <div className="grid gap-6 md:grid-cols-12">
          <h2 className="slide t-head md:col-span-7">Everything on this site</h2>
          <p className="rise soft max-w-[40ch] md:col-span-5 md:self-end" style={{ "--i": 1 }}>
            A quick guide to what you will find, page by page.
          </p>
        </div>
        <ul className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {OVERVIEW.map((o, i) => (
            <li key={o.id} className="rise" style={{ "--i": (i % 3) + 1 }}>
              <a href={`#${o.id}`} className="neu-card group flex h-full flex-col gap-5 p-4 pb-7 no-underline">
                <span className="wipe block aspect-[16/10] overflow-hidden rounded-[var(--r-sm)]" style={{ "--i": (i % 3) + 1 }}>
                  <img src={o.img} alt="" width="480" height="300" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </span>
                <span className="px-3">
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="t-lead font-semibold tracking-[-0.02em]">{o.label}</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-1.5" aria-hidden="true">→</span>
                  </span>
                  <span className="mt-2 block">{o.summary}</span>
                  <span className="mt-4 grid gap-1.5 t-body">
                    {o.points.map((pt) => <span key={pt} className="block">· {pt}</span>)}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Keep exploring: the other pages, each with its own picture. */
export function Explore({ current, count = 3, field = "mist" }) {
  const others = [...PAGES, { id: "contact", label: "Contact", line: "Write to the NIBG team.", img: IMG.contact }]
    .filter((p) => p.id !== current)
    .slice(0, count);
  return (
    <section data-field={field}>
      <div className="wrap grid gap-12 py-28 md:py-36 lg:grid-cols-12">
        <h2 className="slide t-head lg:col-span-4">Keep exploring</h2>
        <ul className="grid gap-5 lg:col-span-8">
          {others.map((p, i) => (
            <li key={p.id} className="rise" style={{ "--i": i + 1 }}>
              <a href={`#${p.id}`} className="go-row neu-card grid grid-cols-[96px_1fr_auto] items-center gap-5 p-3 pr-6 no-underline sm:grid-cols-[180px_1fr_auto] sm:gap-8">
                <span className="block aspect-[16/10] overflow-hidden rounded-[var(--r-sm)]">
                  <img src={p.img} alt="" width="360" height="225" loading="lazy" className="h-full w-full object-cover" />
                </span>
                <span>
                  <span className="block t-lead font-semibold leading-tight tracking-[-0.02em]">{p.label}</span>
                  <span className="soft mt-1 block t-body">{p.line}</span>
                </span>
                <span className="go-arr text-2xl" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
