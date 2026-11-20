import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Cookie and storage consent.
// The site itself sets no tracking cookies. It keeps this one choice in the
// browser's local storage ("essential"), and the Google Map on the contact
// page sets Google's own cookies — so the map only loads after "Accept all".
const KEY = "nibg-consent";
const listeners = new Set();
let reopen = false;

function read() {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || "null");
    return v && (v.choice === "all" || v.choice === "essential") ? v.choice : null;
  } catch {
    return null;   // storage blocked (private window, embeds): ask again, site still works
  }
}
let current = typeof window === "undefined" ? null : read();

function emit() { listeners.forEach((l) => l()); }
export function setConsent(choice) {
  current = choice;
  reopen = false;
  try { window.localStorage.setItem(KEY, JSON.stringify({ choice, at: new Date().toISOString() })); } catch { /* keep for this visit only */ }
  emit();
}
export function openConsentSettings() { reopen = true; emit(); }

const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };
/** "all", "essential", or null when the visitor hasn't chosen yet. */
export function useConsent() {
  return useSyncExternalStore(subscribe, () => current, () => null);
}
function useBannerOpen() {
  return useSyncExternalStore(subscribe, () => current === null || reopen, () => false);
}

// Waits for the logo preloader to leave before sliding in.
function usePreloaderGone() {
  const [gone, setGone] = useState(() => !document.getElementById("preloader"));
  useEffect(() => {
    if (gone) return;
    const done = () => setGone(true);
    window.addEventListener("nibg:ready", done);
    const t = setTimeout(done, 6000);   // safety: never wait forever
    return () => { window.removeEventListener("nibg:ready", done); clearTimeout(t); };
  }, [gone]);
  return gone;
}

export function CookieBanner() {
  const open = useBannerOpen();
  const ready = usePreloaderGone();
  const choice = useConsent();
  const first = useRef(null);
  const show = open && ready;

  // When reopened from the footer, move focus into the banner.
  useEffect(() => { if (show && choice) first.current?.focus(); }, [show, choice]);
  if (!show) return null;

  return (
    <section
      className="cookie-banner neu"
      data-field="paper"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
      data-testid="cookie-banner"
    >
      <h2 id="cookie-title" className="t-lead tracking-[-0.015em]">Cookies and storage</h2>
      <p id="cookie-text" className="mt-3 t-body">
        This site keeps your choices in your browser so it works properly. The office map on the
        contact page comes from Google Maps, which sets its own cookies. Accept all to show the map,
        or keep essential storage only.{" "}
        <a href="#privacy" className="link font-semibold">Privacy policy</a>
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button ref={first} type="button" className="btn btn-sm" onClick={() => setConsent("all")}>Accept all</button>
        <button type="button" className="neu-btn px-5 py-2.5 font-semibold" onClick={() => setConsent("essential")}>Essential only</button>
      </div>
      {choice && <p className="soft mt-3 t-small">Current choice: {choice === "all" ? "all cookies accepted" : "essential only"}.</p>}
    </section>
  );
}
