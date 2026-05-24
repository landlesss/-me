import s from "./Contacts.module.scss";

const LINKS = [
  { label: "Email",    href: "mailto:alaskalaska22@gmail.com", text: "alaskalaska22@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com",     text: "linkedin.com/in/yourname" },
  { label: "GitHub",   href: "https://github.com",       text: "github.com/landlesss" },
  { label: "CV",       href: "/cv.pdf",                  text: "Download PDF", download: true },
];

export default function Contacts() {
  return (
    <section id="contacts" className={s.section}>
      <div className={s.title}>Contacts</div>

      <div className={s.list}>
        {LINKS.map(({ label, href, text, download }) => (
          <a
            key={label}
            href={href}
            className={s.link}
            target={download ? undefined : "_blank"}
            rel={download ? undefined : "noopener noreferrer"}
            download={download}
          >
            <span className={s.linkLabel}>{label}</span>
            <span>{text}</span>
          </a>
        ))}
      </div>

      <div className={s.footer}>© 2025 · Built with Next.js, deployed on Vercel</div>
    </section>
  );
}
