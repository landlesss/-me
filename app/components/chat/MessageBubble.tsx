import s from "./chat.module.scss";

export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
};

function renderContent(text: string) {
  return text.split("\n").map((line, i, arr) => {
    let remaining = line
      .replace(/\*\*(.+?)\*\*/g, "__BOLD__$1__BOLD__")
      .replace(/`([^`]+)`/g, "__CODE__$1__CODE__");

    const segments = remaining.split(/(__BOLD__|__CODE__)/);
    let bold = false, code = false;
    const parts = segments.map((seg, k) => {
      if (seg === "__BOLD__") { bold = !bold; return null; }
      if (seg === "__CODE__") { code = !code; return null; }
      if (bold) return <strong key={k}>{seg}</strong>;
      if (code) return <code key={k}>{seg}</code>;
      return <span key={k}>{seg}</span>;
    });

    return (
      <span key={i}>
        {parts}
        {i < arr.length - 1 && "\n"}
      </span>
    );
  });
}

export default function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";

  return (
    <div className={isUser ? `${s.row} ${s.rowUser}` : `${s.row} ${s.rowAssistant}`}>
      {!isUser && (
        <div className={s.assistantIcon}>✦</div>
      )}
      <div className={isUser ? `${s.bubble} ${s.bubbleUser}` : `${s.bubble} ${s.bubbleAssistant}`}>
        {isUser ? msg.content : renderContent(msg.content)}

        {msg.streaming && msg.content && (
          <span className={s.cursor} />
        )}
        {msg.streaming && !msg.content && (
          <span className={s.typingDots}>
            <span className={s.dot} />
            <span className={s.dot} />
            <span className={s.dot} />
          </span>
        )}
      </div>
    </div>
  );
}
