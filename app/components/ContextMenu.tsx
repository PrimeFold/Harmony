import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Item {
  label: string;
  onClick: () => void;
  hint?: string;
  danger?: boolean;
}

interface Props {
  items: Item[];
  children: (open: (e: React.MouseEvent) => void) => React.ReactNode;
}

export function ContextMenu({ items, children }: Props) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const open = (e: React.MouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
  };
  const close = () => setPos(null);

  useEffect(() => {
    if (!pos) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [pos]);

  return (
    <>
      {children(open)}
      <AnimatePresence>
        {pos && (
          <motion.div
            ref={ref}
            className="nothing-ctx fixed z-[60]"
            style={{ left: pos.x, top: pos.y }}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.12 }}
          >
            {items.map((it, i) => (
              <button
                key={i}
                className="nothing-ctx-item"
                onClick={() => {
                  it.onClick();
                  close();
                }}
                style={it.danger ? { color: "var(--color-signal)" } : undefined}
              >
                <span>{it.label}</span>
                {it.hint && (
                  <span className="text-[9px] tracking-[0.18em] text-ink-mute">{it.hint}</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
