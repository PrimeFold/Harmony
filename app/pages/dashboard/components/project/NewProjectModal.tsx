"use client";

import { useState } from "react";
import { Modal } from "@/components/Modal";
import { createProject } from "@/app/api/project/action";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { User } from "@/app/types/user";
import { Project } from "@/app/types/project";

type Props = {
  open: boolean;
  onClose: () => void;
  user: User;
};

export function NewProjectModal({ user, open, onClose }: Props) {
  const [name, setName]               = useState("");
  const [desc, setDesc]               = useState("");
  const [start, setStart]             = useState("");
  const [expireAt, setExpireAt]       = useState("");
  const [description, setDescription] = useState("");

  type ProjectStatus = Project["status"];
  const statuses: ProjectStatus[] = ["active", "paused", "completed"];
  const [status, setStatus] = useState<ProjectStatus>("active");

  const reset = () => {
    setName("");
    setDesc("");
    setStatus("active");
    setStart("");
    setExpireAt("");
    setDescription("");
  };

  const queryClient = useQueryClient();
  
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const deadline = expireAt
        ? new Date(expireAt)
        : (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d; })();
      const res = await createProject(name, deadline, user.id, description);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: (newProject) => {
      queryClient.setQueryData(['projects', user.id], (old: any) => {
        if (!old) return old;
        return { ...old, data: [...(old.data || []), newProject] };
      });
      reset();
      onClose();
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutate();
  };

  return (
    <Modal open={open} onClose={onClose} title="New project" eyebrow="// create">
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="nothing-label">Name</label>
          <input
            className="nothing-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
          />

          <label className="nothing-label">Description</label>
          <input
            className="nothing-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // ← was setName, now fixed
            placeholder="Project Description"
          />
        </div>

        <div>
          <label className="nothing-label">Brief</label>
          <textarea
            className="nothing-textarea"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="What's this project for?"
          />
        </div>

        <div>
          <label className="nothing-label">Status</label>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => {
              const selected = status === s;
              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => setStatus(s)}
                  className="nothing-mono text-[10px] uppercase tracking-[0.16em] px-3 py-1.5 border"
                  style={{
                    borderColor: selected ? "var(--color-signal)" : "var(--color-border)",
                    color: selected ? "var(--color-signal)" : "var(--color-ink-mute)",
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
            <label className="nothing-label">Start</label>
            <input
              type="date"
              className="nothing-input"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div>
            <label className="nothing-label">Deadline</label>
            <input
              type="date"
              className="nothing-input"
              value={expireAt}
              onChange={(e) => setExpireAt(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="nothing-btn nothing-btn--signal flex-1" disabled={isPending}>
            {isPending ? "Creating..." : "Create ↗"}
          </button>
          <button type="button" onClick={onClose} className="nothing-btn">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}