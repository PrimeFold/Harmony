"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface ShellProps {
  children: ReactNode;
  active?: "app" | "about";
  variant?: "landing" | "app";
}

export function Shell({ children, active, variant = "app" }: ShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopBar active={active} variant={variant} />
      <main className="flex-1">{children}</main>
      <FootBar />
    </div>
  );
}

function TopBar({ active, variant }: { active?: ShellProps["active"]; variant: "landing" | "app" }) {
  return (
    <header className="nothing-hairline-b sticky top-0 z-40 bg-background/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <DotMark />
          <span className="nothing-mono text-xs uppercase tracking-[0.22em]">
            Halftone
          </span>
          <span
            className="nothing-mono text-[9px] uppercase tracking-[0.22em] px-1.5 py-0.5 ml-1"
            style={{ background: "var(--color-signal)", color: "oklch(1 0 0)" }}
          >
            v0.1
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {variant === "landing" ? (
            <a
              href="#about"
              className="nothing-mono text-[11px] uppercase tracking-[0.18em] px-3 py-2 text-ink-mute hover:text-ink"
            >
              About
            </a>
          ) : (
            <NavLink href="/app" label="Workspace" isActive={active === "app"} />
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/pages/auth/signIn" className="nothing-btn nothing-btn--ghost">Sign in</Link>
          <Link href="/pages/auth/signUp" className="nothing-btn nothing-btn--signal">Get started</Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  label,
  isActive,
}: {
  href: "/app";
  label: string;
  isActive?: boolean;
}) {
  return (
    <Link
      href={href}
      className="nothing-mono text-[11px] uppercase tracking-[0.18em] px-3 py-2 transition-colors"
      style={{ color: isActive ? "var(--color-ink)" : "var(--color-ink-mute)" }}
    >
      {label}
    </Link>
  );
}

function FootBar() {
  return (
    <footer className="nothing-hairline-t">
      <div className="mx-auto max-w-7xl px-6 h-12 flex items-center justify-between text-[11px] nothing-mono text-muted-foreground">
        <span>halftone · build 0426</span>
        <span className="flex items-center gap-2">
          <span className="nothing-signal-dot" /> system online
        </span>
        <span>learning project · monochrome by intent</span>
      </div>
    </footer>
  );
}

export function DotMark({ size = 22 }: { size?: number }) {
  // 5x5 dot matrix "H" mark
  const pattern = [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ];
  return (
    <div className="grid grid-cols-5 gap-[2px]" style={{ width: size, height: size }} aria-hidden>
      {pattern.flat().map((v, i) => (
        <span
          key={i}
          style={{
            background: v ? "var(--color-ink)" : "transparent",
            borderRadius: 9999,
          }}
        />
      ))}
    </div>
  );
}