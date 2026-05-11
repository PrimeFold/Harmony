"use client";

import { useState } from "react";
import { TaskStatusPicker } from "./TaskStatusPicker";
import { TaskFormFields } from "./TaskFormFields";
import { Task } from "@/app/types/task";
import { Modal } from "@/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/app/api/tasks/action";
import { Project } from "@/app/types/project";

type TaskProps = {
  project: Project;
  open: boolean;
  onClose: () => void;
};

export function NewTaskModal({ project, open, onClose }: TaskProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Task["status"]>("todo");

  const reset = () => {
    setTitle("");
    setStatus("todo");
  };

  const queryClient = useQueryClient();

  const { mutate: createTaskMutation } = useMutation({
    mutationFn: async (vars: { name: string; projectId: string; status: Task["status"] }) => {
      const res = await createTask(vars.name, vars.projectId, vars.status);
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onMutate: async (newVars) => {
      await queryClient.cancelQueries({ queryKey: ["project", project.id] });
      const previousProject = queryClient.getQueryData(["project", project.id]);

      queryClient.setQueryData(["project", project.id], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          tasks: [
            {
              id: `temp-${Date.now()}`,
              name: newVars.name, 
              status: newVars.status,
              description: "",
              projectId: project.id,
            },
            ...(old.tasks || []),
          ],
        };
      });

      onClose();
      reset();
      return { previousProject };
    },

    onError: (err, variables, context: any) => {
      if (context?.previousProject) {
        queryClient.setQueryData(["project", project.id], context.previousProject);
      }
      alert(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project", project.id] });
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    createTaskMutation({
      name: title,
      projectId: project.id,
      status: status,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New task"
      eyebrow="// create"
    >
      <form onSubmit={submit} className="space-y-5">
        <TaskFormFields title={title} onTitleChange={setTitle} />

        <TaskStatusPicker value={status} onChange={setStatus} />

        <div className="flex gap-3 pt-2">
          <button type="submit" className="nothing-btn nothing-btn--signal flex-1">
            Create ↗
          </button>

          <button type="button" onClick={onClose} className="nothing-btn">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}