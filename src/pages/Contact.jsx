import { useEffect, useRef, useState } from "react";
import { Hero, Explore, Cta } from "../components/Blocks.jsx";
import { BusinessClock } from "../components/BusinessClock.jsx";
import { useConsent, setConsent } from "../components/Consent.jsx";
import { IMG, ORG, MAP } from "../content.js";

const UNAVAILABLE = "The form can’t send messages from this preview. It works once the site is on its host.";

// Submissions go to the hosting platform's data SDK (window.dataSdk),
// exactly as on the original site. Nothing is reported as sent unless the
// SDK confirms it.
function ContactForm() {
  const form = useRef(null);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState({ text: "", kind: "" });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await window.dataSdk?.init({ onDataChanged() {} });
        if (alive) setReady(Boolean(r?.isOk));
      } catch {
        if (alive) setReady(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.current.reportValidity()) return;
    if (!ready) { setStatus({ text: UNAVAILABLE, kind: "error" }); return; }
    setBusy(true);
    setStatus({ text: "Sending your message…", kind: "" });
    const d = new FormData(form.current);
    try {
      const r = await window.dataSdk.create({
        name: String(d.get("name")).trim(),
        email: String(d.get("email")).trim(),
        organization: String(d.get("organization") || "").trim(),
        message: String(d.get("message")).trim(),
        submitted_at: new Date().toISOString(),
      });
      if (!r?.isOk) throw new Error("create failed");
      form.current.reset();
      setStatus({ text: "Thank you. Your message has been received.", kind: "ok" });
    } catch {
      setStatus({ text: "Your message could not be sent. Please try again.", kind: "error" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2" aria-describedby="form-status">
      <div>
        <label htmlFor="name" className="mb-2 block font-medium">Full name</label>
        <input id="name" name="name" className="fld" autoComplete="name" maxLength={100} required />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block font-medium">Email address</label>
        <input id="email" name="email" type="email" className="fld" autoComplete="email" maxLength={160} required />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="organization" className="mb-2 block font-medium">Organisation <span className="soft font-normal">(optional)</span></label>
        <input id="organization" name="organization" className="fld" autoComplete="organization" maxLength={120} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="mb-2 block font-medium">Your message</label>
        <textarea id="message" name="message" data-lenis-prevent className="fld" maxLength={3000} required />
      </div>
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <button type="submit" className="btn" disabled={busy}>{busy ? "Sending…" : "Send message"} <span className="arr" aria-hidden="true">→</span></button>
        <p id="form-status" role="status" aria-live="polite" data-testid="form-status"
          className={`font-medium ${status.kind === "ok" ? "text-green" : status.kind === "error" ? "text-red" : ""}`}>
          {status.text}
        </p>
      </div>
    </form>
  );
}

// Each detail is shown as text people can select or copy; the email, phone
// and map links are conveniences on top, since some browsers and embeds
// ignore mailto: and tel: links.
function DetailRow({ label, value, href, copyText, testId, external }) {
  const [note, setNote] = useState("");
  const field = useRef(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(copyText ?? value);
      setNote(`${label} copied.`);
    } catch {
      const r = document.createRange();
      r.selectNodeContents(field.current);
      const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      setNote("Selected. Press Ctrl+C or Cmd+C to copy.");
    }
  };
  return (
    <div className="grid gap-2">
      <p className="soft t-small font-medium">{label}</p>
      <p className="t-body font-semibold break-words" ref={field}>
        <a className="link" href={href} data-testid={testId} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
          {Array.isArray(value) ? value.map((l) => <span key={l} className="block">{l}</span>) : value}
        </a>
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="neu-btn px-4 py-2 t-small font-semibold" onClick={copy} aria-label={`Copy ${label.toLowerCase()}`}>Copy</button>
        <p role="status" aria-live="polite" className="soft t-small">{note}</p>
      </div>
    </div>
  );
}

function ContactDetails() {
  return (
    <div id="contact-details" className="neu rise mt-10 grid gap-6 p-6" style={{ "--i": 2 }}>
      <h3 className="t-lead tracking-[-0.015em]">Contact details</h3>
      <DetailRow label="Email" value={ORG.email} href={`mailto:${ORG.email}`} testId="contact-email" />
      <DetailRow label="Phone" value={ORG.phone} href={ORG.phoneHref} testId="contact-phone" />
      <DetailRow label="Office" value={ORG.address} copyText={ORG.address.join(", ")} href={MAP.link} testId="contact-address" external />
    </div>
  );
}

// The office map. Google's embed sets Google's own cookies, so it loads only
// after the visitor accepts all cookies. It also can't load inside the Claude
// preview (the preview frame blocks other sites), so a framed page always
// shows the address with a link to Google Maps instead.
function OfficeMap() {
  const consent = useConsent();
  const [framed] = useState(() => { try { return window.self !== window.top; } catch { return true; } });
  const showMap = !framed && consent === "all";
  return (
    <div className="lift relative min-h-[360px] overflow-hidden lg:min-h-[460px]" data-field="mist" data-testid="office-map">
      {showMap ? (
        <iframe
          title={`Map of the NIBG office: ${ORG.address.join(", ")}`}
          src={MAP.embed}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 grid place-content-center gap-5 p-8 text-center">
          <p className="t-lead font-semibold tracking-[-0.015em]">{ORG.address.join(", ")}</p>
          <p className="soft mx-auto max-w-[38ch]">
            {framed
              ? "The map opens in Google Maps from this preview. On the live website it shows here."
              : "The map is provided by Google Maps, which sets its own cookies."}
          </p>
          <p className="flex flex-wrap justify-center gap-3">
            {!framed && <button type="button" className="btn" onClick={() => setConsent("all")}>Show map</button>}
            <a className={framed ? "btn" : "neu-btn px-5 py-3 font-semibold no-underline"} href={MAP.link} target="_blank" rel="noopener">Open in Google Maps <span aria-hidden="true">→</span></a>
          </p>
        </div>
      )}
    </div>
  );
}

export default function Contact() {
  return (
    <>
      <Hero
        field="green"
        lines={["Start the", "conversation."]}
        sentence="Membership, events, trade or investment: send a message and the NIBG team will follow up."
        action={{ label: "Write to us", scroll: "contact-form" }}
        img={IMG.contact}
        alt="A bright, welcoming office reception with plants"
        bg={IMG.lagos}
      />

      <section id="write" data-field="paper">
        <div className="wrap grid gap-12 py-28 md:py-36 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="rise t-head">Send a message</h2>
            <p className="rise soft mt-6 max-w-[34ch]" style={{ "--i": 1 }}>
              Tell us who you are and what you are working on between Nigeria and Indonesia. All fields are required except organisation.
            </p>
            <ContactDetails />
          </div>
          {/* "Write to us" buttons scroll here, so the first field is on screen. */}
          <div id="contact-form" className="rise lg:col-span-8" style={{ "--i": 2 }}>
            <ContactForm />
          </div>
        </div>
      </section>

      <section id="office" data-field="mist">
        <div className="wrap grid gap-12 py-28 md:py-36 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="slide t-head">Visit our office</h2>
            <address className="rise mt-8 t-lead not-italic leading-snug" style={{ "--i": 1 }}>
              {ORG.address.map((l) => <span key={l} className="block">{l}</span>)}
            </address>
            <p className="rise mt-6 t-body" style={{ "--i": 2 }}>
              <a className="link font-semibold" href={ORG.phoneHref}>{ORG.phone}</a>
            </p>
            <p className="rise mt-8" style={{ "--i": 3 }}>
              <a className="btn" href={MAP.link} target="_blank" rel="noopener">Get directions <span className="arr" aria-hidden="true">→</span></a>
            </p>
          </div>
          <div className="rise lg:col-span-8" style={{ "--i": 2 }}>
            <OfficeMap />
          </div>
        </div>
      </section>

      <BusinessClock id="contact-clock" />
      <Explore current="contact" field="mist" />

      <Cta
        lines={["We’d love to", "hear from you."]}
        sentence={`Call ${ORG.phone} or email ${ORG.email}. The NIBG team will get back to you.`}
        action={{ label: "Write to us", scroll: "contact-form" }}
        bg={IMG.ctaContact}
      />
    </>
  );
}
