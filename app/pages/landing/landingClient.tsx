"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import Link from "next/link";
import { Shell } from "@/app/components/Shell";


export default function LandingClient() {
  const heroRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const chars = heroRef.current.querySelectorAll<HTMLSpanElement>("[data-hero-char]");
    gsap.fromTo(
      chars,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.018,
      }
    );
  }, []);

  return (
    <Shell variant="landing">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 nothing-dotgrid opacity-60 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] pointer-events-none"
             style={{
               background: "radial-gradient(closest-side, var(--color-signal-glow), transparent 70%)",
               opacity: 0.18,
               filter: "blur(60px)",
             }} />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32">
          <div className="grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <p className="nothing-eyebrow mb-6 flex items-center gap-2">
                <span className="nothing-signal-dot" />
                release 0.1 · learning project
              </p>
              <h1 ref={heroRef} className="nothing-display text-6xl sm:text-7xl lg:text-8xl">
                <HeroLine text="Halftone." />
                <br />
                <HeroLine text="Tasks at" />
                <br />
                <span style={{ color: "var(--color-signal)" }}>
                  <HeroLine text="signal level." />
                </span>
              </h1>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-base text-muted-foreground max-w-sm"
              >
                A monochrome collaborative task manager. Built openly as a learning project to
                explore the modern React data-stack — without giving up on aesthetics.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="flex flex-wrap gap-3"
              >
                <Link href="/sign-up" className="nothing-btn nothing-btn--signal">
                  Get started ↗
                </Link>
                <Link href="/app" className="nothing-btn">
                  Enter workspace
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Stat strip */}
          <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-px"
               style={{ background: "var(--color-hairline)" }}>
            {[
              ["00", "Projects", "unlimited"],
              ["01", "Statuses", "active · paused · draft · done"],
              ["02", "Members", "shared workspace"],
              ["03", "Latency", "0ms · optimistic"],
            ].map(([n, l, v], i) => (
              <motion.div
                key={n}
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.06 }}
                className="p-6"
                style={{ background: "var(--color-background)" }}
              >
                <div className="nothing-mono text-[10px] tracking-[0.22em] text-ink-mute">{n}</div>
                <div className="nothing-mono text-sm uppercase tracking-[0.16em] mt-3">{l}</div>
                <div className="text-xs text-muted-foreground mt-2 nothing-mono">{v}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT / STACK */}
      <section id="about" className="nothing-hairline-t relative">
        <div className="mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <p className="nothing-eyebrow mb-4">// 01 · about</p>
            <h2 className="nothing-display text-5xl">
              A learning<br/>project, on<br/>
              <span style={{ color: "var(--color-signal)" }}>purpose.</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-6 max-w-md">
              Halftone is built to learn — not to ship to production. It explores how the modern
              React data-stack composes when you give the UI room to breathe. Every screen is a
              study in restraint: hairlines, dot grids, monospaced type, and a single red signal
              for the things that matter.
            </p>
          </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-px"
                 style={{ background: "var(--color-hairline)" }}>
              {STACK.map((s, i) => (
                <motion.article
                  key={s.name}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 group nothing-card--bloom"
                  style={{ background: "var(--color-background)" }}
                >
                  <div className="flex items-start justify-between">
                    <span className="nothing-mono text-[10px] tracking-[0.22em] text-ink-mute">
                      {String(i).padStart(2, "0")}
                    </span>
                    <span className="nothing-mono text-[10px] tracking-[0.18em] uppercase"
                          style={{ color: "var(--color-signal)" }}>
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="nothing-display text-2xl mt-6">{s.name}</h3>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{s.why}</p>
                </motion.article>
              ))}
            </div>
          
          
        </div>
      </section>

      {/* WHY TANSTACK QUERY */}
      <section className="nothing-hairline-t relative overflow-hidden">
        <div className="absolute inset-0 nothing-scanline opacity-40" />
        <div className="mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-12 gap-10 relative">
          <div className="lg:col-span-4">
            <p className="nothing-eyebrow mb-4">// 02 · the data layer</p>
            <h2 className="nothing-display text-4xl">
              Why<br/>
              <span style={{ color: "var(--color-signal)" }}>TanStack Query</span><br/>
              specifically?
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
            <p>
              TanStack Query treats server state as a first-class concept — separate from UI
              state. For a collaborative task manager, this matters: tasks live on the server,
              update concurrently, and need to feel instant on the client.
            </p>
            <ul className="grid sm:grid-cols-2 gap-px"
                style={{ background: "var(--color-hairline)" }}>
              {WHY_QUERY.map((w, i) => (
                <li key={i} className="bg-background p-5">
                  <div className="nothing-mono text-[10px] tracking-[0.22em] text-ink-mute">
                    {String(i).padStart(2, "0")}
                  </div>
                  <div className="nothing-mono text-xs uppercase tracking-[0.16em] mt-2 text-ink">
                    {w.t}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{w.d}</p>
                </li>
              ))}
            </ul>
            <p className="nothing-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute pt-2">
              // in halftone, the data layer is intentionally not wired yet — the UI is the lab.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="nothing-hairline-t">
        <div className="mx-auto max-w-7xl px-6 py-24 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 relative">
          <div className="nothing-bloom">
            <h2 className="nothing-display text-5xl lg:text-6xl max-w-2xl">
              Ready when you<br />
              <span style={{ color: "var(--color-signal)" }}>stop overthinking.</span>
            </h2>
          </div>
          <Link href="/sign-up" className="nothing-btn nothing-btn--signal">
            Create account ↗
          </Link>
        </div>
      </section>
    </Shell>
  );
}

function HeroLine({ text }: { text: string }) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      {text.split("").map((c, i) => (
        <span
          key={i}
          data-hero-char
          className="inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

const STACK = [
  {
    name: "Next.js App Router",
    tag: "routing",
    why: "Type-safe, file-based routes with server components. The URL is the source of truth — no router-context spaghetti.",
  },
  {
    name: "TanStack Query",
    tag: "server state",
    why: "Caching, background refetching, optimistic mutations. Treats the server as the source of truth so the UI can feel local.",
  },
  {
    name: "Tailwind CSS v4",
    tag: "styling",
    why: "Utility-first with CSS-native theming via @theme. Every token in halftone lives in a single styles.css.",
  },
  {
    name: "Framer Motion + GSAP",
    tag: "motion",
    why: "Framer for component-level transitions, GSAP for choreographed text and timelines. Both used sparingly, on intent.",
  },
];

const WHY_QUERY = [
  {
    t: "Optimistic UI",
    d: "Mutations apply instantly with rollback on failure — perfect for status toggles, drag-drop boards, and assignments.",
  },
  {
    t: "Cache normalisation",
    d: "Query keys give us a deterministic cache. Invalidate one project — every dependent view updates.",
  },
  {
    t: "Background sync",
    d: "Stale-while-revalidate keeps collaborators in sync without spinners.",
  },
  {
    t: "Devtools native",
    d: "Inspect every cached query, mutation, and refetch reason. Debugging server state stops being a guess.",
  },
];