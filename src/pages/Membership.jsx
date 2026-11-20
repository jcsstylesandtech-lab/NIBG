import { Hero, Intro, Statements, Cta, Explore } from "../components/Blocks.jsx";
import { IMG } from "../content.js";

export default function Membership() {
  return (
    <>
      <Hero
        field="red"
        lines={["Join the", "alliance."]}
        sentence="For businesses, investors, project promoters, industry associations and institutions working between Nigeria and Indonesia."
        action={{ label: "Enquire about membership", to: "#contact" }}
        img={IMG.membership}
        alt="Entrepreneurs talking over coffee in a members' lounge with patterned cushions"
      />

      {/* TODO: add confirmed membership categories, fees and application steps. */}
      <Intro
        heading="Who it’s for"
        statement="Anyone building trade or investment between Nigeria and Indonesia, from a first export to a joint venture."
        chips={[IMG.about, IMG.textile, IMG.events]}
      >
        <p>
          Membership categories and how to apply will be published soon. In the meantime, contact us to register
          your interest and the NIBG team will follow up.
        </p>
        <p><a className="link font-semibold" href="#contact">Register your interest →</a></p>
      </Intro>

      <Statements
        items={[
          { field: "green", bg: IMG.energy, img: IMG.agro, alt: "Workers sorting cocoa pods on a farm cooperative", title: "Credible opportunities", text: "Access to trade and investment opportunities in both markets, with introductions to buyers, suppliers, distributors, investors and partners." },
          { field: "ink", bg: IMG.ctaHome, img: IMG.services, alt: "Partners reviewing documents at a boardroom table", title: "Insight before entry", text: "Market intelligence on commercial conditions, industry trends and entry strategies, and links to qualified legal, regulatory and professional advisers." },
          { field: "mist", img: IMG.lagos, alt: "The Lagos skyline at dusk across the lagoon", title: "A trusted network", text: "Trade missions, forums, roundtables and networking events, with relationships built on integrity, transparency and mutual benefit." },
        ]}
      />

      <Explore current="membership" field="paper" />
      <Cta lines={["Let’s talk", "membership."]} sentence="Tell us about your organisation and the NIBG team will follow up." bg={IMG.ctaMembership} bgPos="40% 50%" />
    </>
  );
}
