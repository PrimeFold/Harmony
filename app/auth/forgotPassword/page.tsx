"use client";

import Link from "next/link";
import { AuthLayout } from "../../layouts/AuthLayout";

export default function ForgotPage() {
  return (
    <AuthLayout
      eyebrow="// 02 · recover"
      title="Reset password."
      subtitle="Enter the email tied to your account. We'll send a one-time link."
      footer={
        <span>
          Remembered it?{" "}
          <Link href="/sign-in" className="text-ink underline underline-offset-4">
            Back to sign in
          </Link>
        </span>
      }
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="nothing-label" htmlFor="email">Email</label>
          <input id="email" type="email" className="nothing-input" placeholder="you@nothing.tech" />
        </div>

        <button type="submit" className="nothing-btn nothing-btn--signal w-full">
          Send reset link ↗
        </button>

        <div className="nothing-hairline p-4 mt-4">
          <p className="nothing-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute leading-relaxed">
            // notice<br/>
            Reset links expire after 15 minutes.<br/>
            Check spam if not received.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}