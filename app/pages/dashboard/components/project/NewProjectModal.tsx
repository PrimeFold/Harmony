"use client";

import { useState } from "react";

import { Modal } from "@/components/Modal";
import { createProject, getAllProjects } from "@/app/api/project/action";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { User } from "@/app/types/user";
import { Project } from "@/app/types/project";
import { ProjectLoader } from "./ProjectLoader";

type Props = {
  open: boolean;
  onClose: () => void;
  user:User
};

export function NewProjectModal({
  user,
  open,
  onClose,
}: Props) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [start, setStart] = useState("");
  const [expireAt, setExpireAt] = useState("");
  const [description,setDescription] = useState("")
  type ProjectStatus = Project["status"];

  const statuses: ProjectStatus[] = [
    "active",
    "paused",
    "completed",
  ];
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
  const deadlineAsDate = new Date(expireAt)

  const {data: projectResponse , isLoading , isError} = useQuery({
    queryKey:['projects',user.id],
    queryFn:async()=>getAllProjects(user.id)
  })

  const { mutate, isPending } = useMutation({
    mutationFn: async() => createProject(name, deadlineAsDate, user.id, description), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", user.id] });
      reset();
      onClose(); 
    }
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expireAt) {
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setExpireAt(defaultDate.toISOString().slice(0, 10));
    }

    if (!name.trim()) return;
    mutate();
  };
  if(isLoading) return  <ProjectLoader />;
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

          <label className="nothing-label">
            Description
          </label>
          <input
            className="nothing-input"
            value={description}
            onChange={(e) =>
              setName(e.target.value)
            }
            placeholder="Project Description"
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
          {statuses.map((s) => {
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
              value={expireAt}
              onChange={(e) =>
                setExpireAt(e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="nothing-btn nothing-btn--signal flex-1"
            disabled={isPending}
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