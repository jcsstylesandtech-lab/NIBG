import { useEffect, useState } from "react";
import { Header, Footer } from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Membership from "./pages/Membership.jsx";
import Events from "./pages/Events.jsx";
import Impact from "./pages/Impact.jsx";
import Contact from "./pages/Contact.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import { startSmoothScroll, startScrollFx, scrollToTop } from "./motion.js";
import { CookieBanner } from "./components/Consent.jsx";

// Plain hash routes (#about, #services …) so the built site runs on any
// static host, from a folder, and inside the Claude preview.
const ROUTES = {
  home: { title: "Home", Page: Home },
  about: { title: "About", Page: About },
  services: { title: "Services", Page: Services },
  membership: { title: "Membership", Page: Membership },
  events: { title: "Events", Page: Events },
  impact: { title: "Impact", Page: Impact },
  contact: { title: "Contact", Page: Contact },
  privacy: { title: "Privacy policy", Page: Privacy },
  terms: { title: "Terms and conditions", Page: Terms },
};
const readRoute = () => {
  const h = window.location.hash.slice(1);
  return ROUTES[h] ? h : "home";
};

// Parts of each section rise in as they enter; anything still hidden after
// a few seconds is shown anyway, so no content depends on the animation.
function useReveal(route) {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = [...document.querySelectorAll(".rise:not(.in), .slide:not(.in), .wipe:not(.in)")];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
    );
    els.forEach((el) => io.observe(el));
    const safety = setTimeout(() => els.forEach((el) => el.classList.add("in")), 4000);
    return () => { io.disconnect(); clearTimeout(safety); };
  }, [route]);
}

export default function App() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    startSmoothScroll();
    const onHash = () => { setRoute(readRoute()); scrollToTop({ immediate: true }); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // Parallax and scroll-scrubbed motion, rebuilt for each page.
  useEffect(() => startScrollFx(), [route]);

  useEffect(() => {
    document.title = route === "home"
      ? "Nigerian Indonesian Business Group"
      : `${ROUTES[route].title} | Nigerian Indonesian Business Group`;
  }, [route]);

  useReveal(route);
  const { Page } = ROUTES[route];

  return (
    <>
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById("main")?.focus(); }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-white focus:p-3 focus:text-black">
        Skip to content
      </a>
      <Header route={route} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Page key={route} />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
