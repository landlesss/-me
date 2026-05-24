import Link from "next/link";
import s from "./CaseCard.module.scss";

export type Case = {
  href: string;
  icon: string;
  accentColor: string;
  title: string;
  desc: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  cta: string;
};

const CASES: Case[] = [
  {
    href: "/chat",
    icon: "✦",
    accentColor: "#818cf8",
    title: "LLM Chat with Token Streaming",
    desc: "Fullstack chat with Server-Sent Events — messages stream token by token, exactly as in ChatGPT. Built for STATEIS, adapted as a public demo.",
    tags: ["Next.js API Routes", "SSE / Streaming", "React", "TypeScript"],
    metrics: [
      { label: "Latency to first token", value: "< 300 ms" },
      { label: "Architecture", value: "Edge-ready" },
    ],
    cta: "Open Chat →",
  },
  {
    href: "/dashboard",
    icon: "◈",
    accentColor: "#a78bfa",
    title: "Real-Time WebSocket Dashboard",
    desc: "Metrics dashboard with live data over WebSockets. Animated counters, live charts, connection-state management — all without a single polling request.",
    tags: ["WebSockets", "React", "Real-time", "TypeScript"],
    metrics: [
      { label: "Update interval", value: "~500 ms" },
      { label: "Protocol", value: "WS / fallback SSE" },
    ],
    cta: "Open Dashboard →",
  },
];

export default function CaseCards() {
  return (
    <section id="cases">
      <div className={s.sectionLabel}>
        <span>Case Studies</span>
      </div>
      <h2 className={s.sectionTitle}>
        Production demos,<br />
        <em>click to explore</em>
      </h2>

      <div className={s.grid}>
        {CASES.map((c) => (
          <Link key={c.href} href={c.href} className={s.card}>
            <div className={s.cardTop}>
              <div
                className={s.icon}
                style={{
                  background: `${c.accentColor}18`,
                  border: `1px solid ${c.accentColor}30`,
                  color: c.accentColor,
                }}
              >
                {c.icon}
              </div>
              <div className={s.liveLabel}>
                <div className="live-dot" />
                Live Demo
              </div>
            </div>

            <div>
              <h3 className={s.title}>{c.title}</h3>
              <p className={s.desc}>{c.desc}</p>
            </div>

            <div className={s.metrics}>
              {c.metrics.map((m) => (
                <div key={m.label}>
                  <div className={s.metricLabel}>{m.label}</div>
                  <div className={s.metricValue} style={{ color: c.accentColor }}>{m.value}</div>
                </div>
              ))}
            </div>

            <div className={s.tags}>
              {c.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>

            <div className={s.cta} style={{ color: c.accentColor }}>
              {c.cta}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
