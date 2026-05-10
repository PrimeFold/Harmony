import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { User } from "@/app/types/user";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "@/app/api/project/action";
import { useMemo } from "react";
import { Filter } from "../../DashboardClient";

export function ProjectGrid({
  user,
  filter,
  sortBy,
}: {
  user: User;
  filter: Filter;
  sortBy: "expireAt" | "start" | "name";
}) {
  const { data: projectResponse, isLoading, isError } = useQuery({
    queryKey: ["projects", user.id],
    queryFn: async () => {
      const response = await getAllProjects(user.id)
      if (!response || !response.success) {
        throw new Error(response.message || "Failed to fetch projects");
      }
      return response;
    },
    
  });

  const projects = projectResponse?.data ?? [];

  const filtered = useMemo(() => {
    let result = [...projects];
    if (filter !== "all") result = result.filter(p => p.status === filter);
    if (sortBy === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "expireAt") {
      result.sort((a, b) => {
        const dateA = a.expireAt ? new Date(a.expireAt).getTime() : Infinity;
        const dateB = b.expireAt ? new Date(b.expireAt).getTime() : Infinity;
        return dateA - dateB;
      });
    } else if (sortBy === "start") {
      result.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      });
    }
    return result;
  }, [projects, filter, sortBy]);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-10">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center gap-4 nothing-fade-up">
            <div className="relative">
              <div className="w-10 h-10 border border-border" />
              <div
                className="absolute inset-0 border border-signal animate-spin"
                style={{ borderTopColor: "transparent", animationDuration: "1.2s" }}
              />
            </div>
            <p className="nothing-eyebrow nothing-blink">Loading projects</p>
          </div>
        ) : isError ? (
          <div className="text-center py-24 nothing-fade-up">
            <p className="nothing-eyebrow text-signal">Failed to load projects</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-3 nothing-fade-up">
            <div className="nothing-signal-dot" />
            <p className="nothing-eyebrow">No projects yet</p>
            <p className="nothing-mono text-xs text-ink-mute uppercase tracking-[0.14em]">
              Create your first project to begin
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--color-border)" }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.03, duration: 0.25 }}
                >
                  <ProjectCard project={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}