import s from "./Hero.module.scss";

export default function Hero() {
  return (
    <section className={s.hero}>
      <h1 className={`${s.name} fade-up`}>
        Sara Landau
      </h1>

      <p className={`${s.subtitle} fade-up-2`}>
        Frontend Engineer
        <span>·</span>
        React / TypeScript
        <span>·</span>
        Real-time &amp; AI interfaces
      </p>

      <div className={`${s.actions} fade-up-3`}>
        <a href="#projects" className="glow-btn">View projects</a>
        <a href="#contacts" className="ghost-btn">Contact me</a>
        <a
          href="/cv.pdf"
          download
          className={s.cvLink}
        >
          ↓ CV
        </a>
      </div>
    </section>
  );
}
