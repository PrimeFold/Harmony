"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { DotMark } from "../../components/Shell";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ eyebrow, title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left — form */}
      <div className="flex flex-col px-6 sm:px-12 lg:px-20 py-10">
        <Link href="/" className="flex items-center gap-3 mb-16">
          <DotMark />
          <span className="nothing-mono text-xs uppercase tracking-[0.22em]">
            Harmony
          </span>
        </Link>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm nothing-fade-up">
            <p className="nothing-eyebrow mb-4">{eyebrow}</p>
            <h1 className="nothing-display text-4xl mb-3">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mb-10 max-w-xs">
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>

        {footer && (
          <div className="mt-10 nothing-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {footer}
          </div>
        )}
      </div>

      {/* Right — visual */}
      <div className="hidden lg:block relative nothing-hairline-l overflow-hidden bg-surface-2"
           style={{ borderLeft: "1px solid var(--color-hairline)" }}>
        <div className="absolute inset-0 nothing-dotgrid opacity-90" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <div className="flex items-center justify-between nothing-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
            <span>SYS-01 · AUTH</span>
            <span className="flex items-center gap-2">
              <span className="nothing-blink">●</span> secure channel
            </span>
          </div>

          <div className="space-y-6">
            <div className="nothing-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
              // signal
            </div>
            <p className="nothing-display text-5xl max-w-md">
              Less interface.<br/>More <span style={{ color: "var(--color-signal)" }}>signal.</span>
            </p>
            <div className="flex gap-2 pt-4">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="block w-1 h-6"
                  style={{
                    background: i < 9 ? "var(--color-ink)" : "var(--color-dot)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-hairline"
               style={{ background: "var(--color-hairline)" }}>
            {[
              ["00", "Projects"],
              ["01", "Tasks"],
              ["02", "Focus"],
            ].map(([n, l]) => (
              <div key={n} className="bg-surface-2 p-4"
                   style={{ background: "var(--color-surface-2)" }}>
                <div className="nothing-mono text-[10px] tracking-[0.2em] text-ink-mute">{n}</div>
                <div className="nothing-mono text-sm uppercase tracking-[0.16em] mt-2">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}