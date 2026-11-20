import { Hero, Overview, Statements, Cta } from "../components/Blocks.jsx";
import { BusinessClock } from "../components/BusinessClock.jsx";
import { IMG } from "../content.js";

export default function Home() {
  return (
    <>
      <Hero
        field="green"
        lines={["Two markets.", "One alliance."]}
        sentence="The Nigerian Indonesian Business Group connects businesses, investors and institutions in both countries through trade, investment and strategic partnerships."
        action={{ label: "See what’s on the site", scroll: "overview" }}
        img={IMG.home}
        alt="A container ship moored beside gantry cranes at a port in golden light"
        bg={IMG.ctaImpact}
      />

      <Overview />

      <Statements
        items={[
          { field: "red", img: IMG.logistics, alt: "Containers and trucks at a busy logistics yard", title: "Trade, both ways", text: "Find export and import opportunities, understand local markets, and meet buyers, suppliers and distributors in the other country.", link: { label: "Our services", to: "#services" } },
          { field: "deep", bg: IMG.lagos, img: IMG.jakarta, alt: "The Jakarta business district at golden hour", title: "Capital that crosses", text: "We connect investors and project promoters with joint ventures and commercially viable projects in Nigeria and Indonesia.", link: { label: "Our impact", to: "#impact" } },
          { field: "green", bg: IMG.membership, img: IMG.events, alt: "A business panel speaking to a seated audience", title: "The right room", text: "Business-to-business meetings, investor introductions and trade missions that turn interest into productive relationships.", link: { label: "Upcoming events", to: "#events" } },
        ]}
      />

      <BusinessClock />

      <Cta
        lines={["Let’s build it", "together."]}
        sentence="Interested in trade, investment or partnership between Nigeria and Indonesia? The NIBG team will follow up." bg={IMG.ctaHome} />
    </>
  );
}
