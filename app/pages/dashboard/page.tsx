"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import {
  PROJECT_STATUSES,
  seedProjects,
  statusPillClass,
  type Project,
  type ProjectStatus,
} from "@/lib/halftone-data";
import { Modal } from "@/app/components/Modal";
import { Shell } from "@/app/components/Shell";

type Filter = "all" | ProjectStatus;

export default function AppWorkspace() {
  const [projects, setProjects] = useState<Project[]>(seedProjects);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"deadline" | "start" | "name">("deadline");
  const [modal, setModal] = useState(false);

  const visible = useMemo(() => {
    let arr = projects.filter((p) =>
      filter === "all" ? true : p.status === filter
    );
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter((p) => p.name.toLowerCase().includes(q));
    }
    arr = [...arr].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a[sortBy].localeCompare(b[sortBy]);
    });
    return arr;
  }, [projects, filter, search, sortBy]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: projects.length, active: 0, paused: 0, draft: 0, completed: 0 };
    projects.forEach((p) => (c[p.status] += 1));
    return c;
  }, [projects]);

  return (
    <Shell active="app">
      {/* Header */}
      <section className="nothing-hairline-b">
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col lg:flex-row justify-between gap-6 lg:items-end">
          <div>
            <p className="nothing-eyebrow mb-3 flex items-center gap-2">
              <span className="nothing-signal-dot" />
              workspace · default
            </p>
            <h1 className="nothing-display text-5xl">Projects</h1>
            <p className="text-sm text-muted-foreground mt-3 max-w-md">
              {projects.length} workspaces. Click any to open the brief and tasks.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              className="nothing-input max-w-xs"
              placeholder="Search projects"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => setModal(true)}
              className="nothing-btn nothing-btn--signal whitespace-nowrap"
            >
              + New project
            </button>
          </div>
        </div>
      </section>

      {/* Filter / Sort bar */}
      <section className="nothing-hairline-b">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {(["all", ...PROJECT_STATUSES] as Filter[]).map((f) => {
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="nothing-mono text-[11px] uppercase tracking-[0.16em] px-3 py-1.5 border transition-colors"
                  style={{
                    borderColor: isActive ? "var(--color-signal)" : "var(--color-border)",
                    color: isActive ? "var(--color-signal)" : "var(--color-ink-mute)",
                    background: isActive ? "color-mix(in oklab, var(--color-signal) 8%, transparent)" : "transparent",
                  }}
                >
                  {f} · {String(counts[f]).padStart(2, "0")}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <span className="nothing-mono text-[10px] tracking-[0.18em] text-ink-mute uppercase">Sort</span>
            {(["deadline", "start", "name"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className="nothing-mono text-[11px] uppercase tracking-[0.16em] px-2 py-1"
                style={{
                  color: sortBy === s ? "var(--color-ink)" : "var(--color-ink-mute)",
                  borderBottom: sortBy === s ? "1px solid var(--color-signal)" : "1px solid transparent",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px"
               style={{ background: "var(--color-border)" }}>
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <Link
                    href={`/project/${p.id}`}
                    className="bg-background p-6 group block transition-colors hover:bg-surface-2 nothing-card--bloom h-full"
                  >
                    <div className="flex items-start justify-between">
                      <span className="nothing-mono text-[10px] tracking-[0.22em] text-ink-mute">
                        {p.id.toUpperCase()}
                      </span>
                      <span className={statusPillClass(p.status)}>
                        {p.status === "active" && <span className="nothing-blink">●</span>}
                        {p.status}
                      </span>
                    </div>

                    <h3 className="nothing-display text-2xl mt-8">{p.name}</h3>
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{p.description}</p>

                    <div className="mt-8 grid grid-cols-2 gap-3">
                      <DateBlock label="Start" value={p.start} />
                      <DateBlock label="Deadline" value={p.deadline} accent />
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex gap-6">
                        <Stat label="Tasks" value={p.tasks.length} />
                        <Stat label="Members" value={p.members} />
                      </div>
                      <span className="nothing-mono text-xs uppercase tracking-[0.18em] opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "var(--color-signal)" }}>
                        Open ↗
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {visible.length === 0 && (
            <div className="text-center py-24 nothing-mono text-xs uppercase tracking-[0.18em] text-ink-mute">
              No projects match this filter.
            </div>
          )}
        </div>
      </section>

      <NewProjectModal
        open={modal}
        onClose={() => setModal(false)}
        onCreate={(p) => {
          setProjects((arr) => [p, ...arr]);
          setModal(false);
        }}
      />
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <div className="nothing-mono text-[10px] tracking-[0.18em] text-ink-mute uppercase">{label}</div>
      <div className="nothing-mono text-lg mt-1">{String(value).padStart(2, "0")}</div>
    </div>
  );
}

function DateBlock({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-border p-3">
      <div className="nothing-mono text-[9px] tracking-[0.22em] text-ink-mute uppercase">{label}</div>
      <div
        className="nothing-mono text-xs mt-1"
        style={{ color: accent ? "var(--color-signal)" : "var(--color-ink)" }}
      >
        {value}
      </div>
    </div>
  );
}

function NewProjectModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (p: Project) => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("draft");
  const [start, setStart] = useState("");
  const [deadline, setDeadline] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({
      id: `p-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      description: desc.trim() || "—",
      status,
      start: start || new Date().toISOString().slice(0, 10),
      deadline: deadline || new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
      members: 1,
      tasks: [],
    });
    setName(""); setDesc(""); setStatus("draft"); setStart(""); setDeadline("");
  };

  return (
    <Modal open={open} onClose={onClose} title="New project" eyebrow="// create">
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="nothing-label">Name</label>
          <input className="nothing-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
        </div>
        <div>
          <label className="nothing-label">Brief</label>
          <textarea className="nothing-textarea" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="What's this project for?" />
        </div>
        <div>
          <label className="nothing-label">Status</label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_STATUSES.map((s:any) => {
              const sel = status === s;
              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className="nothing-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 border"
                  style={{
                    borderColor: sel ? "var(--color-signal)" : "var(--color-border)",
                    color: sel ? "var(--color-signal)" : "var(--color-ink-mute)",
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="nothing-label">Start</label>
            <input type="date" className="nothing-input" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className="nothing-label">Deadline</label>
            <input type="date" className="nothing-input" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="nothing-btn nothing-btn--signal flex-1">Create ↗</button>
          <button type="button" onClick={onClose} className="nothing-btn">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}