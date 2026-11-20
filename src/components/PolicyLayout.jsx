import { scrollToId } from "../motion.js";

// Shared layout for the legal pages (Privacy policy, Terms and conditions):
// a contents box that stays in view on wide screens, and the text beside it.
export function PolicyLayout({ id = "policy", label, updated, sections, children }) {
  return (
    <section id={id} data-field="paper">
      <div className="wrap grid gap-12 py-28 md:py-36 lg:grid-cols-12">
        <nav aria-label={`${label} contents`} className="lg:col-span-4">
          <div className="neu grid gap-1 p-5 lg:sticky lg:top-24">
            <p className="soft t-small font-medium">Last updated {updated}</p>
            <ul className="mt-3 grid gap-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => scrollToId(s.id)} className="nav-link block w-full !px-3 !py-2 text-left t-body">
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="grid gap-14 lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

export function Part({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
      <h2 id={`${id}-h`} className="t-lead tracking-[-0.015em]">{title}</h2>
      <div className="mt-4 grid max-w-[64ch] gap-4">{children}</div>
    </section>
  );
}
