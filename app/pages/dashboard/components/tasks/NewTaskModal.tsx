

import { useState } from "react";
import { TaskStatusPicker } from "./TaskStatusPicker";
import { TaskFormFields } from "./TaskFormFields";
import { Task } from "@/app/types/task";
import { Modal } from "@/components/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/app/api/tasks/action";
import { Project } from "@/app/types/project";


type TaskProps = {
  project:Project
  open: boolean;
  onClose: () => void; 
};


export function NewTaskModal({
  project,
  open,
  onClose,
}: TaskProps) {

  const [title, setTitle] =
    useState("");


  const [status, setStatus] = useState<Task["status"]>("todo");

  const reset = () => {
    setTitle("");
    setStatus("todo");
  };

  const queryClient = useQueryClient();
  const {mutate:createTaskMutation,isPending}=useMutation({
    mutationFn:async()=>{
      const res = await createTask(title,project.id)
      if(!res.success){
        throw new Error(res.message)
      }
      return res.data;
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['project',project.id]}),
      onClose(),
      reset();
    }
  })

  const submit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }
    createTaskMutation();
  };
  

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New task"
      eyebrow="// create"
    >

      <form
        onSubmit={submit}
        className="space-y-5"
      >

        <TaskFormFields
          title={title}
          onTitleChange={setTitle}
        />

        <TaskStatusPicker
          value={status}
          onChange={setStatus}
        />

        <div className="flex gap-3 pt-2">
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