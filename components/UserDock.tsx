"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

export function UserDock() {
  const [open, setOpen] =
    useState(false);

  const ref =
    useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  // close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // outside click + esc
  useEffect(() => {
    const onClick = (
      e: MouseEvent
    ) => {
      if (
        !ref.current?.contains(
          e.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    const onKey = (
      e: KeyboardEvent
    ) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener(
      "mousedown",
      onClick
    );

    window.addEventListener(
      "keydown",
      onKey
    );

    return () => {
      window.removeEventListener(
        "mousedown",
        onClick
      );

      window.removeEventListener(
        "keydown",
        onKey
      );
    };
  }, []);

  // hide on auth pages
  if (
    /^\/(sign-in|sign-up|forgot-password)/.test(
      pathname
    )
  ) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="fixed bottom-5 right-5 z-50 select-none"
    >
      <AnimatePresence>

        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
            }}
            className="absolute bottom-14 right-0 w-64 nothing-card"
            style={{
              boxShadow:
                "0 24px 60px -20px var(--color-signal-glow)",
            }}
          >

            <div className="nothing-hairline-b px-4 py-3">

              <p className="nothing-eyebrow">
                // signed in as
              </p>

              <p className="nothing-mono text-xs mt-1 truncate">
                guest@halftone.dev
              </p>
            </div>

            <nav className="p-2">

              <Link
                href="/pages/settings"
                className="block px-3 py-2 nothing-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute hover:text-signal hover:bg-[color-mix(in_oklab,var(--color-signal)_6%,transparent)] transition-colors"
              >
                ⚙ Settings
              </Link>

              <Link
                href="/pages/dashboard"
                className="block px-3 py-2 nothing-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute hover:text-signal hover:bg-[color-mix(in_oklab,var(--color-signal)_6%,transparent)] transition-colors"
              >
                ▦ Workspace
              </Link>

              <div className="my-1 nothing-hairline-b" />

              <Link
                href="/signIn"
                className="block px-3 py-2 nothing-mono text-[11px] uppercase tracking-[0.18em] text-ink-mute hover:text-signal transition-colors"
              >
                ⏻ Sign out
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{
          scale: 0.94,
        }}
        whileHover={{
          scale: 1.04,
        }}
        onClick={() =>
          setOpen((v) => !v)
        }
        aria-label="Open user menu"
        className="user-dock__btn"
      >
        <span className="user-dock__avatar">
          G
        </span>

        <span
          className="user-dock__pulse"
          aria-hidden
        />
      </motion.button>
    </div>
  );
}