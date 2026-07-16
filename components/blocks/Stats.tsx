"use client";

import { useEffect, useRef, useState } from "react";
import type { StatsBlock } from "@/lib/types";

// Separa "2M" -> { num: 2, suffix: "M" }, "147" -> { num: 147, suffix: "" }.
function parseValue(value: string): { num: number | null; suffix: string } {
  const m = value.match(/^([\d.,]+)(.*)$/);
  if (!m) return { num: null, suffix: value };
  return { num: parseFloat(m[1].replace(/,/g, "")), suffix: m[2] };
}

function StatItem({ value, label, run }: { value: string; label: string; run: boolean }) {
  const { num, suffix } = parseValue(value);
  // Valor final en el render inicial (SSR / sin JS / SEO); anima desde 0 al entrar en viewport.
  const finalDisplay = num === null ? value : num.toLocaleString("es-MX");
  const [display, setDisplay] = useState(finalDisplay);

  useEffect(() => {
    if (!run || num === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(num.toLocaleString("es-MX"));
      return;
    }
    const duration = 1600;
    let raf = 0;
    let startTs: number | null = null;
    const step = (ts: number) => {
      if (startTs === null) startTs = ts;
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const current = num * eased;
      // Enteros para números grandes; un decimal si el objetivo lo tiene (ej. 2.5M).
      const rounded = Number.isInteger(num) ? Math.round(current) : Math.round(current * 10) / 10;
      setDisplay(rounded.toLocaleString("es-MX"));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, num]);

  return (
    <div className="text-center">
      <div className="font-display text-4xl font-bold tabular-nums text-accent sm:text-5xl">
        {display}
        {suffix}
      </div>
      <div className="mt-2 text-sm font-medium uppercase tracking-wide text-white/80 sm:text-base">
        {label}
      </div>
    </div>
  );
}

export default function Stats({ heading, items }: StatsBlock) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRun(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRun(true);
          obs.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-navy py-16">
      <div ref={ref} className="mx-auto max-w-6xl px-4 lg:px-8">
        {heading ? (
          <h2 className="mb-12 text-center font-display text-2xl font-bold text-white sm:text-3xl">
            {heading}
          </h2>
        ) : null}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {items.map((item, i) => (
            <StatItem key={i} value={item.value} label={item.label} run={run} />
          ))}
        </div>
      </div>
    </section>
  );
}
