"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import MessageBubble, { type Message } from "../components/chat/MessageBubble";
import ChatInput from "../components/chat/ChatInput";
import s from "../components/chat/chat.module.scss";

const SUGGESTIONS = [
  "How does token streaming work?",
  "Tell me about WebSockets",
  "What's your tech stack?",
];

const INITIAL: Message = {
  id: 0,
  role: "assistant",
  content: "Hey! I'm a streaming chat demo. Each word you see is a separate token arriving in real time — no buffering. Try asking about streaming, WebSockets, or just say hi 👋",
};

let msgId = 1;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
              prev.map((m) => m.id === assistantId ? { ...m, content: m.content + token } : m)
            );
          } catch { /* ignore parse errors */ }
        }
      }

      setMessages((prev) =>
        prev.map((m) => m.id === assistantId ? { ...m, streaming: false } : m)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.layout}>
      {/* Header */}
      <header className={s.header}>
        <div className={s.headerLeft}>
          <Link href="/" className="ghost-btn" style={{ padding: "8px 14px" }}>← Back</Link>
          <div className={s.divider} />
          <div className={s.headerMeta}>
            <div className={s.headerIcon}>✦</div>
            <div>
              <div className={s.headerTitle}>LLM Streaming Chat</div>
              <div className={s.headerSub}>Token-by-token · Edge runtime · SSE</div>
            </div>
          </div>
        </div>
        <div className={s.statusLabel}>
          <div className="live-dot" />
          {loading ? "Streaming…" : "Ready"}
        </div>
      </header>

      {/* Tech tags */}
      <div className={s.tags}>
        {["Next.js Edge Runtime", "Server-Sent Events", "ReadableStream API", "React useState"].map((t) => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      {/* Messages */}
      <div className={s.messages}>
        {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className={s.suggestions}>
          {SUGGESTIONS.map((text) => (
            <button key={text} className={s.suggestion} onClick={() => sendMessage(text)}>
              {text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <ChatInput value={input} loading={loading} onChange={setInput} onSend={() => sendMessage()} />
    </div>
  );
}
