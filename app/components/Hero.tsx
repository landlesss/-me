"use client";
import { useState, useEffect } from "react";
import s from "./Hero.module.scss";

const WORDS = ["real-time UIs", "LLM products", "streaming apps", "WS dashboards"];

function TypingText() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[idx];
    let t: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < word.length) {
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      t = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else {
      setDeleting(false);
      setIdx((i) => (i + 1) % WORDS.length);
    }

    return () => clearTimeout(t);
  }, [displayed, deleting, idx]);

  return <span className={s.gradientText}>{displayed || " "}</span>;
}

export default function Hero() {
  return (
    <section className={s.hero}>
      <div className={`${s.status} fade-up`}>
        <div className="live-dot" />
        <span>Open to work · Remote</span>
      </div>

      <h1 className={`${s.title} fade-up-2`}>Frontend Developer</h1>
      <h1 className={`${s.title} ${s.titleSub} fade-up-3`}>
        who ships <TypingText />
      </h1>

      <p className={`${s.description} fade-up-4`}>
        I build production-grade interfaces for complex backends — live data, AI chat,
        video conferencing. Currently <strong>STATEIS</strong> — a real-time social
        platform with video, chat and AI features.
      </p>

      <div className={`${s.actions} fade-up-5`}>
        <a href="#cases" className="glow-btn">View case studies ↓</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="ghost-btn">GitHub</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="ghost-btn">LinkedIn</a>
      </div>
    </section>
  );
}
