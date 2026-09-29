import { Link } from "react-router-dom";

import Header from "@/components/PageHeader";
import Footer from "@/components/PageFooter";

const SAMPLE_TRIP_URL = "https://your-next-trip.netlify.app/trip/1790473857311#";

/* ---------- icons (same set as the planner) ---------- */
const makeIcon = (paths) =>
  function Icon({ className = "" }) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        {paths}
      </svg>
    );
  };
const IconTransit = makeIcon(<><rect x="5" y="3" width="14" height="13" rx="3" /><path d="M5 10h14M8 20l2-4M16 20l-2-4" /></>);
const IconStay = makeIcon(<><path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3" /><circle cx="7" cy="10" r="1.5" /></>);
const IconPlace = makeIcon(<><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>);
const IconFood = makeIcon(<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1-3 3-3 6v3h3v9" />);
const IconRoute = makeIcon(<><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7" /></>);
const IconClock = makeIcon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
const IconLink = makeIcon(<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />);
const IconCheck = makeIcon(<path d="M5 12.5l4.5 4.5L19 7.5" />);
const IconNote = makeIcon(<><path d="M6 3h9l4 4v14H6z" /><path d="M14 3v5h5M9 13h7M9 17h5" /></>);
const IconList = makeIcon(<><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6l1 1 2-2M4 12l1 1 2-2" /><circle cx="5" cy="18" r="1" /></>);
const IconDay = makeIcon(<><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></>);

const TYPES = {
  transit: { label: "Transit", c: "#2F5BD3", cb: "#E8EEFC", icon: IconTransit },
  stay: { label: "Stay", c: "#7A3FC4", cb: "#F1EAFB", icon: IconStay },
  place: { label: "Place", c: "#0E6E66", cb: "#E3F2EF", icon: IconPlace },
  food: { label: "Food", c: "#B45309", cb: "#FDF0E1", icon: IconFood },
};

/* ---------- sample day (mirrors a real planner day) ---------- */
const SAMPLE_DAY = [
  { id: 1, type: "transit", sub: "Train", start: 600, dur: 135, name: "Tokyo Station → Kyoto Station", details: "Nozomi 215, car 7, seats 12A–B", link: "smart-ex.jp", cost: 130 },
  { id: 2, type: "stay", sub: "Hotel", start: 780, dur: 0, name: "Check in at Hotel Granvia Kyoto", details: "Inside Kyoto Station, 3rd floor lobby", link: "granvia-kyoto.co.jp", cost: 180, travelNext: "Bus 5 to Fushimi Inari, 25 min, $2" },
  { id: 3, type: "place", sub: "Sight", start: 900, dur: 120, name: "Fushimi Inari Shrine", details: "68 Fukakusa Yabunouchicho", cost: 0 },
  { id: 4, type: "food", sub: "Restaurant", start: 1140, dur: 90, name: "Dinner in Pontocho", details: "Pontocho Alley, Nakagyo Ward", cost: 60, notes: "Booked for 2, confirmation 4821" },
];

const t12 = (m) => {
  m = ((m % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  return `${h % 12 || 12}:${String(m % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};
const fmtD = (m) => {
  const h = Math.floor(m / 60), r = m % 60;
  return h ? (r ? `${h}h ${r}m` : `${h}h`) : `${r} min`;
};

/* ---------- site header and footer (same as the My trips page) ---------- */
const HOME_URL = SAMPLE_TRIP_URL;

export function SiteHeader({ homeUrl = HOME_URL, children }) {
  return (
    <header className="border-b border-[#E1E5EC] bg-white">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
        <div className="flex items-start gap-3 sm:items-center">
          {/* Dawn sky logo */}
          <span
            aria-hidden="true"
            className="h-11 w-11 shrink-0 rounded-[10px] bg-[linear-gradient(135deg,#7B6CF6_0%,#FF7E8A_50%,#FFC46B_100%)]"
          />
          <div className="flex min-h-11 flex-col sm:h-11 sm:justify-between">
            <a
              href={homeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-lg font-extrabold leading-6 tracking-[-0.01em] text-[#111827] no-underline hover:text-[#0E6E66] focus-visible:rounded focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0E6E66]"
            >
              YourNextTrip
            </a>
            <p className="m-0 text-sm leading-5 text-[#4A5568]">
              Plan your perfect trip — every stop, every moment.
            </p>
          </div>
        </div>
        {children}
      </div>
    </header>
  );
}




/* ---------- product preview: one planner day ---------- */
function PreviewCard({ it }) {
  const T = TYPES[it.type];
  const Icon = T.icon;
  return (
    <article style={{ "--c": T.c, "--cb": T.cb }} className="rounded-[14px] bg-white px-3 py-[11px] shadow-[0_0_0_1px_#B8C1CE] sm:px-4 sm:py-3">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] font-bold text-[var(--c)]">
          <i className="grid h-5 w-5 place-items-center rounded-md bg-[var(--cb)]"><Icon className="h-3 w-3" /></i>
          {T.label}
          <em className="font-medium not-italic text-[#4A5568]">/ {it.sub}</em>
        </span>
        <span className="order-3 basis-full whitespace-nowrap text-[13px] text-[#2F3A4D] sm:order-none sm:basis-auto sm:border-l sm:border-[#B8C1CE] sm:pl-2.5">
          {t12(it.start)}{it.dur ? ` – ${t12(it.start + it.dur)}` : ""}
          {it.dur > 0 && <span className="text-[#4A5568]"><span className="mx-1.5">·</span>{fmtD(it.dur)}</span>}
        </span>
        <span className="ml-auto flex items-center gap-2.5 sm:gap-3.5">
          {it.link && (
            <span className="hidden items-center gap-[5px] text-[13px] font-semibold text-[#1D5FD6] sm:inline-flex">
              <IconLink className="h-3.5 w-3.5" />{it.link}
            </span>
          )}
          <span className="whitespace-nowrap text-[13px] font-bold text-[#111827]">{it.cost === 0 ? "Free" : `$${it.cost}`}</span>
        </span>
      </div>
      <div className="mt-1 text-base font-bold leading-[1.3] text-[#111827] sm:text-[17px]">{it.name}</div>
      <div className="mt-0.5 truncate text-sm leading-[1.45] text-[#2F3A4D]">{it.details}</div>
      {it.notes && (
        <div className="mt-0.5 truncate text-sm leading-[1.45] text-[#4A5568]"><b className="font-semibold text-[#2F3A4D]">Note: </b>{it.notes}</div>
      )}
    </article>
  );
}

function PreviewGap({ prev, next }) {
  const wrap = "my-1 flex min-h-[30px] items-center gap-2.5 sm:ml-[22px] sm:before:mr-1 sm:before:self-stretch sm:before:border-l-2 sm:before:border-dashed sm:before:border-[#B8C1CE] sm:before:content-['']";
  if (prev.travelNext) {
    return (
      <div className={wrap}>
        <span className="inline-flex h-[26px] max-w-full items-center gap-1.5 rounded-full bg-[#E8EEFC] pl-2 pr-3 text-[13px] font-semibold text-[#2F5BD3]">
          <IconRoute className="h-[13px] w-[13px] shrink-0" /><span className="truncate">{prev.travelNext}</span>
        </span>
      </div>
    );
  }
  const gap = next.start - (prev.start + prev.dur);
  return (
    <div className={wrap}>
      <span className="inline-flex h-[26px] items-center gap-1.5 rounded-full bg-[#F4F6FA] pl-2 pr-2.5 text-[13px] font-semibold text-[#2F3A4D]">
        <IconClock className="h-[13px] w-[13px]" />Next in {fmtD(gap)}
      </span>
    </div>
  );
}

function DayPreview() {
  const total = SAMPLE_DAY.reduce((s, x) => s + x.cost, 0);
  return (
    <figure className="m-0">
      <section aria-label="Sample day from a trip plan" className="rounded-[20px] bg-white shadow-[0_0_0_1px_#E1E5EC,0_24px_60px_rgba(17,24,39,.10)] sm:rounded-3xl">
        <div className="rounded-t-[20px] border-b border-[#E1E5EC] px-[18px] pb-3.5 pt-[18px] sm:rounded-t-3xl sm:px-7 sm:pb-4 sm:pt-[22px]">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[34px] font-extrabold leading-none tracking-[-0.03em] sm:text-[44px]">5</span>
            <span className="flex flex-col leading-[1.25]">
              <b className="text-[19px] font-extrabold sm:text-[22px]">Wednesday</b>
              <span className="text-[17px] text-[#4A5568]">October 14, 2026</span>
            </span>
            <span className="ml-auto text-right leading-[1.3]">
              <b className="block text-[19px] font-extrabold sm:text-[22px]">${total}</b>
              <span className="text-base text-[#4A5568]">4 actions</span>
            </span>
          </div>
          <div aria-hidden="true" className="relative mt-3.5 h-1.5 overflow-hidden rounded-[3px] bg-[#F4F6FA]">
            {SAMPLE_DAY.map((x) => (
              <i key={x.id} className="absolute inset-y-0 rounded-sm" style={{ left: `${(x.start / 1440) * 100}%`, width: `${(Math.max(x.dur, 20) / 1440) * 100}%`, background: TYPES[x.type].c }} />
            ))}
          </div>
          <div aria-hidden="true" className="mt-1 flex justify-between text-[11px] text-[#4A5568]">
            <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span>
          </div>
        </div>
        <div className="px-3 pb-5 pt-3.5 sm:px-7 sm:pb-7 sm:pt-[18px]">
          {SAMPLE_DAY.map((it, k) => (
            <div key={it.id}>
              {k > 0 && <PreviewGap prev={SAMPLE_DAY[k - 1]} next={it} />}
              <PreviewCard it={it} />
            </div>
          ))}
        </div>
      </section>
      <figcaption className="mt-3 text-center text-sm text-[#4A5568]">Day 5 of a sample Tokyo and Kyoto trip</figcaption>
    </figure>
  );
}

/* ---------- hero ---------- */
function Hero({ onComplete }) {
  return (
    <section className="px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:pb-24 lg:pt-20">
      <div className="mx-auto grid max-w-[1192px] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] lg:gap-16">
        <div className="max-w-[560px]">
          <h1 className="m-0 text-[40px] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#111827] sm:text-[58px]">
            You know where you’re going. Keep it all in one plan.
          </h1>
          <p className="mb-9 mt-6 max-w-[500px] text-lg leading-[1.6] text-[#2F3A4D]">
            Put every flight, hotel, sight and dinner on a day-by-day timeline, with times, costs and links. A checklist and notes sit right beside it.
          </p>
          <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onComplete()}
                  className="
                      inline-flex h-[52px] w-full min-w-[160px] sm:w-auto 
                      items-center justify-center gap-2 
                      rounded-[14px] 
                      bg-[linear-gradient(135deg,#7B6CF6_0%,#FF7E8A_50%,#FFC46B_100%)] 
                      text-[15px] font-extrabold text-white [text-shadow:0_1px_2px_rgba(60,30,80,.4)] shadow-[0_8px_22px_rgba(255,126,138,.38)] transition 
                      hover:-translate-y-px hover:brightness-105 hover:saturate-[1.1] hover:shadow-[0_12px_28px_rgba(255,126,138,.48)] 
                      focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0E6E66] 
                      px-8 
                  "
              >
              Start planning
            </button>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-[#4A5568]">
            <IconCheck className="h-4 w-4 text-[#13795B]" />Free to start, no credit card needed
          </p>
        </div>
        <DayPreview />
      </div>
    </section>
  );
}

/* ---------- the three areas of a trip ---------- */
function MiniChecklist() {
  const groups = [
    { name: "Documents", items: [["Passport", true], ["JR reservation", true]] },
    { name: "Money", items: [["Yen for the first days", false]] },
    { name: "Health", items: [["Medication", false]] },
  ];
  return (
    <div className="flex flex-col gap-3 rounded-[14px] bg-[#F4F6FA] p-3.5">
      {groups.map((g) => (
        <div key={g.name}>
          <div className="mb-1.5 text-[13px] font-bold text-[#2F3A4D]">{g.name}</div>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {g.items.map(([label, done]) => (
              <li key={label} className="flex items-center gap-2.5 rounded-[10px] bg-white px-3 py-2 text-[15px] shadow-[0_0_0_1px_#E1E5EC]">
                <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-md ${done ? "bg-[#0E6E66] text-white" : "shadow-[inset_0_0_0_1.5px_#B8C1CE]"}`}>
                  {done && <IconCheck className="h-3.5 w-3.5" />}
                </span>
                <span className={done ? "text-[#4A5568] line-through" : "text-[#111827]"}>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MiniNotes() {
  const notes = [
    { title: "Hotel check-in", body: "Front desk on the 3rd floor. Check-in from 3 PM; bags can be left earlier." },
    { title: "Kyoto restaurant options", body: "Pontocho for dinner, Nishiki Market for lunch. Most places take cash only." },
  ];
  return (
    <div className="flex flex-col gap-2 rounded-[14px] bg-[#F4F6FA] p-3.5">
      {notes.map((n) => (
        <div key={n.title} className="rounded-[10px] bg-white px-3.5 py-3 shadow-[0_0_0_1px_#E1E5EC]">
          <div className="text-[15px] font-bold text-[#111827]">{n.title}</div>
          <p className="m-0 mt-1 text-sm leading-[1.5] text-[#2F3A4D]">{n.body}</p>
        </div>
      ))}
    </div>
  );
}

function MiniPlan() {
  return (
    <div className="flex flex-col gap-2 rounded-[14px] bg-[#F4F6FA] p-3.5">
      {SAMPLE_DAY.slice(0, 3).map((it) => {
        const T = TYPES[it.type];
        const Icon = T.icon;
        return (
          <div key={it.id} className="flex items-center gap-3 rounded-[10px] bg-white px-3 py-2.5 shadow-[0_0_0_1px_#E1E5EC]">
            <i className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: T.cb, color: T.c }}><Icon className="h-4 w-4" /></i>
            <span className="min-w-0 flex-1">
              <b className="block truncate text-[15px] font-bold text-[#111827]">{it.name}</b>
              <span className="text-[13px] text-[#4A5568]">{t12(it.start)}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

const AREAS = [
  { icon: IconDay, title: "Day-by-day plan", body: "Everything you’ll do, in order: where to be, when to be there, and what it costs.", preview: <MiniPlan /> },
  { icon: IconList, title: "Checklist", body: "What to sort out before you leave, grouped by documents, money, clothing, health, food and activities.", preview: <MiniChecklist /> },
  { icon: IconNote, title: "Notes", body: "The research that doesn’t fit a time slot: local tips, options to consider, emergency info.", preview: <MiniNotes /> },
];

function Areas() {
  return (
    <section className="border-t border-[#E1E5EC] bg-white px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-[1192px]">
        <div className="mb-12 max-w-[640px]">
          <h2 className="m-0 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#111827] sm:text-[44px]">Three places for everything about the trip</h2>
          <p className="mb-0 mt-4 text-lg leading-[1.6] text-[#2F3A4D]">
            What you’ll do, what to prepare, and what you found out along the way are different kinds of information. Each gets its own place.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {AREAS.map((a) => {
            const Icon = a.icon;
            return (
              <article key={a.title} className="flex min-w-0 flex-col rounded-[20px] bg-white p-5 shadow-[0_0_0_1px_#E1E5EC,0_12px_32px_rgba(17,24,39,.06)] sm:p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#E3F2EF] text-[#0E6E66]"><Icon className="h-5 w-5" /></span>
                <h3 className="mb-0 mt-4 text-[21px] font-extrabold tracking-[-0.015em] text-[#111827]">{a.title}</h3>
                <p className="mb-5 mt-2 text-base leading-[1.55] text-[#2F3A4D]">{a.body}</p>
                <div aria-hidden="true">{a.preview}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- details ---------- */
const DETAILS = [
  { type: "transit", title: "Four kinds of stop", body: "Transit, stay, place and food, each with its own color, so a day reads at a glance." },
  { type: "food", title: "Costs add up per day", body: "Set a budget on any stop. Every day shows its total and how many stops are still unpriced." },
  { type: "place", title: "Links where you need them", body: "Tickets, reservations and maps sit on the stop they belong to, one tap away." },
  { type: "stay", title: "Time between stops", body: "See the gap before the next stop, or write down how you’ll get there: “Metro, 25 min, $3”." },
];

function Details() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-[1192px] gap-12 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-20">
        <div>
          <h2 className="m-0 text-[32px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#111827] sm:text-[44px]">Built to follow on the day</h2>
          <p className="mb-0 mt-4 text-lg leading-[1.6] text-[#2F3A4D]">
            No searching through messages, tabs and screenshots. Open the day and the next thing is right there.
          </p>
        </div>
        <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
          {DETAILS.map((d) => {
            const T = TYPES[d.type];
            const Icon = T.icon;
            return (
              <div key={d.title}>
                <span className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: T.cb, color: T.c }}><Icon className="h-5 w-5" /></span>
                <h3 className="mb-0 mt-4 text-[19px] font-extrabold tracking-[-0.01em] text-[#111827]">{d.title}</h3>
                <p className="mb-0 mt-2 text-base leading-[1.55] text-[#2F3A4D]">{d.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- closing call to action ---------- */
function CTABanner({ onStart }) {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:pb-28">
      <div className="mx-auto flex max-w-[1192px] flex-col items-start gap-8 rounded-3xl bg-[#111827] px-6 py-12 text-white sm:px-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[560px]">
          <h2 className="m-0 text-[30px] font-extrabold leading-[1.1] tracking-[-0.03em] sm:text-[40px]">Your research is done. Give it one home.</h2>
          <p className="mb-0 mt-3 text-lg leading-[1.6] text-[#D5DAE3]">Free for personal trips. No credit card needed.</p>
        </div>
        <button 
        type="button" 
        onClick={onStart} 
        className="h-[52px] shrink-0 rounded-[14px] bg-[linear-gradient(135deg,#7B6CF6_0%,#FF7E8A_50%,#FFC46B_100%)] text-[#111827] hover:brightness-[.93] px-7 text-base font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white">
          Start planning
        </button>
      </div>
    </section>
  );
}

/* ---------- page ---------- */
export default function LandingPage({
  onComplete
}) {

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F6FA] font-['Schibsted_Grotesk',ui-sans-serif,system-ui,sans-serif] text-[#111827] antialiased">
      <Header />
      <main>
        <Hero onComplete={onComplete} />
        <Areas />
        <Details />
        <CTABanner onStart={onComplete} />
      </main>
      <Footer />
    </div>
  );
}