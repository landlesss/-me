import s from "./About.module.scss";

export default function About() {
  return (
    <section className={s.section}>
      <div className={s.title}>About</div>
      <p className={s.text}>
        I&apos;m a Frontend Engineer who genuinely enjoys the craft — not just shipping
        features, but understanding how things work under the hood. Back in 2020 I started
        reading other people&apos;s source code to sharpen my own style. That habit never left me.
      </p>
      <p className={s.text}>
        I specialize in real-time interfaces and AI-powered products — WebSockets, LLM
        streaming, things that feel alive. I care about performance, clean architecture,
        and the small details that make an interface feel right.
      </p>
    </section>
  );
}
