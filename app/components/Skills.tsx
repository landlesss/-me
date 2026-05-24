import s from "./Skills.module.scss";

const SKILLS = [
  "React", "Next.js", "TypeScript", "JavaScript",
  "WebSockets", "HTTP Streaming", "SSE",
  "Redux Toolkit", "React Query", "Zustand",
  "Node.js", "REST", "AI tools",
  "Firebase", "Agora RTC", "Vercel",
  "SCSS", "Tailwind CSS",
];

export default function Skills() {
  return (
    <section className={s.section}>
      <div className={s.title}>Skills</div>
      <div className={s.tags}>
        {SKILLS.map((skill) => (
          <span key={skill} className="tag">{skill}</span>
        ))}
      </div>
    </section>
  );
}
