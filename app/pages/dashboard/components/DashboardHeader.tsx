type Props = {
  projectsCount: number;
  search: string;
  setSearch: (v: string) => void;
  onNewProject: () => void;
};

export function DashboardHeader({
  projectsCount,
  search,
  setSearch,
  onNewProject,
}: Props) {
  return (
    <section className="nothing-hairline-b">
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col lg:flex-row justify-between gap-6 lg:items-end">
        <div>
          <p className="nothing-eyebrow mb-3 flex items-center gap-2">
            <span className="nothing-signal-dot" />
            workspace · default
          </p>

          <h1 className="nothing-display text-5xl">Projects</h1>

          <p className="text-sm text-muted-foreground mt-3 max-w-md">
            {projectsCount} workspaces. Click any to open the brief and tasks.
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
            onClick={onNewProject}
            className="nothing-btn nothing-btn--signal whitespace-nowrap"
          >
            + New project
          </button>
        </div>
      </div>
    </section>
  );
}