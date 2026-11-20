import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY } from "../content.js";

// Event gallery: photos tile at their natural shapes (masonry columns); each
// opens full screen in a lightbox with arrows, keyboard and swipe controls.
// Add photos by editing GALLERY in src/content.js.
export function Gallery({ id = "gallery", heading = "From the field", intro }) {
  const [open, setOpen] = useState(-1);          // index of the open photo, -1 = closed
  const dialog = useRef(null);
  const lastTrigger = useRef(null);
  const n = GALLERY.length;

  const show = (i, trigger) => { lastTrigger.current = trigger; setOpen(i); };
  const close = useCallback(() => setOpen(-1), []);
  const step = useCallback((d) => setOpen((i) => (i + d + n) % n), [n]);

  // Open and close the native <dialog>; pause smooth scrolling meanwhile.
  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open >= 0 && !d.open) { d.showModal(); window.__lenis?.stop(); }
    if (open < 0 && d.open) { d.close(); window.__lenis?.start(); lastTrigger.current?.focus(); }
  }, [open]);

  useEffect(() => {
    if (open < 0) return;
    const onKey = (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  // Swipe left/right on touch screens.
  const touch = useRef(null);
  const onPointerDown = (e) => { touch.current = e.clientX; };
  const onPointerUp = (e) => {
    if (touch.current == null) return;
    const dx = e.clientX - touch.current;
    touch.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  const photo = open >= 0 ? GALLERY[open] : null;

  return (
    <section id={id} data-field="mist" aria-labelledby={`${id}-h`}>
      <div className="wrap py-28 md:py-36">
        <div className="grid gap-6 md:grid-cols-12">
          <h2 id={`${id}-h`} className="slide t-head md:col-span-7">{heading}</h2>
          <p className="rise soft max-w-[42ch] md:col-span-5 md:self-end" style={{ "--i": 1 }}>
            {intro ?? `NIBG at trade expos, award ceremonies and partner meetings. Select a photo to view it full size.`}
          </p>
        </div>

        <ul className="gallery mt-14" data-testid="gallery">
          {GALLERY.map((g, i) => (
            <li key={g.src} className="gallery-item rise" style={{ "--i": (i % 3) + 1 }}>
              <button
                type="button"
                className="gallery-btn neu-card group"
                onClick={(e) => show(i, e.currentTarget)}
                aria-label={`View photo ${i + 1} of ${n}: ${g.caption}`}
              >
                <span className="gallery-frame wipe" style={{ "--i": (i % 3) + 1, aspectRatio: `${g.w} / ${g.h}` }}>
                  <img src={g.src} alt={g.caption} width={g.w} height={g.h} loading="lazy" />
                </span>
                <span className="gallery-cap">{g.caption}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Photo viewer"
        onClose={close}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        data-testid="lightbox"
      >
        {photo && (
          <figure className="lightbox-fig" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
            <img key={photo.src} src={photo.src} alt={photo.caption} width={photo.w} height={photo.h} className="lightbox-img" />
            <figcaption className="lightbox-cap">
              <span>{photo.caption}</span>
              <span className="tabular-nums opacity-80" aria-live="polite">{open + 1} / {n}</span>
            </figcaption>
          </figure>
        )}
        <button type="button" className="lightbox-btn lightbox-prev" onClick={() => step(-1)} aria-label="Previous photo">←</button>
        <button type="button" className="lightbox-btn lightbox-next" onClick={() => step(1)} aria-label="Next photo">→</button>
        <button type="button" className="lightbox-btn lightbox-close" onClick={close} aria-label="Close photo viewer">✕</button>
      </dialog>
    </section>
  );
}
