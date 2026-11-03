"use client";

import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }

    const duration = 1800;
    let frame = 0;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setCount(Math.floor(eased * target));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [started, target]);

  return <span ref={ref}>{count.toLocaleString("en-IN")}+</span>;
}

export function HistoricalFigures() {
  return (
    <section className="historical-figures section-pad">
      <p className="eyebrow">
        Historical figures from the organisation's initial phase
      </p>

      <div className="historical-figure-grid">
        <article>
          <strong><AnimatedNumber target={30} /></strong>
          <span>Branches established during the initial phase</span>
        </article>

        <article>
          <strong><AnimatedNumber target={500} /></strong>
          <span>Members associated during the initial phase</span>
        </article>
      </div>

      <p className="historical-stat-note">
        These are historical figures, not current statistics. Current branch
        addresses and contact details will be published once verified.
      </p>
    </section>
  );
}