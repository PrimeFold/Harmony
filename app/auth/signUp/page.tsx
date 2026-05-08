"use client";

import Link from "next/link";
import { AuthLayout } from "../../layouts/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout
      eyebrow="// 01 · sign up"
      title="Create account."
      subtitle="One workspace. Unlimited projects. Zero noise."
      footer={
        <span>
          Already registered?{" "}
          <Link href="./signIn" className="text-ink underline underline-offset-4">
            Sign in
          </Link>
        </span>
      }
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="nothing-label" htmlFor="name">Display name</label>
          <input id="name" type="text" className="nothing-input" placeholder="ada lovelace" />
        </div>
        <div>
          <label className="nothing-label" htmlFor="email">Email</label>
          <input id="email" type="email" className="nothing-input" placeholder="you@nothing.tech" />
        </div>
        <div>
          <label className="nothing-label" htmlFor="password">Password</label>
          <input id="password" type="password" className="nothing-input" placeholder="min. 8 characters" />
          <p className="nothing-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute mt-2">
            ≥ 8 chars · 1 number · 1 symbol
          </p>
        </div>

        <button type="submit" className="nothing-btn nothing-btn--signal w-full">
          Create account ↗
        </button>

        <p className="nothing-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute leading-relaxed">
          By continuing you agree to the terms.<br/>
          We don't sell your data. We don't even like data.
        </p>
      </form>
    </AuthLayout>
  );
}