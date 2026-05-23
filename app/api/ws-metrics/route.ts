import { NextRequest } from "next/server";

export const runtime = "edge";

// Simulates real-time metrics streaming via SSE (WebSocket fallback for Edge)
function generateMetrics(t: number) {
  const base = {
    activeUsers: Math.round(1200 + 300 * Math.sin(t * 0.05) + Math.random() * 80),
    rps: Math.round(840 + 200 * Math.sin(t * 0.08 + 1) + Math.random() * 50),
    latency: +(28 + 12 * Math.sin(t * 0.12 + 2) + Math.random() * 5).toFixed(1),
    errorRate: +(0.12 + 0.06 * Math.sin(t * 0.07) + Math.random() * 0.03).toFixed(3),
    cpuLoad: +(34 + 18 * Math.sin(t * 0.06 + 0.5) + Math.random() * 6).toFixed(1),
    memUsage: +(58 + 8 * Math.sin(t * 0.04 + 1.2) + Math.random() * 3).toFixed(1),
  };

  const history = Array.from({ length: 20 }, (_, i) => ({
    t: i,
    rps: Math.round(840 + 200 * Math.sin((t - 20 + i) * 0.08 + 1) + (Math.random() - 0.5) * 60),
    latency: +(28 + 12 * Math.sin((t - 20 + i) * 0.12 + 2) + Math.random() * 5).toFixed(1),
  }));

  const regions = [
    { name: "us-east-1", users: Math.round(420 + Math.random() * 40), status: "healthy" },
    { name: "eu-west-1", users: Math.round(310 + Math.random() * 30), status: "healthy" },
    { name: "ap-south-1", users: Math.round(280 + Math.random() * 35), status: Math.random() > 0.95 ? "degraded" : "healthy" },
    { name: "us-west-2", users: Math.round(190 + Math.random() * 20), status: "healthy" },
  ];

  return { ...base, history, regions, ts: Date.now() };
}

export async function GET(_req: NextRequest) {
  let tick = 0;
  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      try {
        while (true) {
          const data = generateMetrics(tick++);
          controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));
          await new Promise((r) => setTimeout(r, 500));
        }
      } catch {
        controller.close();
      }
    },
    cancel() {},
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
