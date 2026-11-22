import { useRef, useState } from "react";
import { Hero, Cta, Explore, SectionBg } from "../components/Blocks.jsx";
import { IMG, SERVICES, SECTORS } from "../content.js";

function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const s = SERVICES[active];

  const onKey = (e) => {
    const n = SERVICES.length;
    const next = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    let i = null;
    if (next) i = (active + next + n) % n;
    if (e.key === "Home") i = 0;
    if (e.key === "End") i = n - 1;
    if (i === null) return;
    e.preventDefault();
    setActive(i);
    tabs.current[i]?.focus();
  };

  return (
    <section id="services-list" data-field="paper">
      <div className="wrap py-28 md:py-36">
        <h2 className="rise t-head">Seven services, one platform</h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div role="tablist" data-lenis-prevent aria-label="Services" aria-orientation="vertical" className="rise flex gap-3 p-2 overflow-x-auto pb-2 lg:col-span-5 lg:flex-col lg:overflow-visible lg:pb-0" style={{ "--i": 1 }} onKeyDown={onKey}>
            {SERVICES.map((sv, i) => {
              const on = i === active;
              return (
                <button
                  key={sv.id}
                  ref={(el) => (tabs.current[i] = el)}
                  role="tab"
                  id={`tab-${sv.id}`}
                  aria-selected={on}
                  aria-controls="service-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`min-w-56 shrink-0 rounded-[var(--r-sm)] px-5 py-4 text-left t-body leading-snug transition-[box-shadow,transform,color] duration-200 lg:min-w-0 ${on ? "neu-in font-semibold text-green" : "neu-btn !rounded-[var(--r-sm)] font-medium"}`}
                >
                  {sv.name}
                </button>
              );
            })}
          </div>

          <div id="service-panel" role="tabpanel" aria-labelledby={`tab-${s.id}`} data-field="green" className="lift rise min-w-0 p-8 md:p-12 lg:col-span-7" style={{ "--i": 2 }}>
            <h3 key={s.id} className="t-lead leading-[1.02] tracking-[-0.03em]">{s.name}</h3>
            <p className="soft mt-4 max-w-[44ch] t-lead leading-snug">{s.text}</p>
            <ul className="mt-10 grid gap-1">
              {s.parts.map((p) => (
                <li key={p} className="band px-5 py-4 t-body font-medium">{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <>
      <Hero
        field="green"
        lines={["Open doors.", "Close deals."]}
        sentence="A platform for businesses, investors and institutions to identify opportunities, establish partnerships and expand into new markets."
        action={{ label: "See what we offer", scroll: "services-list" }}
        img={IMG.services}
        alt="African and Asian business partners reviewing documents at a boardroom table"
        bg={IMG.jakarta}
      />

      <ServiceExplorer />

      {/* TODO: the profile notes these should match NIBG's approved activities. */}
      <section id="sectors" data-field="red">
        <div className="wrap grid gap-12 py-28 md:py-36 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="rise t-head">Ten priority sectors</h2>
            <p className="rise soft mt-6 max-w-[34ch]" style={{ "--i": 1 }}>
              Where both economies have strong potential and NIBG pursues partnerships.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-3 lg:grid-cols-2">
              {[[IMG.agro, "Cocoa and palm fruit being sorted"], [IMG.energy, "Energy infrastructure at sunrise"], [IMG.logistics, "Containers at a logistics yard"], [IMG.textile, "Batik and West African textiles"]].map(([src, alt], i) => (
                <img key={src} src={src} alt={alt} width="400" height="400" loading="lazy" className={`wipe aspect-square w-full rounded-[var(--r)] object-cover lift${i === 3 ? " lg:block hidden" : ""}`} style={{ "--i": i + 1 }} />
              ))}
            </div>
          </div>
          <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:col-span-8">
            {SECTORS.map((x, i) => (
              <li key={x} className="rise t-lead font-medium leading-tight tracking-[-0.015em]" style={{ "--i": (i % 2) + 1 }}>
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Explore current="services" />
      <Cta lines={["Have an opportunity", "in mind?"]} sentence="Tell us about your business, project or investment interest and the NIBG team will follow up." bg={IMG.ctaServices} />
    </>
  );
}
