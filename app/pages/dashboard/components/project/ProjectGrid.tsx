"use client";

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
  
  // LOG 1: Check if the component even sees the user
  console.log("1. Grid Render - User ID:", user?.id);

  const { data: projectResponse, isLoading, isError, error } = useQuery({
    queryKey: ["projects", user.id],
    queryFn: async () => {
      console.log("2. TRIGGERING QUERY FN...");
      const response = await getAllProjects(user.id);
      
      console.log("3. RESPONSE RECEIVED:", response);

      // THE RESPONSE CHECK
      if (!response) {
        console.error("4a. ERROR: No response object returned from action");
        throw new Error("No response from server");
      }

      if (!response.success) {
        console.error("4b. ERROR: Action returned success: false", response.message);
        throw new Error(response.message || "Failed to fetch");
      }

      console.log("DEBUG: Final State", {
        rawProjectsCount: projects.length,
        filterValue: filter,
        afterFilterCount: filtered.length
      });
      return response;
    },
    enabled: !!user?.id, // Only run if user ID exists
    staleTime: 0,        // Don't use old cache
  });

  // Safe extraction
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
    }
    return result;
  }, [projects, filter, sortBy]);

  // LOG 5: Check for Query Errors
  if (isError) console.error("QUERY ERROR:", error);

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-10">
        {isLoading ? (
          <div className="py-24 flex flex-col items-center gap-4 nothing-fade-up">
             <p className="nothing-eyebrow nothing-blink">Initializing sync...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-24">
            <p className="nothing-eyebrow text-signal uppercase tracking-widest">
              // Sync Error: { (error as Error)?.message || "Check Console" }
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-3">
            <div className="nothing-signal-dot" />
            <p className="nothing-eyebrow">Empty Workspace</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03 }}
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