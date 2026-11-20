// All site copy, taken from the NIBG Company Profile. Edit words here;
// the pages only arrange them.

export const ORG = {
  name: "Nigerian Indonesian Business Group",
  short: "NIBG",
  email: "info@nigeriaindonesiabusinessgroup.com",
  phone: "+234 803 640 4602",
  phoneHref: "tel:+2348036404602",
  address: ["12 Dennis Osadebe Street", "Aso Villa, Abuja", "Nigeria"],
  tagline: "Strengthening Bilateral Prosperity",
};

// Google Maps for the office: an embed for the page, a link to open the full map.
const MAP_QUERY = "12 Dennis Osadebe Street, Aso Villa, Abuja, Nigeria";
export const MAP = {
  query: MAP_QUERY,
  embed: `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=16&output=embed`,
  link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`,
};

const img = (name) => `${import.meta.env.BASE_URL}img/${name}`;
export const IMG = {
  logo: img("logo.jpg"),
  mark: img("mark.png"),          // the circular mark alone, transparent
  lagos: img("lagos.jpg"),
  jakarta: img("jakarta.jpg"),
  agro: img("agro.jpg"),
  energy: img("energy.jpg"),
  textile: img("textile.jpg"),
  logistics: img("logistics.jpg"),
  // Background photos for each page's closing section.
  ctaHome: img("cta-home.jpg"),
  ctaAbout: img("cta-about.jpg"),
  ctaServices: img("cta-services.jpg"),
  ctaMembership: img("cta-membership.jpg"),
  ctaEvents: img("cta-events.jpg"),
  ctaImpact: img("cta-impact.jpg"),
  ctaContact: img("cta-contact.jpg"),
  home: img("hero-home.jpg"),
  about: img("hero-about.jpg"),
  services: img("hero-services.jpg"),
  membership: img("hero-membership.jpg"),
  events: img("hero-events.jpg"),
  impact: img("hero-impact.jpg"),
  contact: img("hero-contact.jpg"),
};

// Pages, in navigation order. "home" is reached through the wordmark.
export const PAGES = [
  { id: "about", label: "About", line: "Who we are, our mission, values and governance.", img: IMG.about },
  { id: "services", label: "Services", line: "Trade, investment, matchmaking and advisory support.", img: IMG.services },
  { id: "membership", label: "Membership", line: "Join the platform for Nigeria–Indonesia business.", img: IMG.membership },
  { id: "events", label: "Events", line: "Trade missions, forums and investment roundtables.", img: IMG.events },
  { id: "impact", label: "Impact", line: "How introductions become bankable projects.", img: IMG.impact },
];

// The home page's guide to the whole site, page by page.
export const OVERVIEW = [
  { id: "about", label: "About", img: IMG.about, summary: "Who we are and what we stand for.",
    points: ["The five principles that spell TRUST", "Our mission, vision and six core values", "How NIBG is governed"] },
  { id: "services", label: "Services", img: IMG.services, summary: "Seven ways we help business move between the two countries.",
    points: ["Trade promotion and investment facilitation", "Matchmaking, joint ventures and trade missions", "Ten priority sectors"] },
  { id: "membership", label: "Membership", img: IMG.membership, summary: "Join the platform for Nigeria–Indonesia business.",
    points: ["Who membership is for", "Opportunities, insight and a trusted network", "Register your interest"] },
  { id: "events", label: "Events", img: IMG.events, summary: "Bringing both markets into the same room.",
    points: ["Business-to-business meetings", "Trade missions and business forums", "Investment roundtables and exhibitions"] },
  { id: "impact", label: "Impact", img: IMG.impact, summary: "How introductions become lasting value.",
    points: ["Four focus areas", "The pathway from connection to outcomes", "What we will report"] },
  { id: "contact", label: "Contact", img: IMG.contact, summary: "Start a conversation with the NIBG team.",
    points: ["Send us a message", "The best time to call Lagos and Jakarta", "Membership, events and partnership enquiries"] },
];

export const PRINCIPLES = [
  { letter: "T", name: "Timeliness", text: "Efficient communication, responsive engagements and timely execution of business initiatives." },
  { letter: "R", name: "Resources", text: "Connecting businesses with investment opportunities, expertise, market access and strategic partners." },
  { letter: "U", name: "Understanding", text: "A deeper understanding of each country’s business environment, culture, regulations and consumer behaviour." },
  { letter: "S", name: "Sustainability and service", text: "Enduring partnerships that create economic value and deliver measurable benefits." },
  { letter: "T", name: "Transparency", text: "Integrity, accountability, responsible business conduct and confidence among partners." },
];

export const VALUES = [
  { name: "Integrity", text: "Ethical standards and honesty in every engagement." },
  { name: "Trust", text: "Dependable relationships between businesses and investors." },
  { name: "Collaboration", text: "Stakeholders brought together to achieve common goals." },
  { name: "Innovation", text: "New ideas, technology and commercially viable solutions." },
  { name: "Sustainability", text: "Partnerships with long-term economic and social benefits." },
  { name: "Excellence", text: "High standards of professionalism and service delivery." },
];

// The company profile calls this a proposed structure.
export const GOVERNANCE = [
  { name: "Board of Directors / Governing Council", role: "Strategic oversight, policy direction and accountability", field: "red" },
  { name: "President / Chairman", role: "Leadership, representation and strategic partnerships", field: "green" },
  { name: "Executive Secretariat / Management", role: "Administration, coordination and implementation", field: "deep" },
  { name: "Functional teams", role: "Trade and Investment, International Relations, Business Development, and Finance, Compliance and Administration", field: "ink" },
];

export const GOV_PRINCIPLES = [
  { name: "Accountability", text: "Clear reporting lines and defined responsibilities." },
  { name: "Transparency", text: "Open communication on activities and decisions." },
  { name: "Financial integrity", text: "Proper records, controls and periodic reviews." },
  { name: "Compliance", text: "Adherence to applicable laws, regulations and registration requirements." },
  { name: "Conflicts of interest", text: "Appropriate disclosure and management of potential conflicts." },
  { name: "Performance monitoring", text: "Regular assessment of projects, partnerships and objectives." },
];

export const SERVICES = [
  {
    id: "trade", name: "Trade promotion and market access",
    text: "Supporting Nigerian and Indonesian businesses to grow trade between the two markets.",
    parts: ["Identifying export and import opportunities", "Understanding local markets", "Connecting with buyers, suppliers, distributors and commercial partners"],
  },
  {
    id: "investment", name: "Investment facilitation",
    text: "Connecting investors and project promoters in both countries.",
    parts: ["Potential investment opportunities", "Joint ventures and strategic partnerships", "Commercially viable projects in Nigeria and Indonesia"],
  },
  {
    id: "matchmaking", name: "Business matchmaking and networking",
    text: "Developing productive commercial relationships.",
    parts: ["Business-to-business meetings", "Investor introductions", "Networking events and trade missions", "Strategic engagements"],
  },
  {
    id: "ventures", name: "Joint ventures and strategic partnerships",
    text: "Facilitating discussions between companies that want to build together.",
    parts: ["Co-investment", "Technology partnerships", "Local representation", "Manufacturing, distribution and business expansion"],
  },
  {
    id: "missions", name: "Trade missions, conferences and forums",
    text: "Bringing businesses and decision-makers together.",
    parts: ["Delegations", "Investment roundtables", "Exhibitions and conferences", "Sector-specific engagements"],
  },
  {
    id: "intelligence", name: "Market intelligence and advisory support",
    text: "Helping businesses enter with their eyes open.",
    parts: ["Market opportunities and commercial conditions", "Industry trends", "Potential entry strategies", "Introductions to qualified legal, regulatory and professional advisers where required"],
  },
  {
    id: "exchange", name: "Knowledge, technology and cultural exchange",
    text: "Strengthening cooperation between the two countries beyond the deal.",
    parts: ["Knowledge transfer", "Institutional partnerships", "Professional development and educational exchange", "Cross-cultural understanding"],
  },
];

// The profile notes these should match NIBG's formally approved activities.
export const SECTORS = [
  "Agriculture and agro-processing",
  "Oil, gas and energy",
  "Manufacturing and industrial development",
  "Real estate and infrastructure",
  "Healthcare and pharmaceuticals",
  "Mining and solid minerals",
  "Technology and digital innovation",
  "Logistics, shipping and transportation",
  "Education and skills development",
  "Tourism, hospitality and cultural exchange",
];

export const EVENT_FORMATS = [
  { kind: "Networking", name: "Business-to-business meetings", text: "Matchmaking sessions and investor introductions that start productive commercial conversations." },
  { kind: "Delegations", name: "Trade missions", text: "Coordinated delegations that let businesses explore each other’s markets first-hand." },
  { kind: "Dialogue", name: "Conferences and business forums", text: "Sector-specific discussions on the opportunities shaping bilateral cooperation." },
  { kind: "Investment", name: "Roundtables and exhibitions", text: "Investment roundtables and exhibitions that put projects in front of decision-makers." },
];
