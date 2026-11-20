import { Hero } from "../components/Blocks.jsx";
import { openConsentSettings } from "../components/Consent.jsx";
import { PolicyLayout, Part } from "../components/PolicyLayout.jsx";
import { IMG, ORG } from "../content.js";

// Plain-language privacy policy describing what this website actually does.
// TODO: have NIBG's legal adviser review it before launch, and confirm how
// long contact-form messages are kept.
const UPDATED = "20 November 2026";

const SECTIONS = [
  { id: "who", title: "Who we are" },
  { id: "collect", title: "What we collect" },
  { id: "use", title: "How we use it" },
  { id: "storage", title: "Where it is kept" },
  { id: "cookies", title: "Cookies and browser storage" },
  { id: "third-parties", title: "Other services on this site" },
  { id: "rights", title: "Your rights" },
  { id: "changes", title: "Changes to this policy" },
];

export default function Privacy() {
  return (
    <>
      <Hero
        field="deep"
        lines={["Your privacy,", "plainly put."]}
        sentence="What this website collects, why, and the choices you have. We collect very little."
        action={{ label: "Read the policy", scroll: "policy" }}
        img={IMG.lagos}
        alt="The Lagos skyline at dusk across the lagoon"
        bg={IMG.jakarta}
      />

      <PolicyLayout label="Privacy policy" updated={UPDATED} sections={SECTIONS}>
            <Part id="who" title="Who we are">
              <p>
                This website belongs to the {ORG.name} ({ORG.short}), a bilateral business platform connecting
                businesses, investors and institutions in Nigeria and Indonesia. NIBG is responsible for the
                personal information described here.
              </p>
              <p>
                Office: {ORG.address.join(", ")}. Email: <a className="link" href={`mailto:${ORG.email}`}>{ORG.email}</a>.
                Phone: <a className="link" href={ORG.phoneHref}>{ORG.phone}</a>.
              </p>
            </Part>

            <Part id="collect" title="What we collect">
              <p>We only collect what you choose to send us through the contact form:</p>
              <ul className="grid gap-2 pl-5 [list-style:disc]">
                <li>your full name</li>
                <li>your email address</li>
                <li>your organisation, if you give it</li>
                <li>your message</li>
                <li>the date and time you sent it</li>
              </ul>
              <p>
                The website has no user accounts, no newsletter sign-up, no advertising and no analytics or
                visitor-tracking tools.
              </p>
            </Part>

            <Part id="use" title="How we use it">
              <p>
                We use your details to reply to your message and to follow up on the enquiry you made, for
                example about membership, events, trade or investment.
              </p>
              <p>We do not sell your information, and we do not use it for advertising.</p>
            </Part>

            <Part id="storage" title="Where it is kept">
              <p>
                Messages sent through the contact form are stored by the platform that hosts this website, so
                the NIBG team can read and answer them. We keep messages only as long as we need them to deal
                with your enquiry and any relationship that follows from it.
              </p>
            </Part>

            <Part id="cookies" title="Cookies and browser storage">
              <p>
                This website does not set its own tracking cookies. It keeps one small entry in your browser’s
                local storage to remember your cookie choice, so we do not ask you again on every visit.
              </p>
              <p>
                The office map on the contact page is provided by Google Maps, which sets Google’s own cookies.
                The map only loads if you choose “Accept all” (or press “Show map”). If you choose “Essential
                only”, the map stays off and you can open the location in Google Maps instead.
              </p>
              <p>
                You can change your choice at any time:{" "}
                <button type="button" className="link font-semibold" onClick={openConsentSettings}>open cookie settings</button>.
              </p>
            </Part>

            <Part id="third-parties" title="Other services on this site">
              <ul className="grid gap-2 pl-5 [list-style:disc]">
                <li>
                  <strong className="font-semibold">Google Fonts</strong> supplies the typeface. Your browser
                  downloads it from Google, which receives your IP address as part of that request.
                </li>
                <li>
                  <strong className="font-semibold">Google Maps</strong> shows the office map, only after you
                  accept all cookies. Google’s privacy policy applies to it.
                </li>
                <li>
                  <strong className="font-semibold">Our hosting platform</strong> runs the website and stores
                  contact-form messages for us.
                </li>
              </ul>
            </Part>

            <Part id="rights" title="Your rights">
              <p>
                Under the Nigeria Data Protection Act 2023 and other laws that may apply to you, you can ask us
                to tell you what information we hold about you, correct it, delete it, or stop using it. You can
                also withdraw your cookie consent at any time.
              </p>
              <p>
                To make a request, email <a className="link" href={`mailto:${ORG.email}`}>{ORG.email}</a> or
                call <a className="link" href={ORG.phoneHref}>{ORG.phone}</a>. If you are not satisfied with our
                answer, you can complain to the Nigeria Data Protection Commission.
              </p>
            </Part>

            <Part id="changes" title="Changes to this policy">
              <p>
                If we change how the website handles information, we will update this page and the date at the
                top of the contents. This policy was last updated on {UPDATED}.
              </p>
            </Part>
      </PolicyLayout>
    </>
  );
}
