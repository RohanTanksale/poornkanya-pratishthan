"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  branches: number;
  members: number;
  label: string;
};

function CountUp({ value, label }: { value: number; label: string }) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(value);
      return;
    }

    let frame = 0;
    let start: number | null = null;
    const duration = 1800;

    const animate = (time: number) => {
      if (start === null) start = time;
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setCount(Math.round(eased * value));

      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible, value]);

  return (
    <strong ref={ref} aria-label={`${value} ${label}`}>
      {count.toLocaleString("en-IN")}+
    </strong>
  );
}

export function HistoricalFigures({ branches, members, label }: Props) {
  return (
    <section className="historical-figures section-pad">
      <p className="eyebrow">{label}</p>
      <div className="historical-figure-grid">
        <article>
          <CountUp value={branches} label="historical branches" />
          <span>Branches established during the initial phase</span>
        </article>
        <article>
          <CountUp value={members} label="historical members" />
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
