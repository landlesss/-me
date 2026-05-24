import { useRef } from "react";
import s from "./chat.module.scss";

type Props = {
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onSend: () => void;
};

export default function ChatInput({ value, loading, onChange, onSend }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div className={s.inputArea}>
      <div className={s.inputBox}>
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about streaming, WebSockets, the stack…"
          disabled={loading}
          rows={1}
          className={s.textarea}
        />
        <button
          onClick={onSend}
          disabled={!value.trim() || loading}
          className="glow-btn"
          style={{ padding: "8px 16px", flexShrink: 0, alignSelf: "flex-end" }}
        >
          {loading ? "…" : "↑"}
        </button>
      </div>
      <p className={s.inputNote}>
        Demo mode — simulated streaming · In production, replace with Claude / OpenAI API
      </p>
    </div>
  );
}
