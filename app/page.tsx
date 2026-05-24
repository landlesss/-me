import Nav from "./components/Nav";
import Hero from "./components/Hero";
import SkillsTicker from "./components/SkillsTicker";
import CaseCards from "./components/CaseCard";
import About from "./components/About";

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
      <Nav />
      <Hero />
      <SkillsTicker />
      <CaseCards />
      <About />
      <footer style={{
        borderTop: "1px solid #22223a",
        padding: "32px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#9090a8",
        fontSize: 13,
      }}>
        <span>© 2025 · Built with Next.js &amp; deployed on Vercel</span>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9090a8", textDecoration: "none" }}>GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9090a8", textDecoration: "none" }}>LinkedIn</a>
          <a href="mailto:hello@example.com" style={{ color: "#9090a8", textDecoration: "none" }}>Email</a>
        </div>
      </footer>
    </div>
  );
}
