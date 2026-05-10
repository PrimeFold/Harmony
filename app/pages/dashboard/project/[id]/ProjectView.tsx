"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Shell } from "@/components/Shell";
import { ContextMenu } from "@/components/ContextMenu";
import { getProjectById } from "@/app/api/project/action";
import { Task } from "@/app/types/task";
import { NewTaskModal } from "../../components/tasks/NewTaskModal";
import { User } from "@/app/types/user";
import { Project } from "@/app/types/project";

type Props = {
  projectId: Project["id"];
  user: User;
};

type TaskStatus = "todo" | "doing" | "done";

export function ProjectView({ projectId, user }: Props) {
  const [taskModal, setTaskModal] = useState(false);

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await getProjectById(projectId);
      
      // Check if response is valid and successful
      if (!res || !res.success || !res.data) {
        throw new Error(res?.message || "Failed to load project");
      }
      
      // Return the actual project object
      return res.data;
    },
  });

  // Loading and Error Guards
  if (isLoading) return <div className="nothing-loading">// Initializing Workspace Sync</div>;
  
  if (isError || !project) {
    return (
      <div className="nothing-error py-24 text-center nothing-mono">
        <p className="text-signal">// Project Not Found</p>
        <Link href="/dashboard" className="nothing-btn mt-4 inline-block">Return to Workspace</Link>
      </div>
    );
  }

  return (
    <Shell variant="app" user={user}>
      {/* Header */}
      <section className="nothing-hairline-b relative overflow-hidden">
        <div className="absolute inset-0 nothing-dotgrid opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <nav className="nothing-mono text-[11px] uppercase tracking-[0.18em] mb-6 flex items-center gap-2">
            <Link href="/dashboard" className="text-ink-mute hover:text-signal transition-colors">Workspace</Link>
            <span className="text-ink-mute">/</span>
            <span className="text-ink">{project.id.slice(0, 8).toUpperCase()}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="max-w-2xl">
              <p className="nothing-eyebrow mb-3 flex items-center gap-2">
                <span className="nothing-signal-dot" /> project · brief
              </p>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="nothing-display text-5xl">
                {project.name}
              </motion.h1>
              <p className="text-sm text-muted-foreground mt-5 leading-relaxed">{project.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <span className="nothing-mono text-[10px] border border-signal text-signal px-2 py-1 uppercase tracking-widest">
                {project.status}
              </span>
              <button onClick={() => setTaskModal(true)} className="nothing-btn nothing-btn--signal">+ New task</button>
            </div>
          </div>

          <div className="mt-10 grid lg:grid-cols-12 gap-px bg-hairline">
            <div className="lg:col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-px">
              <Cell 
                label="Start" 
                value={project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "---"} 
              />
              <Cell 
                label="Deadline" 
                value={project.expireAt ? new Date(project.expireAt).toLocaleDateString() : "No Limit"} 
                accent 
              />
              <Cell label="Status" value={project.status} />
              <Cell label="Tasks" value={String(project.tasks?.length || 0).padStart(2, "0")} />
            </div>
          </div>
        </div>
      </section>

      {/* Board */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="nothing-display text-2xl">Tasks</h2>
            <p className="nothing-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute">right-click a task to toggle</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-px bg-border">
            {COLUMNS.map((col) => {
              const items = project.tasks?.filter((t: Task) => t.status === col.key) || [];
              return (
                <div key={col.key} className="bg-background min-h-[50vh] p-4 border-r border-border last:border-r-0">
                  <div className="flex items-center justify-between mb-6">
                    <span className="nothing-mono text-[10px] tracking-widest text-ink-mute uppercase">{col.label}</span>
                    <span className="nothing-mono text-[10px] text-ink-mute">{col.n}</span>
                  </div>
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {items.map((task: Task) => (
                        <ContextMenu key={task.id} task={task} user={user}>
                          {(open) => (
                            <motion.div
                              onContextMenu={open}
                              layout
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="p-4 border border-border bg-background group hover:border-signal transition-colors cursor-context-menu"
                            >
                              <p className={`nothing-mono text-xs uppercase tracking-tight ${task.status === "completed" ? "line-through text-ink-mute" : ""}`}>
                                {task.name}
                              </p>
                            </motion.div>
                          )}
                        </ContextMenu>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <NewTaskModal project={project} open={taskModal} onClose={() => setTaskModal(false)} />
    </Shell>
  );
}

const COLUMNS: { key: TaskStatus; label: string; n: string }[] = [
  { key: "todo", label: "To do", n: "00" },
  { key: "doing", label: "In progress", n: "01" },
  { key: "done", label: "Done", n: "02" },
];

function Cell({ label, value, accent }: { label: string; value?: string; accent?: boolean }) {
  return (
    <div className="bg-background p-4">
      <div className="nothing-mono text-[10px] tracking-[0.22em] text-ink-mute uppercase">{label}</div>
      <div className="nothing-mono text-sm mt-2" style={{ color: accent ? "var(--color-signal)" : "var(--color-ink)" }}>{value}</div>
    </div>
  );
}