"use client";

import Link from "next/link";
import { AuthLayout } from "../../../layouts/AuthLayout";

export default function SignInPage() {
  return (
    <AuthLayout
      eyebrow="// 00 · sign in"
      title="Welcome back."
      subtitle="Authenticate to continue. No social logins. No tracking pixels."
      footer={
        <span>
          New here?{" "}
          <Link href="./signUp" className="text-ink underline underline-offset-4">
            Create an account
          </Link>
        </span>
      }
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="nothing-label" htmlFor="email">Email</label>
          <input id="email" type="email" className="nothing-input" placeholder="you@nothing.tech" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="nothing-label mb-0!" htmlFor="password">Password</label>
            <Link href="./forgotPassword" className="nothing-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute hover:text-ink">
              Forgot?
            </Link>
          </div>
          <input id="password" type="password" className="nothing-input" placeholder="••••••••" />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="nothing-btn nothing-btn--signal flex-1">
            Sign in ↗
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}