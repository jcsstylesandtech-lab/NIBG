import { useEffect, useState } from "react";

// Office hours assumed: 08:00–17:00, Monday to Friday, local time.
// Neither country uses daylight saving: Lagos is UTC+1 and Jakarta UTC+7,
// so the shared window is always 08:00–11:00 Lagos = 14:00–17:00 Jakarta.
const OPEN = 8, CLOSE = 17;
const CITIES = [
  { city: "Lagos", country: "Nigeria", tz: "Africa/Lagos", field: "green", shared: "08:00–11:00" },
  { city: "Jakarta", country: "Indonesia", tz: "Asia/Jakarta", field: "red", shared: "14:00–17:00" },
];

export function localParts(date, tz) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  const weekday = get("weekday");
  const weekdayOpen = !["Sat", "Sun"].includes(weekday);
  const open = weekdayOpen && hour >= OPEN && hour < CLOSE;
  return { time: `${get("hour")}:${get("minute")}`, weekday, open, hour, minute };
}

export function BusinessClock({ id = "clock" }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);

  const states = CITIES.map((c) => ({ ...c, ...localParts(now, c.tz) }));
  const both = states.every((s) => s.open);

  return (
    <section id={id} data-field="paper" aria-labelledby={`${id}-h`}>
      <div className="wrap py-28 md:py-36">
        <div className="grid gap-6 md:grid-cols-12">
          <h2 id={`${id}-h`} className="rise t-head md:col-span-7">Lagos and Jakarta, right now</h2>
          <p className="rise soft max-w-[40ch] md:col-span-5 md:self-end" style={{ "--i": 1 }}>
            Jakarta runs six hours ahead of Lagos. Both offices share three working hours each weekday.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {states.map((s, i) => (
            <div key={s.city} data-field={s.field} className="lift rise flex min-h-72 flex-col justify-between gap-10 p-8 md:p-10" style={{ "--i": i + 2 }}>
              <p className="t-lead font-semibold">{s.city}, {s.country} · {s.weekday}</p>
              <div>
                <p className="t-hero font-semibold leading-none tracking-[-0.04em] tabular-nums" aria-live="off">
                  <time>{s.time}</time>
                </p>
                <p className="mt-4 t-body font-medium" data-testid={`status-${s.city}`}>
                  {s.open ? "Office hours now" : "Outside office hours"} · shared hours {s.shared}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="rise mt-8 t-lead font-medium" role="status" data-testid="clock-summary">
          {both
            ? "Both markets are in office hours. A good time to call."
            : "Best time for a call: 08:00–11:00 in Lagos, which is 14:00–17:00 in Jakarta, Monday to Friday."}
        </p>
      </div>
    </section>
  );
}
