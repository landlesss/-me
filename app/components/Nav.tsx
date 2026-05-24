import s from "./Nav.module.scss";

export default function Nav() {
  return (
    <nav className={s.nav}>
      <div className={s.logo}>Your Name</div>
      <div className={s.links}>
        <a href="#projects" className={s.link}>Projects</a>
        <a href="#contacts" className={s.link}>Contact</a>
      </div>
    </nav>
  );
}
