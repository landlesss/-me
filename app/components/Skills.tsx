import s from "./Skills.module.scss";

const SKILLS = [
  "React", "Next.js", "Vue.js", "TypeScript", "JavaScript",
  "WebSockets", "HTTP Streaming", "SSE",
  "Redux Toolkit", "TanStack Query", "MobX", "Pinia", "Zustand",
  "REST API", "GraphQL",
  "Jest", "React Testing Library", "Cypress",
  "Vite", "Tailwind CSS", "CSS Modules", "SCSS",
  "Node.js", "Firebase", "Agora RTC", "Vercel",
  "GitHub", "GitLab", "Sentry",
  "SOLID", "DRY", "AI tools",
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
