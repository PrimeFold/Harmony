"use client";

import { useState } from "react";



import {
  Task,
  TaskStatus,
} from "@/lib/halftone-data";

import { TaskStatusPicker } from "./TaskStatusPicker";

import { TaskFormFields } from "./TaskFormFields";
import { Modal } from "../Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (t: Task) => void;
};

export function NewTaskModal({
  open,
  onClose,
  onCreate,
}: Props) {
  const [title, setTitle] =
    useState("");

  const [meta, setMeta] =
    useState("");

  const [status, setStatus] =
    useState<TaskStatus>(
      "todo"
    );

  const reset = () => {
    setTitle("");
    setMeta("");
    setStatus("todo");
  };

  const submit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    onCreate({
      id: `T-${Math.random()
        .toString(36)
        .slice(2, 5)
        .toUpperCase()}`,

      title: title.trim(),

      meta:
        meta.trim() || "—",

      status,
    });

    reset();
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
          meta={meta}
          onTitleChange={setTitle}
          onMetaChange={setMeta}
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