"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shell } from "@/components/Shell";
import { User } from "@/app/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changeEmail, changePassword, changeUsername } from "@/app/lib/actions/auth.action";

type Section = "profile" | "account" | "security";
type Props = { user: User };

export function SettingsView({ user }: Props) {
  const [section, setSection] = useState<Section>("profile");

  return (
    <Shell variant="app" user={user} active="app">
      <section className="nothing-hairline-b relative overflow-hidden">
        <div className="absolute inset-0 nothing-dotgrid opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <nav className="nothing-mono text-[11px] uppercase tracking-[0.18em] mb-6 flex items-center gap-2">
            <Link href="/dashboard" className="text-ink-mute hover:text-signal transition-colors">Workspace</Link>
            <span className="text-ink-mute">/</span>
            <span className="text-ink">Settings</span>
          </nav>

          <p className="nothing-eyebrow mb-3 flex items-center gap-2">
            <span className="nothing-signal-dot" /> account · preferences
          </p>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="nothing-display text-5xl">
            Settings
          </motion.h1>

          <p className="text-sm text-muted-foreground mt-5 max-w-xl">
            Update your identity, contact email, and security credentials.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 grid lg:grid-cols-12 gap-px bg-border">
        <aside className="lg:col-span-3 bg-background p-4">
          <div className="nothing-mono text-[10px] tracking-[0.22em] text-ink-mute uppercase mb-3">Sections</div>
          <nav className="flex lg:flex-col gap-1">
            {([["profile", "Profile"], ["account", "Account"], ["security", "Security"]] as const).map(([key, label]) => {
              const sel = section === key;
              return (
                <button
                  key={key}
                  onClick={() => setSection(key)}
                  className="text-left nothing-mono text-[11px] uppercase tracking-[0.18em] px-3 py-2 border transition-colors"
                  style={{
                    borderColor: sel ? "var(--color-signal)" : "transparent",
                    color: sel ? "var(--color-signal)" : "var(--color-ink-mute)",
                    background: sel ? "color-mix(in oklab, var(--color-signal) 8%, transparent)" : "transparent",
                  }}
                >
                  {sel ? "▸ " : "  "}{label}
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="lg:col-span-9 bg-background p-6 lg:p-10">
          <AnimatePresence mode="wait">
            {section === "profile" && <ProfileForm user={user} />}
            {section === "account" && <AccountForm user={user} />}
            {section === "security" && <SecurityForm user={user} />}
          </AnimatePresence>
        </div>
      </section>
    </Shell>
  );
}

function FormShell({ title, hint, children, onSubmit, isPending, onReset }: {
  title: string;
  hint: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isPending?: boolean;
  onReset?: () => void;
}) {
  return (
    <motion.form
      key={title}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <header className="nothing-hairline-b pb-4">
        <p className="nothing-eyebrow">// {hint}</p>
        <h2 className="nothing-display text-2xl mt-1">{title}</h2>
      </header>
      {children}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isPending} className="nothing-btn nothing-btn--signal disabled:opacity-50">
          {isPending ? "Saving..." : "Save changes ↗"}
        </button>
        <button type="button" onClick={onReset} className="nothing-btn">Reset</button>
      </div>
    </motion.form>
  );
}

function Field({ label, hint, ...props }: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="nothing-label">{label}</label>
      <input className="nothing-input" {...props} />
      {hint && <p className="nothing-mono text-[10px] uppercase tracking-[0.16em] text-ink-mute mt-2">{hint}</p>}
    </div>
  );
}

function ProfileForm({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(user.username || "");


  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await changeUsername(name,user.id);
      if (!res.success) throw new Error(res.message);
      return res;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", String(user.id).trim()] });
    },
    onSuccess: () => alert("Profile updated")
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("Name required");
    mutate();
  };

  return (
    <FormShell title="Profile" hint="public identity" onSubmit={handleSubmit} isPending={isPending} onReset={() => { setName(user.username || "")}}>
      <div className="grid sm:grid-cols-1 gap-5">
        <Field label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
    </FormShell>
  );
}

function AccountForm({ user }: { user: User }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState(user.email || "");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await changeEmail(email,user.id);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user", String(user.id).trim()] });
    }
  });

  return (
    <FormShell title="Account" hint="contact + recovery" onSubmit={(e) => { e.preventDefault(); mutate(); }} isPending={isPending} onReset={() => setEmail(user.email || "")}>
      <Field label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />
    </FormShell>
  );
}

function SecurityForm({ user }: { user: User }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const res = await changePassword(current,next,user.id);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      setCurrent(""); setNext(""); setConfirm("");
      alert("Password updated successfully");
    },
    onError: (err: any) => alert(err.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) return alert("Passwords do not match");
    if (next.length < 8) return alert("Password must be at least 8 characters");
    mutate();
  };

  return (
    <FormShell title="Security" hint="credentials" onSubmit={handleSubmit} isPending={isPending} onReset={() => { setCurrent(""); setNext(""); setConfirm(""); }}>
      <Field label="Current password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" />
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="New password" type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="••••••••" />
        <Field label="Confirm new" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••"
          hint={next && confirm && next !== confirm ? "passwords differ" : "min 8 chars"} />
      </div>
    </FormShell>
  );
}