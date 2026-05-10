"use client";
import { UserDock } from "./UserDock";
import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { type User } from "../app/types/user";


interface LandingShellProps{
  variant:"landing";
  user?:User;
  children?:ReactNode;
  active?:"about";
}


interface DefaultShellProps {
  user: User;
  children: ReactNode;
  active?: "app";
  variant: "app";
}

type ShellProps = LandingShellProps | DefaultShellProps;

export function Shell({ user, children, active, variant = "app" }: ShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopBar user={user} active={active} variant={variant} />
      <main className="flex-1">{children}</main>
      <FootBar />
    </div>
  );
}


function TopBar({ user, active, variant }: { user?: User; active: ShellProps["active"]; variant: "landing" | "app" }) {
  return (
    <header className="nothing-hairline-b sticky top-0 z-40 bg-background/85 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <DotMark />
          <span className="nothing-mono text-xs uppercase tracking-[0.22em]">
            Harmony
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
            <Navbar  label="Workspace" isActive={active === "app"} />
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Conditional Rendering based on user existence */}
          {user?.id ? <AuthedCluster user={user} /> : <GuestCluster />}
        </div>
      </div>
    </header>
  );
}

function GuestCluster() {
  return (
    <>
      <Link href="/auth/signIn" className="nothing-btn nothing-btn--ghost">Sign in</Link>
      <Link href="/auth/signUp" className="nothing-btn nothing-btn--signal">Get started</Link>
    </>
  );
}

function AuthedCluster({ user }: { user: User }) {
  return (
    <>
      <Link
        href="/dashboard/settings"
        className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 nothing-hairline rounded-sm hover:border-signal transition-colors group"
        aria-label="Account"
      >
        <span className="nothing-signal-dot" aria-hidden />
        <span className="nothing-mono text-[10px] uppercase tracking-[0.2em] text-ink-mute group-hover:text-ink">
          {user.email}
        </span>
      </Link>
      <Link
        href="/auth/signIn"
        className="nothing-btn nothing-btn--ghost"
        aria-label="Sign out"
      >
        Sign out ⏻
      </Link>
    </>
  );
}

function Navbar({ label, isActive, }: { label: string; isActive?: boolean; }) {
  return (
    <span
      className="nothing-mono text-[11px] uppercase tracking-[0.18em] px-3 py-2 transition-colors"
      style={{ color: isActive ? "var(--color-ink)" : "var(--color-ink-mute)" }}
    >
      {label}
    </span>
  );
}

function FootBar() {
  return (
    <footer className="nothing-hairline-t">
      <div className="mx-auto max-w-7xl px-6 h-12 flex items-center justify-between text-[11px] nothing-mono text-muted-foreground">
        <span>Harmony · build 0426</span>
        <span className="flex items-center gap-2">
          <span className="nothing-signal-dot" /> system online
        </span>
        <span>learning project · monochrome by intent</span>
      </div>
    </footer>
  );
}

export function DotMark({ size = 22 }: { size?: number }) {
  const pattern = [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ];
  return (
    <div className="grid grid-cols-5 gap-0.5" style={{ width: size, height: size }} aria-hidden>
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