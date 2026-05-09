"use client";

import Link from "next/link";
import { AuthLayout } from "../../layouts/AuthLayout";

import { useState } from "react";
import { login } from "@/app/lib/actions/auth.action";
import { useRouter } from "next/navigation";


export default function SignInPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/pages/dashboard")
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <label className="nothing-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="nothing-input"
            placeholder="you@nothing.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="nothing-label mb-0!" htmlFor="password">Password</label>
            <Link
              href="./forgotPassword"
              className="nothing-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute hover:text-ink"
            >
              Forgot?
            </Link>
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            className="nothing-input"
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
            {loading ? "Authenticating..." : "Sign in ↗"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}