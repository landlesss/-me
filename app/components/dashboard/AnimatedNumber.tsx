"use client";
import { useEffect, useRef, useState } from "react";

type Props = { value: number; decimals?: number };

export default function AnimatedNumber({ value, decimals = 0 }: Props) {
  const [displayed, setDisplayed] = useState(value);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = displayed;
    const end = value;
    const duration = 350;
    const startTime = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayed(start + (end - start) * ease);
      if (t < 1) raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [value]); // eslint-disable-line

  return <>{displayed.toFixed(decimals)}</>;
}
