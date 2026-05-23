"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

const SUGGESTIONS = [
  "How does token streaming work?",
  "Tell me about WebSockets",
  "What's your tech stack?",
];

let msgId = 0;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: msgId++,
      role: "assistant",
      content: "Hey! I'm a streaming chat demo. Each word you see is a separate token arriving in real time — no buffering. Try asking about streaming, WebSockets, or just say hi 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setInput("");

    const userMsg: Message = { id: msgId++, role: "user", content: msg };
    const assistantId = msgId++;
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "", streaming: true };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += dec.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);
          if (data === "[DONE]") break;
          try {
            const { token } = JSON.parse(data);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + token } : m
              )
            );
          } catch {}
        }
      }
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function renderContent(text: string) {
    // Simple markdown: bold, code blocks, inline code
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const parts: React.ReactNode[] = [];
      let remaining = line;
      let key = 0;

      // bold
      remaining = remaining.replace(/\*\*(.+?)\*\*/g, (_, t) => `__BOLD__${t}__BOLD__`);
      // inline code
      remaining = remaining.replace(/`([^`]+)`/g, (_, t) => `__CODE__${t}__CODE__`);

      const segments = remaining.split(/(__BOLD__|__CODE__)/);
      let bold = false, code = false;
      for (const seg of segments) {
        if (seg === "__BOLD__") { bold = !bold; continue; }
        if (seg === "__CODE__") { code = !code; continue; }
        if (bold) parts.push(<strong key={key++}>{seg}</strong>);
        else if (code) parts.push(<code key={key++} style={{ background: "#1e1e2e", padding: "1px 6px", borderRadius: 4, fontSize: "0.9em", color: "#a5b4fc" }}>{seg}</code>);
        else parts.push(<span key={key++}>{seg}</span>);
      }

      const isHeader = line.startsWith("**") && line.endsWith("**");
      return (
        <span key={i}>
          {isHeader ? <><br />{parts}<br /></> : parts}
          {i < lines.length - 1 && !isHeader && "\n"}
        </span>
      );
    });
  }

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", maxWidth: 800, margin: "0 auto", padding: "0 16px" }}>

      {/* HEADER */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 0", borderBottom: "1px solid #22223a", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ color: "#9090a8", textDecoration: "none", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            ← Back
          </Link>
          <div style={{ width: 1, height: 16, background: "#22223a" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16,
            }}>✦</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>LLM Streaming Chat</div>
              <div style={{ color: "#9090a8", fontSize: 11 }}>Token-by-token · Edge runtime · SSE</div>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="live-dot" />
          <span style={{ fontSize: 12, color: "#9090a8" }}>
            {loading ? "Streaming…" : "Ready"}
          </span>
        </div>
      </header>

      {/* TECH BADGES */}
      <div style={{ display: "flex", gap: 8, padding: "12px 0", flexShrink: 0, overflowX: "auto" }}>
        {["Next.js Edge Runtime", "Server-Sent Events", "ReadableStream API", "React useState"].map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 0", display: "flex", flexDirection: "column", gap: 20 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 12, marginRight: 10, flexShrink: 0, marginTop: 4,
              }}>✦</div>
            )}
            <div style={{
              maxWidth: "78%",
              background: msg.role === "user" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "#13131a",
              border: msg.role === "user" ? "none" : "1px solid #22223a",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
              padding: "12px 16px",
              fontSize: 14,
              lineHeight: 1.7,
              color: msg.role === "user" ? "#fff" : "#e8e8f0",
              whiteSpace: "pre-wrap",
            }}>
              {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
              {msg.streaming && msg.content && (
                <span style={{
                  display: "inline-block", width: 2, height: "1em",
                  background: "#6366f1", marginLeft: 2, verticalAlign: "middle",
                  animation: "blink 0.7s step-end infinite",
                }} />
              )}
              {msg.streaming && !msg.content && (
                <span style={{ color: "#9090a8", fontSize: 12 }}>
                  <span style={{ display: "inline-flex", gap: 4 }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "#6366f1", display: "inline-block",
                        animation: `pulseDot 1.2s ${i * 0.2}s ease-in-out infinite`,
                      }} />
                    ))}
                  </span>
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* SUGGESTIONS */}
      {messages.length <= 1 && (
        <div style={{ display: "flex", gap: 8, padding: "8px 0", flexShrink: 0, flexWrap: "wrap" }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              style={{
                background: "#13131a", border: "1px solid #22223a", color: "#9090a8",
                borderRadius: 20, padding: "7px 14px", fontSize: 13, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.borderColor = "#6366f1";
                (e.target as HTMLElement).style.color = "#e8e8f0";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.borderColor = "#22223a";
                (e.target as HTMLElement).style.color = "#9090a8";
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div style={{
        borderTop: "1px solid #22223a", padding: "16px 0 24px", flexShrink: 0,
      }}>
        <div style={{
          display: "flex", gap: 12, background: "#13131a",
          border: "1px solid #22223a", borderRadius: 16, padding: "12px 16px",
          transition: "border-color 0.2s",
        }}
          onFocus={() => { }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about streaming, WebSockets, the stack…"
            disabled={loading}
            rows={1}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: "#e8e8f0", fontSize: 14, resize: "none", lineHeight: 1.6,
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="glow-btn"
            style={{ padding: "8px 16px", flexShrink: 0, alignSelf: "flex-end" }}
          >
            {loading ? "…" : "↑"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 10, fontSize: 11, color: "#9090a8" }}>
          Demo mode — simulated streaming · In production, replace with Claude/OpenAI API
        </div>
      </div>
    </div>
  );
}
