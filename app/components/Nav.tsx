import s from "./Nav.module.scss";

export default function Nav() {
  return (
    <nav className={s.nav}>
      <div className={s.logo}>
        <span className={s.logoAccent}>dev</span>
        <span className={s.logoDim}>.portfolio</span>
      </div>
      <div className={s.actions}>
        <a href="#cases" className="ghost-btn">Cases</a>
        <a href="mailto:hello@example.com" className="glow-btn">Hire me</a>
      </div>
    </nav>
  );
}
