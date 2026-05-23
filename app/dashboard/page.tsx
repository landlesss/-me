"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Metrics = {
  activeUsers: number;
  rps: number;
  latency: number;
  errorRate: number;
  cpuLoad: number;
  memUsage: number;
  history: { t: number; rps: number; latency: number }[];
  regions: { name: string; users: number; status: string }[];
  ts: number;
};

type ConnState = "connecting" | "connected" | "error";

function MiniChart({ data, color, height = 56 }: { data: number[]; color: string; height?: number }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data) || 1;
  const W = 200, H = height;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / (max - min + 0.001)) * H}`)
    .join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polygon
        points={`0,${H} ${pts} ${W},${H}`}
        fill={`url(#grad-${color.replace("#", "")})`}
      />
    </svg>
  );
}

function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [displayed, setDisplayed] = useState(value);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = displayed;
    const end = value;
    const duration = 350;
    const startTime = performance.now();
    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayed(start + (end - start) * ease);
      if (t < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [value]); // eslint-disable-line

  return <>{displayed.toFixed(decimals)}</>;
}

const REGIONS_LABEL: Record<string, string> = {
  "us-east-1": "🇺🇸 US East",
  "eu-west-1": "🇪🇺 EU West",
  "ap-south-1": "🇮🇳 AP South",
  "us-west-2": "🇺🇸 US West",
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [connState, setConnState] = useState<ConnState>("connecting");
  const [rpsHistory, setRpsHistory] = useState<number[]>([]);
  const [latHistory, setLatHistory] = useState<number[]>([]);
  const [updateCount, setUpdateCount] = useState(0);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let active = true;

    function connect() {
      setConnState("connecting");
      const es = new EventSource("/api/ws-metrics");
      esRef.current = es;

      es.onopen = () => { if (active) setConnState("connected"); };

      es.onmessage = (e) => {
        if (!active) return;
        try {
          const data: Metrics = JSON.parse(e.data);
          setMetrics(data);
          setRpsHistory((h) => [...h.slice(-39), data.rps]);
          setLatHistory((h) => [...h.slice(-39), data.latency]);
          setUpdateCount((c) => c + 1);
        } catch {}
      };

      es.onerror = () => {
        if (!active) return;
        setConnState("error");
        es.close();
        setTimeout(connect, 3000);
      };
    }

    connect();
    return () => {
      active = false;
      esRef.current?.close();
    };
  }, []);

  const connColor = { connecting: "#eab308", connected: "#22c55e", error: "#ef4444" }[connState];
  const connLabel = { connecting: "Connecting…", connected: "Live", error: "Reconnecting…" }[connState];

  return (
    <div style={{ minHeight: "100dvh", background: "#0a0a0f", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>

        {/* HEADER */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 0", borderBottom: "1px solid #22223a",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" style={{ color: "#9090a8", textDecoration: "none", fontSize: 13 }}>← Back</Link>
            <div style={{ width: 1, height: 16, background: "#22223a" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10, background: "rgba(139,92,246,0.15)",
                border: "1px solid rgba(139,92,246,0.3)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16,
              }}>◈</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Real-Time Dashboard</div>
                <div style={{ color: "#9090a8", fontSize: 11 }}>SSE · 500ms updates · Edge runtime</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 2 }}>
              <span style={{ fontSize: 11, color: "#9090a8" }}>Updates received</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#a78bfa", fontVariantNumeric: "tabular-nums" }}>{updateCount}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#13131a", border: "1px solid #22223a", borderRadius: 20, padding: "6px 14px" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: connColor, animation: connState === "connected" ? "pulseDot 1.8s ease-in-out infinite" : "none" }} />
              <span style={{ fontSize: 12, color: connColor, fontWeight: 600 }}>{connLabel}</span>
            </div>
          </div>
        </header>

        {/* TECH TAGS */}
        <div style={{ display: "flex", gap: 8, padding: "12px 0", overflowX: "auto" }}>
          {["EventSource API", "SSE / WebSocket pattern", "requestAnimationFrame", "SVG Charts", "React useEffect"].map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        {!metrics ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9090a8" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⟳</div>
            Connecting to data stream…
          </div>
        ) : (
          <>
            {/* MAIN METRICS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginTop: 24 }}>
              {[
                { label: "Active Users", value: metrics.activeUsers, unit: "", color: "#818cf8", decimals: 0 },
                { label: "Requests / sec", value: metrics.rps, unit: "", color: "#a78bfa", decimals: 0 },
                { label: "P50 Latency", value: metrics.latency, unit: " ms", color: "#22c55e", decimals: 1 },
                { label: "Error Rate", value: metrics.errorRate * 100, unit: "%", color: metrics.errorRate > 0.15 ? "#ef4444" : "#eab308", decimals: 2 },
                { label: "CPU Load", value: metrics.cpuLoad, unit: "%", color: "#f97316", decimals: 1 },
                { label: "Memory", value: metrics.memUsage, unit: "%", color: "#06b6d4", decimals: 1 },
              ].map(({ label, value, unit, color, decimals }) => (
                <div key={label} style={{
                  background: "#13131a", border: "1px solid #22223a", borderRadius: 16,
                  padding: "20px", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ fontSize: 11, color: "#9090a8", marginBottom: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, color, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.5px" }}>
                    <AnimatedNumber value={value} decimals={decimals} />{unit}
                  </div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `${color}30` }}>
                    <div style={{
                      height: "100%", background: color, borderRadius: 2,
                      width: `${Math.min(100, value)}%`,
                      transition: "width 0.5s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>

            {/* CHARTS ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
              {[
                { label: "Requests / sec — last 40 ticks", data: rpsHistory, color: "#818cf8" },
                { label: "Latency (ms) — last 40 ticks", data: latHistory, color: "#22c55e" },
              ].map(({ label, data, color }) => (
                <div key={label} style={{ background: "#13131a", border: "1px solid #22223a", borderRadius: 16, padding: 20 }}>
                  <div style={{ fontSize: 11, color: "#9090a8", marginBottom: 16, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                  <MiniChart data={data} color={color} height={80} />
                </div>
              ))}
            </div>

            {/* REGIONS */}
            <div style={{ marginTop: 16, background: "#13131a", border: "1px solid #22223a", borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 11, color: "#9090a8", marginBottom: 20, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Region breakdown
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {metrics.regions.map((r) => {
                  const pct = (r.users / metrics.activeUsers) * 100;
                  const statusColor = r.status === "healthy" ? "#22c55e" : "#ef4444";
                  return (
                    <div key={r.name} style={{ background: "#0a0a0f", borderRadius: 12, padding: 16, border: "1px solid #22223a" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{REGIONS_LABEL[r.name] ?? r.name}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 600, color: statusColor,
                          background: `${statusColor}15`, padding: "2px 8px", borderRadius: 10,
                          textTransform: "uppercase", letterSpacing: "0.04em",
                        }}>
                          {r.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#a78bfa", fontVariantNumeric: "tabular-nums", marginBottom: 8 }}>
                        <AnimatedNumber value={r.users} />
                      </div>
                      <div style={{ height: 4, background: "#22223a", borderRadius: 2 }}>
                        <div style={{
                          height: "100%", borderRadius: 2,
                          background: "linear-gradient(to right, #6366f1, #a78bfa)",
                          width: `${pct}%`, transition: "width 0.5s ease",
                        }} />
                      </div>
                      <div style={{ fontSize: 11, color: "#9090a8", marginTop: 4 }}>{pct.toFixed(1)}% of traffic</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM NOTE */}
            <div style={{
              marginTop: 20, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 12, padding: "14px 20px", fontSize: 13, color: "#9090a8", display: "flex", gap: 12,
            }}>
              <span style={{ color: "#818cf8", flexShrink: 0 }}>ℹ</span>
              <span>
                Data is synthetic but the transport is real — Server-Sent Events over an Edge function,
                consumed with the native <code style={{ color: "#a5b4fc", background: "#1e1e2e", padding: "1px 5px", borderRadius: 4 }}>EventSource</code> API.
                In production (STATEIS), this pattern drives live metrics for video rooms and user feeds.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
