import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { User } from "@/app/types/user";
import { useQuery } from "@tanstack/react-query";
import { getAllProjects } from "@/app/api/project/action";

export function ProjectGrid({
  user,
}: {
  user: User;
}) {
  const {
    data: projectResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects", user.id],
    queryFn: () => getAllProjects(user.id),
  });

  const projects =
    projectResponse?.success
      ? projectResponse.data ?? []
      : [];

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-10">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center gap-4 nothing-fade-up">
            <div className="relative">
              <div className="w-10 h-10 border border-border" />

              <div
                className="absolute inset-0 border border-signal animate-spin"
                style={{
                  borderTopColor: "transparent",
                  animationDuration: "1.2s",
                }}
              />
            </div>

            <p className="nothing-eyebrow nothing-blink">
              Loading projects
            </p>
          </div>
        ) : isError ? (
          <div className="text-center py-24 nothing-fade-up">
            <p className="nothing-eyebrow text-signal">
              Failed to load projects
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-3 nothing-fade-up">
            <div className="nothing-signal-dot" />

            <p className="nothing-eyebrow">
              No projects yet
            </p>

            <p className="nothing-mono text-xs text-ink-mute uppercase tracking-[0.14em]">
              Create your first project to begin
            </p>
          </div>
        ) : (
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{
              background: "var(--color-border)",
            }}
          >
            <AnimatePresence mode="popLayout">
              {projects.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    delay: i * 0.03,
                    duration: 0.25,
                  }}
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