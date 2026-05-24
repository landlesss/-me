import Nav from "./components/Nav";
import Hero from "./components/Hero";
import CaseCards from "./components/CaseCard";
import About from "./components/About";
import Skills from "./components/Skills";
import Contacts from "./components/Contacts";

export default function Home() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
      <Nav />
      <Hero />
      <CaseCards />
      <About />
      <Skills />
      <Contacts />
    </div>
  );
}
