import { Hero, Intro, Statements, Cta, Explore, SectionBg } from "../components/Blocks.jsx";
import { IMG, PRINCIPLES, VALUES, GOVERNANCE, GOV_PRINCIPLES } from "../content.js";

export default function About() {
  return (
    <>
      <Hero
        field="red"
        lines={["Built on", "trust."]}
        sentence="A bilateral business platform established to strengthen economic relations between Nigeria and the Republic of Indonesia."
        action={{ label: "Our five principles", scroll: "principles" }}
        img={IMG.about}
        alt="Nigerian and Indonesian professionals shaking hands in a bright office"
        bg={IMG.energy}
      />

      <Intro
        heading="Who we are"
        statement="Both countries have real economic potential, diverse resources and growing consumer markets. We connect the people, capital and expertise that turn this into commercial outcomes."
        chips={[IMG.lagos, IMG.jakarta, IMG.services]}
      >
        <p>
          NIBG promotes trade, investment, entrepreneurship and strategic private-sector partnerships. Working with
          businesses, investors, industry associations, government institutions and other stakeholders, we aim to
          create a platform where ideas become bankable projects, commercial partnerships, jobs and long-term
          economic value.
        </p>
        <p>
          Our commitment to trust, transparency, mutual understanding and sustainability helps stakeholders move
          beyond discussion towards meaningful and sustainable business relationships.
        </p>
      </Intro>

      {/* The five principles spell TRUST; the letters carry that, not a count. */}
      <section id="principles" data-field="green" className="has-bg relative overflow-hidden">
        <SectionBg src={IMG.textile} />
        <div className="wrap relative z-10 py-28 md:py-36">
          <h2 className="rise t-head">Five principles that spell TRUST</h2>
          <ul className="mt-12 grid gap-1">
            {PRINCIPLES.map((p, i) => (
              <li key={p.name} className="band rise grid grid-cols-[3.5rem_1fr] items-baseline gap-x-6 gap-y-2 px-5 py-6 md:grid-cols-[6rem_18rem_1fr] md:px-8" style={{ "--i": i + 1 }}>
                <span aria-hidden="true" className="t-lead font-semibold leading-none">{p.letter}</span>
                <h3 className="t-lead tracking-[-0.01em]">{p.name}</h3>
                <p className="soft col-start-2 md:col-start-3">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Statements
        items={[
          { field: "paper", img: IMG.energy, alt: "Energy infrastructure at sunrise", title: "Our mission", text: "To facilitate meaningful trade, investment and strategic business partnerships between Nigeria and Indonesia by connecting businesses, mobilising resources, promoting market access, and fostering transparent, sustainable and mutually beneficial economic cooperation." },
          { field: "deep", bg: IMG.logistics, img: IMG.home, alt: "A container ship beside port cranes", title: "Our vision", text: "To become a leading and trusted platform for Nigeria–Indonesia business cooperation, recognised for connecting markets, unlocking investment opportunities, strengthening bilateral relations and driving shared prosperity across both countries." },
        ]}
      />

      <section data-field="mist">
        <div className="wrap py-28 md:py-36">
          <h2 className="rise t-head">The values we work by</h2>
          <dl className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <div key={v.name} className="rise" style={{ "--i": (i % 3) + 1 }}>
                <dt className="t-lead font-semibold tracking-[-0.02em]">{v.name}</dt>
                <dd className="mt-2 max-w-[32ch]">{v.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* TODO: the profile calls this a proposed model. Confirm it and add
          officeholder names, titles and portraits once approved. */}
      <section id="governance" data-field="paper">
        <div className="wrap py-28 md:py-36">
          <div className="grid gap-6 md:grid-cols-12">
            <h2 className="rise t-head md:col-span-7">How NIBG is governed</h2>
            <p className="rise soft max-w-[44ch] md:col-span-5 md:self-end" style={{ "--i": 1 }}>
              A proposed structure. Officeholders will be named here once confirmed.
            </p>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {GOVERNANCE.map((g, i) => (
              <li key={g.name} data-field={g.field} className="lift rise flex min-h-64 flex-col justify-between gap-8 p-7" style={{ "--i": i + 1 }}>
                <h3 className="t-lead leading-tight tracking-[-0.015em]">{g.name}</h3>
                <p className="soft t-body">{g.role}</p>
              </li>
            ))}
          </ol>

          <h3 className="rise mt-24 t-lead tracking-[-0.02em]">Governance principles</h3>
          <dl className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {GOV_PRINCIPLES.map((g, i) => (
              <div key={g.name} className="rise" style={{ "--i": (i % 3) + 1 }}>
                <dt className="t-lead font-semibold">{g.name}</dt>
                <dd className="soft mt-1">{g.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Explore current="about" />
      <Cta lines={["Build stronger", "connections."]} sentence="Join the platform bringing Nigerian and Indonesian businesses, investors and institutions closer together." action={{ label: "Explore membership", to: "#membership" }} bg={IMG.ctaAbout} />
    </>
  );
}
