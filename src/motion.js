import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Smooth scrolling with Lenis.
// - Wheel and trackpad get an eased, inertial glide; touch screens keep their
//   native momentum (smoothing touch feels laggy on phones).
// - Paused while the logo preloader plays, so early wheel input can't pile up.
// - Skipped entirely for visitors who ask their system for reduced motion.
let lenis = null;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const fx = new Set();   // scroll effects to run in step with Lenis

export function startSmoothScroll() {
  if (lenis || reduced()) return lenis;
  lenis = new Lenis({
    autoRaf: true,
    duration: 1.05,          // wheel glide length in seconds
    easing: easeOutExpo,     // quick start, soft landing
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
    syncTouch: false,        // native momentum on touch screens
    anchors: false,          // hash links are routes on this site, not anchors
    autoResize: true,
  });
  lenis.on("scroll", () => fx.forEach((f) => f()));
  window.__lenis = lenis;    // read by the browser tests

  // Hold still under the preloader, then hand control back.
  if (document.documentElement.classList.contains("pl-lock")) {
    lenis.stop();
    const go = () => { lenis.start(); lenis.resize(); };
    window.addEventListener("nibg:ready", go, { once: true });
    setTimeout(go, 6000);    // safety: never stay locked
  }
  return lenis;
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -24, duration: 1.3, easing: easeOutExpo });
  else el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" });
}

export function scrollToTop({ immediate = false } = {}) {
  if (lenis) {
    lenis.scrollTo(0, { immediate, force: true, duration: 1.3, easing: easeOutExpo });
    if (immediate) requestAnimationFrame(() => lenis.resize());   // new page, new height
  } else {
    window.scrollTo({ top: 0, behavior: immediate || reduced() ? "auto" : "smooth" });
  }
}

/** Scroll-linked motion: elements with data-parallax="0.2" drift against
 *  the scroll; elements with data-scrub get a --p value (0 → 1) as they
 *  cross the screen, which CSS turns into scale or movement.
 *  Positions are measured without the element's own parallax offset, so the
 *  movement can't feed back on itself and wobble. */
export function startScrollFx() {
  if (reduced()) return () => {};
  const parallax = [...document.querySelectorAll("[data-parallax]")].map((el) => ({
    el, speed: Number(el.dataset.parallax) || 0.15, offset: 0,
  }));
  const scrub = [...document.querySelectorAll("[data-scrub]")];
  let frame = 0;
  const update = () => {
    frame = 0;
    const vh = window.innerHeight;
    for (const p of parallax) {
      const r = p.el.getBoundingClientRect();
      const top = r.top - p.offset;              // where it sits without parallax
      if (top + r.height < -300 || top > vh + 300) continue;
      p.offset = (top + r.height / 2 - vh / 2) * -p.speed;
      p.el.style.transform = `translate3d(0, ${p.offset.toFixed(2)}px, 0)`;
    }
    for (const el of scrub) {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height * 0.5)));
      el.style.setProperty("--p", p.toFixed(3));
    }
  };
  // With Lenis, run in the same frame as its scroll; without it, on scroll.
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
  update();
  if (lenis) fx.add(update);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return () => {
    fx.delete(update);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    cancelAnimationFrame(frame);
  };
}
