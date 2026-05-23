"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const SKILLS = [
  "React", "Next.js", "TypeScript", "WebSockets", "LLM Integration",
  "Streaming APIs", "Redux Toolkit", "React Query", "Firebase", "Vercel",
  "Agora RTC", "REST / GraphQL", "Tailwind CSS", "Node.js",
];

const CASES = [
  {
    href: "/chat",
    icon: "✦",
    accentColor: "#818cf8",
    label: "Live Demo",
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
    label: "Live Demo",
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

function TypingText({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else {
      setDeleting(false);
      setIdx((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, words]);

  return (
    <span className="gradient-text cursor-blink">{displayed || " "}</span>
  );
}

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

      {/* NAV */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "24px 0", borderBottom: "1px solid #22223a",
      }}>
        <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px" }}>
          <span className="gradient-text">dev</span>
          <span style={{ color: "#9090a8" }}>.portfolio</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="#cases" className="ghost-btn" style={{ padding: "8px 16px" }}>Cases</a>
          <a href="mailto:hello@example.com" className="glow-btn" style={{ padding: "8px 18px" }}>
            Hire me
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: "80px 0 64px" }}>
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div className="live-dot" />
          <span style={{ color: "#9090a8", fontSize: 13 }}>Open to work · Remote</span>
        </div>

        <h1 className="fade-up-2" style={{
          fontSize: "clamp(38px, 7vw, 64px)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-1.5px",
          marginBottom: 8,
        }}>
          Frontend Developer
        </h1>
        <h1 className="fade-up-3" style={{
          fontSize: "clamp(38px, 7vw, 64px)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-1.5px",
          marginBottom: 32,
        }}>
          who ships{" "}
          <TypingText words={["real-time UIs", "LLM products", "streaming apps", "WS dashboards"]} />
        </h1>

        <p className="fade-up-4" style={{
          fontSize: 17,
          color: "#9090a8",
          maxWidth: 520,
          lineHeight: 1.75,
          marginBottom: 40,
        }}>
          I build production-grade interfaces for complex backends — live data, AI chat,
          video conferencing. Currently{" "}
          <span style={{ color: "#e8e8f0" }}>STATEIS</span> — a real-time social platform
          with video, chat and AI features.
        </p>

        <div className="fade-up-5" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="#cases" className="glow-btn">
            View case studies ↓
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ghost-btn"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ghost-btn"
          >
            LinkedIn
          </a>
        </div>
      </section>

      {/* SKILLS TICKER */}
      <div className="ticker-wrap" style={{ marginBottom: 80, padding: "4px 0" }}>
        <div className="ticker-track">
          {[...SKILLS, ...SKILLS].map((skill, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 20,
              padding: "0 20px", color: "#9090a8", fontSize: 13, fontWeight: 500,
            }}>
              {skill}
              <span style={{ color: "#2a2a3a", fontSize: 18 }}>·</span>
            </span>
          ))}
        </div>
      </div>

      {/* CASES */}
      <section id="cases" style={{ paddingBottom: 100 }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 8, padding: "6px 14px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 11, color: "#818cf8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Case Studies
            </span>
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.8px", lineHeight: 1.2 }}>
            Production demos,<br />
            <span className="gradient-text">click to explore</span>
          </h2>
        </div>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
          {CASES.map((c) => (
            <Link key={c.href} href={c.href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: 32, height: "100%", display: "flex", flexDirection: "column", gap: 20 }}>

                {/* top row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, display: "flex",
                    alignItems: "center", justifyContent: "center", fontSize: 22,
                    background: `${c.accentColor}18`, border: `1px solid ${c.accentColor}30`,
                    color: c.accentColor,
                  }}>
                    {c.icon}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="live-dot" />
                    <span style={{ fontSize: 12, color: "#9090a8" }}>{c.label}</span>
                  </div>
                </div>

                {/* title */}
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px", marginBottom: 10 }}>
                    {c.title}
                  </h3>
                  <p style={{ color: "#9090a8", fontSize: 14, lineHeight: 1.7 }}>{c.desc}</p>
                </div>

                {/* metrics */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: 12, background: "#0a0a0f", borderRadius: 12,
                  padding: 16, border: "1px solid #22223a",
                }}>
                  {c.metrics.map((m) => (
                    <div key={m.label}>
                      <div style={{ fontSize: 12, color: "#9090a8", marginBottom: 2 }}>{m.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: c.accentColor }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {c.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                </div>

                {/* cta */}
                <div style={{ marginTop: "auto", paddingTop: 4 }}>
                  <span style={{
                    color: c.accentColor, fontSize: 14, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    {c.cta}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section style={{
        borderTop: "1px solid #22223a", padding: "80px 0",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60,
      }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 20 }}>
            About me
          </h2>
          <p style={{ color: "#9090a8", lineHeight: 1.8, fontSize: 15, marginBottom: 16 }}>
            I focus on the hardest part of frontend: state that changes fast.
            Video feeds, live messages, AI tokens — I make them feel instant.
          </p>
          <p style={{ color: "#9090a8", lineHeight: 1.8, fontSize: 15 }}>
            At STATEIS I built the entire client stack from scratch — live video (Agora RTC),
            real-time chat (WebSockets), and AI-powered features with streaming responses.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { icon: "⚡", label: "Real-time first", desc: "WebSockets, SSE, long-polling — I pick the right tool for the latency budget" },
            { icon: "🤖", label: "LLM integration", desc: "Streaming responses, tool-use, context management in production apps" },
            { icon: "🏗", label: "Clean architecture", desc: "Feature-Sliced Design, React Query + Redux, testable by design" },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", gap: 16, padding: 20,
              background: "#13131a", border: "1px solid #22223a", borderRadius: 14,
            }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 14 }}>{item.label}</div>
                <div style={{ color: "#9090a8", fontSize: 13, lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid #22223a", padding: "32px 0",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: "#9090a8", fontSize: 13,
      }}>
        <span>© 2025 · Built with Next.js &amp; deployed on Vercel</span>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            style={{ color: "#9090a8", textDecoration: "none" }}>GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
            style={{ color: "#9090a8", textDecoration: "none" }}>LinkedIn</a>
          <a href="mailto:hello@example.com"
            style={{ color: "#9090a8", textDecoration: "none" }}>Email</a>
        </div>
      </footer>
    </div>
  );
}
