"use client";

import Link from "next/link";
import { AuthLayout } from "../../layouts/AuthLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/lib/actions/auth.action";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await signup(username, email, password);
      if (!response) {
        throw new Error("Error Signing up")
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
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="nothing-label" htmlFor="name">Display name</label>
          <input
            id="name"
            type="text"
            className="nothing-input"
            placeholder="ada lovelace"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
          />
        </div>
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
          <label className="nothing-label" htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="nothing-input pr-16"
              placeholder="min. 8 characters"
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
          <p className="nothing-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute mt-2">
            ≥ 8 chars · 1 number · 1 symbol
          </p>
        </div>

        {error && (
          <p
            className="nothing-mono text-[11px] uppercase tracking-[0.16em]"
            style={{ color: "var(--color-signal)" }}
          >
            ✕ {error}
          </p>
        )}

        <button
          type="submit"
          className="nothing-btn nothing-btn--signal w-full"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account ↗"}
        </button>

        <p className="nothing-mono text-[10px] uppercase tracking-[0.18em] text-ink-mute leading-relaxed">
          By continuing you agree to the terms.<br />
          We don't sell your data. We don't want empty bank accounts you know.
        </p>
      </form>
    </AuthLayout>
  );
}