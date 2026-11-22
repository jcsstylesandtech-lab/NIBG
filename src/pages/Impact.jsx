import { Hero, Intro, Statements, Cta, Explore } from "../components/Blocks.jsx";
import { IMG } from "../content.js";

const PATHWAY = [
  { name: "Connection", text: "Bring the relevant people and organisations from both countries into the same conversation." },
  { name: "Collaboration", text: "Explore shared priorities, exchange knowledge and identify ways to work together." },
  { name: "Outcomes", text: "Track bankable projects, partnerships and jobs as relationships develop." },
];

const MEASURES = [
  "Business connections supported",
  "Partnership opportunities created",
  "Members and stakeholders engaged",
  "Knowledge-exchange activities",
];

export default function Impact() {
  return (
    <>
      <Hero
        field="green"
        lines={["From talk", "to trade."]}
        sentence="Turning introductions into bankable projects, commercial partnerships, jobs and long-term economic value."
        action={{ label: "See the pathway", scroll: "pathway" }}
        img={IMG.impact}
        alt="Young entrepreneurs working together around laptops in a sunlit hub"
        bg={IMG.energy}
      />

      <Intro
        heading="Progress starts with connection"
        statement="We bring businesses, investors, associations and institutions together so that shared interest becomes practical commercial results."
        chips={[IMG.agro, IMG.lagos, IMG.jakarta]}
      />

      <Statements
        items={[
          { field: "red", img: IMG.logistics, alt: "Containers and trucks at a logistics yard", title: "Trade and investment", text: "Helping businesses explore each other’s markets, meet counterparts and begin informed conversations about opportunity." },
          { field: "deep", bg: IMG.ctaServices, img: IMG.services, alt: "Young partners reviewing plans together", title: "Founders and youth", text: "Room for emerging founders and young professionals to exchange ideas, build networks and discover new possibilities." },
          { field: "mist", img: IMG.events, alt: "A panel discussion at a business forum", title: "Knowledge exchange", text: "Connecting perspectives and practical expertise through dialogue, learning and cross-border insight." },
          { field: "green", bg: IMG.membership, img: IMG.textile, alt: "Batik and West African textiles side by side", title: "Cultural relations", text: "The understanding and trust that help relationships between Nigeria and Indonesia grow beyond a single meeting." },
        ]}
      />

      <section id="pathway" data-field="paper">
        <div className="wrap py-28 md:py-36">
          <h2 className="rise t-head">From introduction to lasting value</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {PATHWAY.map((p, i) => (
              <li key={p.name} data-field={["green", "red", "ink"][i]} className="lift rise flex min-h-72 flex-col justify-between gap-10 p-8" style={{ "--i": i + 1 }}>
                <h3 className="t-lead tracking-[-0.03em]">
                  {p.name}{i < PATHWAY.length - 1 && <span aria-hidden="true"> →</span>}
                </h3>
                <p className="soft">{p.text}</p>
              </li>
            ))}
          </ol>

          {/* TODO: publish verified figures for each measure when available. */}
          <div className="mt-24 grid gap-8 md:grid-cols-12">
            <h3 className="rise t-lead tracking-[-0.02em] md:col-span-5">What we will report</h3>
            <div className="md:col-span-7">
              <ul className="grid gap-1">
                {MEASURES.map((m, i) => (
                  <li key={m} className="band rise px-5 py-4 t-body font-medium" style={{ "--i": i + 1 }}>{m}</li>
                ))}
              </ul>
              <p className="soft rise mt-5">Verified figures will be published as projects are reported.</p>
            </div>
          </div>
        </div>
      </section>

      <Explore current="impact" />
      <Cta lines={["Let’s build what", "comes next."]} sentence="Interested in connecting across Nigeria and Indonesia? Start a conversation with NIBG." bg={IMG.ctaImpact} />
    </>
  );
}
