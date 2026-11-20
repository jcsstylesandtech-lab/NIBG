import { Hero, Intro, Cta, Explore } from "../components/Blocks.jsx";
import { BusinessClock } from "../components/BusinessClock.jsx";
import { Gallery } from "../components/Gallery.jsx";
import { IMG, EVENT_FORMATS } from "../content.js";

export default function Events() {
  return (
    <>
      <Hero
        field="green"
        lines={["In the", "same room."]}
        sentence="Trade missions, forums and roundtables that bring businesses, investors and decision-makers from both countries together."
        action={{ label: "Ask about upcoming events", to: "#contact" }}
        img={IMG.events}
        alt="A business panel discussion on a stage in front of a seated audience"
        bg={IMG.ctaMembership}
      />

      <section id="formats" data-field="paper">
        <div className="wrap py-28 md:py-36">
          <div className="grid gap-6 md:grid-cols-12">
            <h2 className="rise t-head md:col-span-7">What we organise</h2>
            <p className="rise soft max-w-[40ch] md:col-span-5 md:self-end" style={{ "--i": 1 }}>
              Dates and event details will be announced here as they are confirmed.
            </p>
          </div>
          <ul className="mt-12 grid gap-1">
            {EVENT_FORMATS.map((f, i) => (
              <li key={f.name} className="band rise grid gap-x-8 gap-y-2 px-6 py-7 md:grid-cols-[12rem_22rem_1fr] md:items-baseline md:px-8" style={{ "--i": i + 1 }}>
                <p className="soft t-body font-medium">{f.kind}</p>
                <h3 className="t-lead tracking-[-0.015em]">{f.name}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Gallery />

      <Intro
        field="deep"
        bg={IMG.ctaHome}
        heading="Built for delegations"
        statement="Every engagement is planned around both markets: their business culture, their regulations and their time zones."
        chips={[IMG.jakarta, IMG.lagos, IMG.home]}
      />

      <BusinessClock id="event-clock" />

      <Explore current="events" />
      <Cta lines={["See you in", "the room."]} sentence="Ask the NIBG team about upcoming trade missions, forums and roundtables." action={{ label: "Ask about events", to: "#contact" }} bg={IMG.ctaEvents} />
    </>
  );
}
