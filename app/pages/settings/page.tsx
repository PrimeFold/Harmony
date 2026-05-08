"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shell } from "@/app/components/Shell";


type Section = | "profile" | "account" | "security";

export default function SettingsPage() {
  const [section, setSection] =
    useState<Section>("profile");

  return (
    <Shell active="app">

      <section className="nothing-hairline-b relative overflow-hidden">

        <div className="absolute inset-0 nothing-dotgrid opacity-40 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 py-12">

          <nav className="nothing-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6 flex items-center gap-2">

            <Link
              href="/dashboard"
              className="hover:text-signal"
              style={{
                color:
                  "var(--color-ink-mute)",
              }}
            >
              Workspace
            </Link>

            <span>/</span>

            <span className="text-ink">
              Settings
            </span>
          </nav>

          <p className="nothing-eyebrow mb-3 flex items-center gap-2">
            <span className="nothing-signal-dot" />
            account · preferences
          </p>

          <motion.h1
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="nothing-display text-5xl"
          >
            Settings
          </motion.h1>

          <p className="text-sm text-muted-foreground mt-5 max-w-xl">
            Update your identity,
            contact email, and
            password. UI only — no
            calls are wired.
          </p>
        </div>
      </section>

      <section
        className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-12 gap-px"
        style={{
          background:
            "var(--color-border)",
        }}
      >

        {/* Sidebar */}
        <aside className="lg:col-span-3 bg-background p-4">

          <div className="nothing-mono text-[10px] tracking-[0.22em] text-ink-mute uppercase mb-3">
            Sections
          </div>

          <nav className="flex lg:flex-col gap-1">

            {([
              ["profile", "Profile"],
              ["account", "Account"],
              ["security", "Security"],
            ] as const).map(
              ([key, label]) => {
                const sel =
                  section === key;

                return (
                  <button
                    key={key}
                    onClick={() =>
                      setSection(key)
                    }
                    className="text-left nothing-mono text-[11px] uppercase tracking-[0.18em] px-3 py-2 border transition-colors"
                    style={{
                      borderColor: sel
                        ? "var(--color-signal)"
                        : "transparent",

                      color: sel
                        ? "var(--color-signal)"
                        : "var(--color-ink-mute)",

                      background: sel
                        ? "color-mix(in oklab, var(--color-signal) 8%, transparent)"
                        : "transparent",
                    }}
                  >
                    {sel
                      ? "▸ "
                      : "  "}

                    {label}
                  </button>
                );
              }
            )}
          </nav>
        </aside>

        {/* Content */}
        <div className="lg:col-span-9 bg-background p-6 lg:p-10">

          {section ===
            "profile" && (
            <ProfileForm />
          )}

          {section ===
            "account" && (
            <AccountForm />
          )}

          {section ===
            "security" && (
            <SecurityForm />
          )}
        </div>
      </section>
    </Shell>
  );
}

function FormShell({
  title,
  hint,
  children,
  onSubmit,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
  onSubmit: (
    e: React.FormEvent
  ) => void;
}) {
  return (
    <motion.form
      key={title}
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      onSubmit={onSubmit}
      className="space-y-6"
    >

      <header className="nothing-hairline-b pb-4">

        <p className="nothing-eyebrow">
          // {hint}
        </p>

        <h2 className="nothing-display text-2xl mt-1">
          {title}
        </h2>
      </header>

      {children}

      <div className="flex gap-3 pt-2">

        <button
          type="submit"
          className="nothing-btn nothing-btn--signal"
        >
          Save changes ↗
        </button>

        <button
          type="reset"
          className="nothing-btn"
        >
          Reset
        </button>
      </div>
    </motion.form>
  );
}

function Field({
  label,
  hint,
  ...props
}: {
  label: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>

      <label className="nothing-label">
        {label}
      </label>

      <input
        className="nothing-input"
        {...props}
      />

      {hint && (
        <p className="nothing-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute mt-2">
          {hint}
        </p>
      )}
    </div>
  );
}

function ProfileForm() {
  const [name, setName] =
    useState("Guest Operator");

  const [handle, setHandle] =
    useState("guest");

  const [bio, setBio] = useState(
    "Designing in monochrome."
  );

  return (
    <FormShell
      title="Profile"
      hint="public identity"
      onSubmit={(e) =>
        e.preventDefault()
      }
    >

      <div className="grid sm:grid-cols-2 gap-5">

        <Field
          label="Display name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <Field
          label="Handle"
          value={handle}
          onChange={(e) =>
            setHandle(e.target.value)
          }
          hint="halftone.dev/@handle"
        />
      </div>

      <div>

        <label className="nothing-label">
          Bio
        </label>

        <textarea
          className="nothing-textarea"
          value={bio}
          onChange={(e) =>
            setBio(e.target.value)
          }
          placeholder="A short line about you"
        />
      </div>
    </FormShell>
  );
}

function AccountForm() {
  const [email, setEmail] =
    useState(
      "guest@halftone.dev"
    );

  const [recovery, setRecovery] =
    useState("");

  return (
    <FormShell
      title="Account"
      hint="contact + recovery"
      onSubmit={(e) =>
        e.preventDefault()
      }
    >

      <Field
        label="Email (Gmail)"
        type="email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        placeholder="you@gmail.com"
      />

      <Field
        label="Recovery email"
        type="email"
        value={recovery}
        onChange={(e) =>
          setRecovery(e.target.value)
        }
        placeholder="backup@gmail.com"
        hint="used if you lose access"
      />
    </FormShell>
  );
}

function SecurityForm() {
  const [current, setCurrent] =
    useState("");

  const [next, setNext] =
    useState("");

  const [confirm, setConfirm] =
    useState("");

  return (
    <FormShell
      title="Security"
      hint="password"
      onSubmit={(e) =>
        e.preventDefault()
      }
    >

      <Field
        label="Current password"
        type="password"
        value={current}
        onChange={(e) =>
          setCurrent(e.target.value)
        }
        placeholder="••••••••"
      />

      <div className="grid sm:grid-cols-2 gap-5">

        <Field
          label="New password"
          type="password"
          value={next}
          onChange={(e) =>
            setNext(e.target.value)
          }
          placeholder="••••••••"
        />

        <Field
          label="Confirm new"
          type="password"
          value={confirm}
          onChange={(e) =>
            setConfirm(
              e.target.value
            )
          }
          placeholder="••••••••"
          hint={
            next &&
            confirm &&
            next !== confirm
              ? "passwords differ"
              : "min 8 chars"
          }
        />
      </div>
    </FormShell>
  );
}