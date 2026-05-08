"use client";

import { useMemo, useState } from "react";

import {
  PROJECT_STATUSES,
  seedProjects,
  type Project,
  type ProjectStatus,
} from "@/lib/halftone-data";

import { Shell } from "@/app/components/Shell";

import { DashboardHeader } from "./components/DashboardHeader";

import { ProjectGrid } from "./components/ProjectGrid";
import { FilterBar } from "./components/Filterbar";
import { NewProjectModal } from "./components/NewProjectModal";


export type Filter = "all" | ProjectStatus;

export default function DashboardPage() {
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
    const c: Record<Filter, number> = {
      all: projects.length,
      active: 0,
      paused: 0,
      draft: 0,
      completed: 0,
    };

    projects.forEach((p) => (c[p.status] += 1));

    return c;
  }, [projects]);

  return (
    <Shell active="app">
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

      <ProjectGrid projects={visible} />

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