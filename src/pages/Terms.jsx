import { Hero } from "../components/Blocks.jsx";
import { PolicyLayout, Part } from "../components/PolicyLayout.jsx";
import { IMG, ORG } from "../content.js";

// Website terms and conditions, in plain language.
// TODO: have NIBG's legal adviser review these before launch.
const UPDATED = "20 November 2026";

const SECTIONS = [
  { id: "about-terms", title: "About these terms" },
  { id: "using", title: "Using this website" },
  { id: "information", title: "Information on this site" },
  { id: "engagements", title: "Membership, events and services" },
  { id: "messages", title: "Messages you send us" },
  { id: "ip", title: "Our name, logo and content" },
  { id: "links", title: "Links to other websites" },
  { id: "liability", title: "Our responsibility to you" },
  { id: "changes-terms", title: "Changes" },
  { id: "law", title: "Governing law" },
  { id: "contact-terms", title: "Contact us" },
];

export default function Terms() {
  return (
    <>
      <Hero
        field="green"
        lines={["Clear terms,", "fair use."]}
        sentence="The terms that apply when you use the Nigerian Indonesian Business Group website."
        action={{ label: "Read the terms", scroll: "terms" }}
        img={IMG.jakarta}
        alt="The Jakarta business district at golden hour"
        bg={IMG.lagos}
      />

      <PolicyLayout id="terms" label="Terms and conditions" updated={UPDATED} sections={SECTIONS}>
        <Part id="about-terms" title="About these terms">
          <p>
            These terms apply to your use of this website, which is run by the {ORG.name} ({ORG.short}).
            “We”, “us” and “our” mean NIBG. By using the website you agree to these terms. If you do not
            agree, please do not use it.
          </p>
          <p>
            How we handle personal information is explained separately in our{" "}
            <a className="link font-semibold" href="#privacy">privacy policy</a>.
          </p>
        </Part>

        <Part id="using" title="Using this website">
          <p>You may use this website to learn about NIBG and to contact us. Please do not:</p>
          <ul className="grid gap-2 pl-5 [list-style:disc]">
            <li>use it for anything unlawful, fraudulent or harmful</li>
            <li>try to break, overload or gain unauthorised access to it</li>
            <li>send spam, malicious code or misleading information through it</li>
            <li>copy its contents in bulk by automated means</li>
          </ul>
        </Part>

        <Part id="information" title="Information on this site">
          <p>
            The content on this website is general information about NIBG and business between Nigeria and
            Indonesia. It is not legal, financial, tax or investment advice. Please take professional advice
            before making business or investment decisions.
          </p>
          <p>
            We work to keep the information accurate and up to date, but we cannot guarantee that it is
            complete or current at all times. Priority sectors, services, event details and membership
            information may change.
          </p>
        </Part>

        <Part id="engagements" title="Membership, events and services">
          <p>
            Descriptions of membership, events, trade missions and services on this website are not offers
            or contracts. Any membership, event booking, introduction or engagement with NIBG is governed by
            the separate terms we agree with you in writing at the time.
          </p>
          <p>
            Introductions to businesses, investors or advisers are made in good faith. You remain responsible
            for your own checks before entering into any agreement with a third party.
          </p>
        </Part>

        <Part id="messages" title="Messages you send us">
          <p>
            When you contact us, please give accurate details and do not send confidential or sensitive
            information through the website. We aim to reply to every genuine enquiry, but we cannot promise
            a particular response time or outcome.
          </p>
        </Part>

        <Part id="ip" title="Our name, logo and content">
          <p>
            The NIBG name, logo, text, photographs and design of this website belong to NIBG or are used with
            permission. You may view, print and share pages for your own non-commercial use, as long as you
            credit NIBG and do not change them.
          </p>
          <p>
            You may not use the NIBG name or logo, or present yourself as connected with NIBG, without our
            written permission.
          </p>
        </Part>

        <Part id="links" title="Links to other websites">
          <p>
            This website links to services run by others, such as Google Maps. We do not control those
            services and are not responsible for their content, availability or privacy practices.
          </p>
        </Part>

        <Part id="liability" title="Our responsibility to you">
          <p>
            The website is provided “as is”. As far as the law allows, we are not liable for any loss or
            damage arising from your use of the website or your reliance on its content, or from the website
            being unavailable.
          </p>
          <p>Nothing in these terms limits any liability that cannot be limited under the law.</p>
        </Part>

        <Part id="changes-terms" title="Changes">
          <p>
            We may update the website and these terms from time to time. The date at the top of the contents
            shows when they last changed. Using the website after a change means you accept the updated terms.
          </p>
        </Part>

        <Part id="law" title="Governing law">
          <p>
            These terms are governed by the laws of the Federal Republic of Nigeria, and the courts of Nigeria
            deal with any dispute about them.
          </p>
        </Part>

        <Part id="contact-terms" title="Contact us">
          <p>
            Questions about these terms: email <a className="link" href={`mailto:${ORG.email}`}>{ORG.email}</a>,
            call <a className="link" href={ORG.phoneHref}>{ORG.phone}</a>, or write to us at{" "}
            {ORG.address.join(", ")}.
          </p>
        </Part>
      </PolicyLayout>
    </>
  );
}
