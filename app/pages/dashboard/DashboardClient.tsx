"use client";

import { useMemo, useState } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { ProjectGrid } from "./components/project/ProjectGrid";
import { NewProjectModal } from "./components/project/NewProjectModal";
import { User } from "@/app/types/user";
import { Project } from "@/app/types/project";
import { FilterBar } from "./components/project/Filterbar";

type ProjectStatus = Project["status"];
export type Filter = "all" | ProjectStatus;

export function DashboardClient({ user }: { user: User }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"expireAt" | "start" | "name">("expireAt");
  const [modal, setModal] = useState(false);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: projects.length,
      active: 0,
      paused: 0,
      completed: 0,
    };
    projects.forEach((p) => (c[p.status] += 1));
    return c;
  }, [projects]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <DashboardHeader
        projectsCount={projects.length}
        search={search}
        setSearch={setSearch}
        onNewProject={() => setModal(true)}
      />
      <FilterBar
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        counts={counts}
      />
      <ProjectGrid filter={filter} sortBy={sortBy} user={user} />
      <NewProjectModal
        open={modal}
        onClose={() => setModal(false)}
        user={user}
      />
    </div>
  );
}