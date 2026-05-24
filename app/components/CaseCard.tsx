import Link from "next/link";
import s from "./CaseCard.module.scss";

type Case = {
  href: string;
  accentColor: string;
  label: string;
  title: string;
  what: string;
  why: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  cta: string;
};

const CASES: Case[] = [
  {
    href: "/chat",
    accentColor: "#818cf8",
    label: "Live demo",
    title: "LLM Chat — Token Streaming",
    what: "A chat interface where the AI response streams word by word in real time — the same pattern used in ChatGPT and Claude.",
    why: "The product I was building (STATEIS) needed AI responses that felt instant, not batch-loaded. I built the full pipeline: Next.js Edge API route → Server-Sent Events → React state updates on every token.",
    tags: ["Next.js Edge Runtime", "SSE", "React", "TypeScript"],
    metrics: [
      { label: "First token latency", value: "< 300 ms" },
      { label: "Transport", value: "SSE / ReadableStream" },
    ],
    cta: "Open chat →",
  },
  {
    href: "/dashboard",
    accentColor: "#a78bfa",
    label: "Live demo",
    title: "Real-Time Metrics Dashboard",
    what: "A dashboard that shows live server metrics — users, RPS, latency, errors — updating every 500 ms without a single polling request.",
    why: "Polling-based dashboards add latency and waste bandwidth. I used Server-Sent Events to push updates from the server the moment data changes, with animated counters and SVG charts built from scratch.",
    tags: ["SSE", "EventSource API", "React", "SVG charts"],
    metrics: [
      { label: "Update interval", value: "500 ms" },
      { label: "Transport", value: "SSE / EventSource" },
    ],
    cta: "Open dashboard →",
  },
];

export default function CaseCards() {
  return (
    <section id="projects" className={s.section}>
      <div className={s.sectionTitle}>Projects</div>

      <div className={s.grid}>
        {CASES.map((c) => (
          <Link key={c.href} href={c.href} className={s.card}>

            <div className={s.cardHeader}>
              <span className={s.label} style={{ color: c.accentColor }}>
                <span className="live-dot" style={{ marginRight: 6 }} />
                {c.label}
              </span>
            </div>

            <h3 className={s.title}>{c.title}</h3>

            <div className={s.block}>
              <div className={s.blockLabel}>What</div>
              <p className={s.blockText}>{c.what}</p>
            </div>

            <div className={s.block}>
              <div className={s.blockLabel}>Why / How</div>
              <p className={s.blockText}>{c.why}</p>
            </div>

            <div className={s.metrics}>
              {c.metrics.map((m) => (
                <div key={m.label} className={s.metric}>
                  <div className={s.metricLabel}>{m.label}</div>
                  <div className={s.metricValue} style={{ color: c.accentColor }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div className={s.footer}>
              <div className={s.tags}>
                {c.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <span className={s.cta} style={{ color: c.accentColor }}>{c.cta}</span>
            </div>

          </Link>
        ))}
      </div>
    </section>
  );
}
