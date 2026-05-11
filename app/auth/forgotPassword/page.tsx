"use client";

import Link from "next/link";
import { AuthLayout } from "../../layouts/AuthLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/app/lib/actions/auth.action";

export default function ForgotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response =  await resetPassword(email, password);
      if (!response) {
        throw new Error("Error resetting the password ")
      } else {
        router.push("/auth/signIn");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="// 02 · recover"
      title="Reset password."
      subtitle="Enter your account email and choose a new password."
      footer={
        <span>
          Remembered it?{" "}
          <Link href="/auth/signIn" className="text-ink underline underline-offset-4">
            Back to sign in
          </Link>
        </span>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="nothing-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="nothing-input"
            placeholder="you@nothing.tech"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <label className="nothing-label" htmlFor="password">New Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="nothing-input pr-16"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-0 top-0 h-full px-3 nothing-mono text-[9px] uppercase tracking-[0.16em] text-ink-mute hover:text-ink"
            >
              {showPassword ? "hide" : "show"}
            </button>
          </div>
        </div>

        {error && (
          <p className="nothing-mono text-[11px] uppercase tracking-[0.16em]"
            style={{ color: "var(--color-signal)" }}>
            ✕ {error}
          </p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="nothing-btn nothing-btn--signal flex-1"
            disabled={loading}
          >
            {loading ? "Updating..." : "Reset password ↗"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}