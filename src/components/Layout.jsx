import { useEffect, useRef, useState } from "react";
import { IMG, ORG, PAGES } from "../content.js";
import { scrollToTop } from "../motion.js";
import { openConsentSettings } from "./Consent.jsx";
import { SectionBg } from "./Blocks.jsx";

const HDR = 72;          // header height in px
const SHOW_ZONE = 90;    // pointer this close to the top of the window shows the header
const TOP_ZONE = 80;     // within this much of the page top the header always shows

// The header takes the field (colour) of whichever chapter sits beneath it.
function useFieldUnderHeader(route) {
  const [field, setField] = useState("paper");
  useEffect(() => {
    let frame = 0;
    const pick = () => {
      frame = 0;
      const y = HDR / 2;
      // Whole chapters only (and the hero's lower field), never tiles inside them.
      const sections = document.querySelectorAll("main > section[data-field], main .hero-low");
      let found = "paper";
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) found = el.dataset.field;
      }
      setField(found);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(pick); };
    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [route]);
  return field;
}

/** Hidden while the page is scrolled. Shown at the top of the page, when the
 *  mouse comes near the top of the window, while the header has keyboard
 *  focus or its menu is open, and (on touch screens) when scrolling back up. */
function useHeaderVisibility(menuOpen) {
  const [shown, setShown] = useState(true);
  const state = useRef({ pointerNear: false, hover: false, focus: false, lastY: 0, upShown: false });

  useEffect(() => {
    const s = state.current;
    const decide = () => {
      const y = window.scrollY;
      setShown(y < TOP_ZONE || s.pointerNear || s.hover || s.focus || menuOpen || s.upShown);
    };
    const onScroll = () => {
      const y = window.scrollY;
      const touch = window.matchMedia("(hover: none)").matches;
      if (touch) s.upShown = y < s.lastY - 4 ? true : y > s.lastY + 4 ? false : s.upShown;
      s.lastY = y;
      decide();
    };
    const onMove = (e) => {
      const near = e.clientY <= SHOW_ZONE;
      if (near !== s.pointerNear) { s.pointerNear = near; decide(); }
    };
    const onLeave = () => { s.pointerNear = false; decide(); };
    s.decide = decide;
    decide();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [menuOpen]);

  const set = (key) => (value) => { state.current[key] = value; state.current.decide?.(); };
  return { shown, setHover: set("hover"), setFocus: set("focus") };
}

export function Header({ route }) {
  const field = useFieldUnderHeader(route);
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [route]);
  const { shown, setHover, setFocus } = useHeaderVisibility(open);

  return (
    <header
      className={`site-header${shown ? "" : " is-hidden"}`}
      data-field={field}
      data-shown={shown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); }}
    >
      <div className="wrap flex h-full items-center justify-between gap-6">
        <a href="#" className="brand flex items-center gap-3 no-underline" aria-label={`${ORG.short} home`}>
          <span className="neu grid h-11 w-11 place-items-center !rounded-full">
            <img src={IMG.mark} alt="" width="32" height="32" className="h-8 w-8 object-contain" />
          </span>
          <span className="t-lead font-semibold tracking-tight">{ORG.short}</span>
        </a>

        <nav aria-label="Main" className="neu-nav hidden items-center gap-1 p-1.5 lg:flex">
          {[{ id: "home", label: "Home", href: "#" }, ...PAGES].map((p) => (
            <a key={p.id} href={p.href ?? `#${p.id}`} className="nav-link" aria-current={route === p.id ? "page" : undefined}>
              {p.label}
            </a>
          ))}
          <a href="#contact" className="btn btn-sm ml-1" aria-current={route === "contact" ? "page" : undefined}>
            Contact
          </a>
        </nav>

        <button
          type="button"
          className="neu-btn px-5 py-2.5 font-semibold lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <nav id="mobile-nav" aria-label="Main" hidden={!open} className="mobile-nav lg:hidden" data-field="paper">
        <ul className="wrap grid gap-3 py-6">
          {[{ id: "home", label: "Home", href: "#" }, ...PAGES, { id: "contact", label: "Contact" }].map((p) => (
            <li key={p.id}>
              <a href={p.href ?? `#${p.id}`} className="nav-link block !px-5 !py-4 t-lead font-semibold" aria-current={route === p.id ? "page" : undefined}>
                {p.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer data-field="deep" className="has-bg relative overflow-hidden">
      <SectionBg src={IMG.ctaContact} speed={-0.06} />
      <div className="wrap relative z-10 pt-24 pb-10">
        <p className="slide t-hero foot-name">{ORG.name}</p>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <div className="rise md:col-span-5" style={{ "--i": 1 }}>
            <p className="t-lead font-semibold leading-tight">Nigeria</p>
            <p className="t-lead font-semibold leading-tight">Republic of Indonesia</p>
            <p className="soft mt-4 max-w-sm">{ORG.tagline}.</p>
            <p className="mt-6 t-body font-medium break-all">
              <a className="link" href={`mailto:${ORG.email}`}>{ORG.email}</a>
            </p>
            <p className="mt-2 t-body font-medium"><a className="link" href={ORG.phoneHref}>{ORG.phone}</a></p>
            <p className="soft mt-2 t-body">{ORG.address.join(", ")}</p>
          </div>
          <nav aria-label="Footer" className="rise md:col-span-6 md:col-start-7" style={{ "--i": 2 }}>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3 t-body sm:grid-cols-3">
              <li><a className="link" href="#">Home</a></li>
              {PAGES.map((p) => (
                <li key={p.id}><a className="link" href={`#${p.id}`}>{p.label}</a></li>
              ))}
              <li><a className="link" href="#contact">Contact</a></li>
              <li><a className="link" href="#privacy">Privacy policy</a></li>
              <li><a className="link" href="#terms">Terms and conditions</a></li>
            </ul>
          </nav>
        </div>

        <div className="mt-24 flex flex-wrap items-center justify-between gap-4 t-small">
          <p className="soft">© {new Date().getFullYear()} {ORG.name} ({ORG.short}). All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="#privacy" className="link font-medium">Privacy policy</a>
            <a href="#terms" className="link font-medium">Terms and conditions</a>
            <button type="button" onClick={openConsentSettings} className="link font-medium">Cookie settings</button>
            <button type="button" onClick={() => scrollToTop()} className="neu-btn px-4 py-2 font-medium">Back to top ↑</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
