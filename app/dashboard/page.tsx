"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MetricCard from "../components/dashboard/MetricCard";
import MiniChart from "../components/dashboard/MiniChart";
import RegionCard from "../components/dashboard/RegionCard";
import s from "../components/dashboard/dashboard.module.scss";

type Metrics = {
  activeUsers: number;
  rps: number;
  latency: number;
  errorRate: number;
  cpuLoad: number;
  memUsage: number;
  history: { t: number; rps: number; latency: number }[];
  regions: { name: string; users: number; status: string }[];
};

type ConnState = "connecting" | "connected" | "error";

const CONN_COLOR: Record<ConnState, string> = {
  connecting: "#eab308",
  connected:  "#22c55e",
  error:      "#ef4444",
};

const CONN_LABEL: Record<ConnState, string> = {
  connecting: "Connecting…",
  connected:  "Live",
  error:      "Reconnecting…",
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
        } catch { /* ignore */ }
      };
      es.onerror = () => {
        if (!active) return;
        setConnState("error");
        es.close();
        setTimeout(connect, 3000);
      };
    }

    connect();
    return () => { active = false; esRef.current?.close(); };
  }, []);

  const connColor = CONN_COLOR[connState];
  const connLabel = CONN_LABEL[connState];

  return (
    <div className={s.page}>
      <div className={s.inner}>
        {/* Header */}
        <header className={s.header}>
          <div className={s.headerLeft}>
            <Link href="/" className="ghost-btn" style={{ padding: "8px 14px" }}>← Back</Link>
            <div className={s.divider} />
            <div className={s.headerMeta}>
              <div className={s.headerIcon}>◈</div>
              <div>
                <div className={s.headerTitle}>Real-Time Dashboard</div>
                <div className={s.headerSub}>SSE · 500ms updates · Edge runtime</div>
              </div>
            </div>
          </div>
          <div className={s.headerRight}>
            <div className={s.updateCount}>
              <div className={s.updateCountLabel}>Updates received</div>
              <div className={s.updateCountValue}>{updateCount}</div>
            </div>
            <div className={s.connBadge}>
              <div
                className={`${s.connDot} ${connState === "connected" ? s.connDotLive : ""}`}
                style={{ background: connColor }}
              />
              <span style={{ color: connColor }}>{connLabel}</span>
            </div>
          </div>
        </header>

        {/* Tech tags */}
        <div className={s.tags}>
          {["EventSource API", "SSE / WebSocket pattern", "requestAnimationFrame", "SVG Charts", "React useEffect"].map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>

        {!metrics ? (
          <div className={s.loading}>
            <div className={s.loadingIcon}>⟳</div>
            Connecting to data stream…
          </div>
        ) : (
          <>
            {/* Metric cards */}
            <div className={s.metricsGrid}>
              <MetricCard label="Active Users"    value={metrics.activeUsers}        unit=""  color="#818cf8" />
              <MetricCard label="Requests / sec"  value={metrics.rps}                unit=""  color="#a78bfa" />
              <MetricCard label="P50 Latency"     value={metrics.latency}            unit=" ms" color="#22c55e" decimals={1} />
              <MetricCard label="Error Rate"      value={metrics.errorRate * 100}    unit="%" color={metrics.errorRate > 0.15 ? "#ef4444" : "#eab308"} decimals={2} />
              <MetricCard label="CPU Load"        value={metrics.cpuLoad}            unit="%" color="#f97316" decimals={1} />
              <MetricCard label="Memory"          value={metrics.memUsage}           unit="%" color="#06b6d4" decimals={1} />
            </div>

            {/* Charts */}
            <div className={s.chartsGrid}>
              <div className={s.chartCard}>
                <div className={s.chartLabel}>Requests / sec — last 40 ticks</div>
                <MiniChart data={rpsHistory} color="#818cf8" height={80} />
              </div>
              <div className={s.chartCard}>
                <div className={s.chartLabel}>Latency (ms) — last 40 ticks</div>
                <MiniChart data={latHistory} color="#22c55e" height={80} />
              </div>
            </div>

            {/* Regions */}
            <div className={s.regionsCard}>
              <div className={s.regionsLabel}>Region breakdown</div>
              <div className={s.regionsGrid}>
                {metrics.regions.map((r) => (
                  <RegionCard
                    key={r.name}
                    name={r.name}
                    users={r.users}
                    status={r.status}
                    totalUsers={metrics.activeUsers}
                  />
                ))}
              </div>
            </div>

            {/* Note */}
            <div className={s.note}>
              <span className={s.noteIcon}>ℹ</span>
              <span>
                Data is synthetic but the transport is real — Server-Sent Events over an Edge function,
                consumed with the native <code>EventSource</code> API.
                In production (STATEIS), this pattern drives live metrics for video rooms and user feeds.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
