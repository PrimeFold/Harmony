import { AnimatePresence, motion } from "framer-motion";

import type { Project } from "@/lib/halftone-data";

import { ProjectCard } from "./ProjectCard";

type Props = {
  projects: Project[];
};

export function ProjectGrid({ projects }: Props) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-10">

        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: "var(--color-border)" }}
        >
          <AnimatePresence mode="popLayout">
            {projects.map((p, i) => (
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

        {projects.length === 0 && (
          <div className="text-center py-24 nothing-mono text-xs uppercase tracking-[0.18em] text-ink-mute">
            No projects match this filter.
          </div>
        )}
      </div>
    </section>
  );
}