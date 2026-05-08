"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";



import {
  seedProjects,
  statusPillClass,
  PROJECT_STATUSES,
  type Project,
  type ProjectStatus,
  type Task,
  type TaskStatus,
} from "@/lib/halftone-data";
import { Shell } from "@/app/components/Shell";
import { NewTaskModal } from "@/app/components/tasks/NewTaskModal";

type Props = {
  params: {
    projectId: string;
  };
};

export default function ProjectPage({
  params,
}: Props) {
  const { projectId } = params;

  const initial = useMemo(
    () =>
      seedProjects.find((p:any) => p.id === projectId) ??
      seedProjects[0],:any
    [projectId]
  );

  const [project, setProject] =
    useState<Project>(initial);

  const [taskModal, setTaskModal] =
    useState(false);

  const setStatus = (s: ProjectStatus) =>
    setProject((p:any) => ({
      ...p,
      status: s,
    }));

  const addTask = (t: Task) =>
    setProject((p:any) => ({
      ...p,
      tasks: [t, ...p.tasks],
    }));

  const setTaskStatus = (
    id: string,
    s: TaskStatus
  ) =>
    setProject((p:any) => ({
      ...p,
      tasks: p.tasks.map((t:any) =>
        t.id === id
          ? { ...t, status: s }
          : t
      ),
    }));

  const deleteTask = (id: string) =>
    setProject((p:any) => ({
      ...p,
      tasks: p.tasks.filter(
        (t:any) => t.id !== id
      ),
    }));

  const counts = {
    todo: project.tasks.filter(
      (t:any) => t.status === "todo"
    ).length,

    doing: project.tasks.filter(
      (t:any) => t.status === "doing"
    ).length,

    done: project.tasks.filter(
      (t:any) => t.status === "done"
    ).length,
  };

  return (
    <Shell active="app">

      {/* Header */}
      <section className="nothing-hairline-b relative overflow-hidden">

        <div className="absolute inset-0 nothing-dotgrid opacity-40 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 py-12">

          <nav className="nothing-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mb-6 flex items-center gap-2">

            <Link
              href="/dashboard"
              className="hover:text-signal"
              style={{
                color:
                  "var(--color-ink-mute)",
              }}
            >
              Workspace
            </Link>

            <span>/</span>

            <span className="text-ink">
              {project.id.toUpperCase()}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

            <div className="max-w-2xl">

              <p className="nothing-eyebrow mb-3 flex items-center gap-2">
                <span className="nothing-signal-dot" />
                project · brief
              </p>

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="nothing-display text-5xl"
              >
                {project.name}
              </motion.h1>

              <p className="text-sm text-muted-foreground mt-5 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">

              <span
                className={statusPillClass(
                  project.status
                )}
              >
                {project.status}
              </span>

              <button
                onClick={() =>
                  setTaskModal(true)
                }
                className="nothing-btn nothing-btn--signal"
              >
                + New task
              </button>
            </div>
          </div>

          {/* Status + dates */}
          <div className="mt-10 grid lg:grid-cols-12 gap-4">

            <div className="lg:col-span-7">

              <div className="nothing-mono text-[10px] tracking-[0.18em] text-ink-mute uppercase mb-2">
                Set status
              </div>

              <div className="flex flex-wrap gap-2">
                {PROJECT_STATUSES.map((s:any) => {
                  const sel =
                    project.status === s;

                  return (
                    <button
                      key={s}
                      onClick={() =>
                        setStatus(s)
                      }
                      className="nothing-mono text-[11px] uppercase tracking-[0.16em] px-3 py-1.5 border transition-colors"
                      style={{
                        borderColor: sel
                          ? "var(--color-signal)"
                          : "var(--color-border)",

                        color: sel
                          ? "var(--color-signal)"
                          : "var(--color-ink-mute)",

                        background: sel
                          ? "color-mix(in oklab, var(--color-signal) 8%, transparent)"
                          : "transparent",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="lg:col-span-5 grid grid-cols-3 gap-px"
              style={{
                background:
                  "var(--color-hairline)",
              }}
            >
              <Cell
                label="Start"
                value={project.start}
              />

              <Cell
                label="Deadline"
                value={project.deadline}
                accent
              />

              <Cell
                label="Members"
                value={String(
                  project.members
                ).padStart(2, "0")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Board */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-10">

          <div className="flex items-center justify-between mb-6">

            <h2 className="nothing-display text-2xl">
              Tasks
            </h2>

            <p className="nothing-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">
              right-click a task to toggle
              complete · pending
            </p>
          </div>

          <div
            className="grid lg:grid-cols-3 gap-px"
            style={{
              background:
                "var(--color-border)",
            }}
          >
            {COLUMNS.map((col) => {
              const items =
                project.tasks.filter(
                  (t:any) =>
                    t.status === col.key
                );

              return (
                <div
                  key={col.key}
                  className="bg-background min-h-[50vh]"
                >
                  {/* unchanged task column */}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <NewTaskModal
        open={taskModal}
        onClose={() =>
          setTaskModal(false)
        }
        onCreate={(t:any) => {
          addTask(t);
          setTaskModal(false);
        }}
      />
    </Shell>
  );
}

const COLUMNS: {
  key: TaskStatus;
  label: string;
  n: string;
}[] = [
  {
    key: "todo",
    label: "To do",
    n: "00",
  },
  {
    key: "doing",
    label: "In progress",
    n: "01",
  },
  {
    key: "done",
    label: "Done",
    n: "02",
  },
];

function Cell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-background p-4">

      <div className="nothing-mono text-[10px] tracking-[0.22em] text-ink-mute uppercase">
        {label}
      </div>

      <div
        className="nothing-mono text-sm mt-2"
        style={{
          color: accent
            ? "var(--color-signal)"
            : "var(--color-ink)",
        }}
      >
        {value}
      </div>
    </div>
  );
}