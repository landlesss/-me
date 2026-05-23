import { NextRequest } from "next/server";

export const runtime = "edge";

// Demo responses — simulates an LLM without requiring an API key
const DEMO_RESPONSES: Record<string, string> = {
  default: `Sure! I'm a **streaming chat demo** built with Next.js Edge API Routes and Server-Sent Events.

Each token arrives individually — no waiting for the full response. This is exactly how production LLM interfaces work: the server streams partial text as it's generated, and the client appends it in real time.

**How it works technically:**
- The API route runs on the Edge runtime
- Uses \`ReadableStream\` + \`TextEncoder\` to push tokens
- The client reads a \`fetch\` response with \`getReader()\`
- React state updates on each chunk

This pattern was built for **STATEIS** — a real-time social platform where AI responses needed to feel instant, not batch-loaded.

Want to ask me something specific about the architecture?`,

  hello: `Hey! 👋 I'm the AI assistant in this portfolio demo.

I'm running on a **streaming API** — you're seeing my response token by token, not all at once. Pretty cool, right?

This was one of my favourite features to build at STATEIS. The trick is keeping the UI feeling snappy: the loading indicator disappears the moment the first byte arrives, and from there the text just flows in.

What would you like to know?`,

  streaming: `Great question! **Token streaming** works like this:

1. **Server side** — the LLM (or in this demo, a timer) writes chunks to a \`ReadableStream\`
2. **Transport** — the browser receives them via \`fetch\` with \`response.body.getReader()\`
3. **Client side** — each chunk is decoded and appended to the displayed text

The key advantage is **perceived performance**: users see content immediately instead of waiting 3-5 seconds for the full response. First-token latency is what matters.

In production (STATEIS), we also handle:
- **Abort signals** — cancel mid-stream when user navigates away
- **Error recovery** — reconnect on dropped connections
- **Markdown rendering** — parse partial markdown without breaking the UI`,

  websocket: `WebSockets are brilliant for dashboards! Here's why I chose them over polling:

**Polling** (the old way):
- Client asks server "any updates?" every N seconds
- Wasteful, adds latency, hammers the server

**WebSockets** (the right way):
- Single persistent TCP connection
- Server *pushes* data the moment it changes
- ~500ms update cycles with minimal overhead

In the **Real-time Dashboard** demo (check the other case), the server pushes metric updates every 500ms. The client just listens and updates React state — no requests, no polling loops.

The connection state machine is the tricky part: handling reconnects, backoff, and showing the user meaningful status (connecting → connected → reconnecting).`,
};

function pickResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) return DEMO_RESPONSES.hello;
  if (lower.includes("stream") || lower.includes("token") || lower.includes("sse")) return DEMO_RESPONSES.streaming;
  if (lower.includes("websocket") || lower.includes("dashboard") || lower.includes("real-time")) return DEMO_RESPONSES.websocket;
  return DEMO_RESPONSES.default;
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const response = pickResponse(message ?? "");
  const tokens = response.split(/(?<=\s)|(?=\s)/); // split preserving spaces

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      for (const token of tokens) {
        controller.enqueue(enc.encode(`data: ${JSON.stringify({ token })}\n\n`));
        // Randomise delay to mimic real LLM cadence
        await new Promise((r) => setTimeout(r, 20 + Math.random() * 40));
      }
      controller.enqueue(enc.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
