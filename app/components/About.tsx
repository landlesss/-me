import s from "./About.module.scss";

const ITEMS = [
  {
    icon: "⚡",
    title: "Real-time first",
    desc: "WebSockets, SSE, long-polling — I pick the right tool for the latency budget",
  },
  {
    icon: "🤖",
    title: "LLM integration",
    desc: "Streaming responses, tool-use, context management in production apps",
  },
  {
    icon: "🏗",
    title: "Clean architecture",
    desc: "Feature-Sliced Design, React Query + Redux, testable by design",
  },
];

export default function About() {
  return (
    <section className={s.section}>
      <div>
        <h2 className={s.title}>About me</h2>
        <p className={s.text}>
          I focus on the hardest part of frontend: state that changes fast.
          Video feeds, live messages, AI tokens — I make them feel instant.
        </p>
        <p className={s.text}>
          At STATEIS I built the entire client stack from scratch — live video (Agora RTC),
          real-time chat (WebSockets), and AI-powered features with streaming responses.
        </p>
      </div>

      <ul className={s.list}>
        {ITEMS.map((item) => (
          <li key={item.title} className={s.item}>
            <span className={s.itemIcon}>{item.icon}</span>
            <div>
              <div className={s.itemTitle}>{item.title}</div>
              <div className={s.itemDesc}>{item.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
