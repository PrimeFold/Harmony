"use client";

import { useState } from "react";

import {
  PROJECT_STATUSES,
  type Project,
  type ProjectStatus,
} from "@/lib/halftone-data";

import { Modal } from "@/app/components/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (p: Project) => void;
};

export function NewProjectModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] =
    useState<ProjectStatus>("draft");

  const [start, setStart] = useState("");
  const [deadline, setDeadline] = useState("");

  const reset = () => {
    setName("");
    setDesc("");
    setStatus("draft");
    setStart("");
    setDeadline("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    onCreate({
      id: `p-${Math.random()
        .toString(36)
        .slice(2, 6)}`,

      name: name.trim(),

      description: desc.trim() || "—",

      status,

      start:
        start ||
        new Date()
          .toISOString()
          .slice(0, 10),

      deadline:
        deadline ||
        new Date(
          Date.now() +
            1000 * 60 * 60 * 24 * 30
        )
          .toISOString()
          .slice(0, 10),

      members: 1,
      tasks: [],
    });

    reset();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New project"
      eyebrow="// create"
    >
      <form
        onSubmit={submit}
        className="space-y-5"
      >
        <div>
          <label className="nothing-label">
            Name
          </label>

          <input
            className="nothing-input"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Project name"
          />
        </div>

        <div>
          <label className="nothing-label">
            Brief
          </label>

          <textarea
            className="nothing-textarea"
            value={desc}
            onChange={(e) =>
              setDesc(e.target.value)
            }
            placeholder="What's this project for?"
          />
        </div>

        <div>
          <label className="nothing-label">
            Status
          </label>

          <div className="flex flex-wrap gap-2">
            {PROJECT_STATUSES.map((s:any) => {
              const selected = status === s;

              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className="nothing-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 border"
                  style={{
                    borderColor: selected
                      ? "var(--color-signal)"
                      : "var(--color-border)",

                    color: selected
                      ? "var(--color-signal)"
                      : "var(--color-ink-mute)",
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
            <label className="nothing-label">
              Start
            </label>

            <input
              type="date"
              className="nothing-input"
              value={start}
              onChange={(e) =>
                setStart(e.target.value)
              }
            />
          </div>

          <div>
            <label className="nothing-label">
              Deadline
            </label>

            <input
              type="date"
              className="nothing-input"
              value={deadline}
              onChange={(e) =>
                setDeadline(e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="nothing-btn nothing-btn--signal flex-1"
          >
            Create ↗
          </button>

          <button
            type="button"
            onClick={onClose}
            className="nothing-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}