import s from "./SkillsTicker.module.scss";

const SKILLS = [
  "React", "Next.js", "TypeScript", "WebSockets", "LLM Integration",
  "Streaming APIs", "Redux Toolkit", "React Query", "Firebase", "Vercel",
  "Agora RTC", "REST / GraphQL", "Tailwind CSS", "Node.js",
];

export default function SkillsTicker() {
  const items = [...SKILLS, ...SKILLS];

  return (
    <div className={s.wrap}>
      <div className={s.track}>
        {items.map((skill, i) => (
          <span key={i} className={s.item}>
            {skill}
            <span className={s.dot}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
