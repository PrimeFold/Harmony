"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, markTaskActive, markTaskComplete, markTaskTodo, renameTask } from "../app/api/tasks/action";
import { Task } from "../app/types/task";

interface Props {
  task: Task;
  children: (open: (e: React.MouseEvent) => void) => React.ReactNode;
}

export function ContextMenu({ task, children }: Props) {
  const queryClient = useQueryClient();
  
  // THE ONLY ID WE CARE ABOUT: Standardized once at the top level
  const safeId = String(task.projectId).trim();
  const projectKey = ['project', safeId];

  const updateCache = (updater: (task: Task) => Task) => {
    // --- DIAGNOSTIC LOGS ---
    console.group("🔍 Cache Debug");
    const allQueries = queryClient.getQueryCache().getAll();
    console.log("1. Looking for Key:", projectKey);
    
    const existingData = queryClient.getQueryData(projectKey);
    console.log("2. Found Data?", existingData ? "YES ✅" : "NO ❌");
    
    if (!existingData) {
      console.log("3. Current Cache Contents:", allQueries.map(q => q.queryKey));
    }
    console.groupEnd();
    // ------------------------

    queryClient.setQueryData(projectKey, (old: any) => {
      if (!old) return old;
      return {
        ...old,
        tasks: old.tasks.map((t: Task) => (t.id === task.id ? updater(t) : t)),
      };
    });
  };

  const { mutate: updateStatusToComplete } = useMutation({
    mutationFn: () => markTaskComplete(task.id),
    onMutate: () => updateCache(t => ({ ...t, status: "completed" })),
    onSettled: () => queryClient.invalidateQueries({ queryKey: projectKey })
  });

  const { mutate: updateStatusToActive } = useMutation({
    mutationFn: () => markTaskActive(task.id),
    onMutate: () => updateCache(t => ({ ...t, status: "active" })),
    onSettled: () => queryClient.invalidateQueries({ queryKey: projectKey })
  });

  const { mutate: updateStatusToTodo } = useMutation({
    mutationFn: () => markTaskTodo(task.id),
    onMutate: () => updateCache(t => ({ ...t, status: "todo" })),
    onSettled: () => queryClient.invalidateQueries({ queryKey: projectKey })
  });

  const { mutate: updateTaskName } = useMutation({
    mutationFn: (name: string) => renameTask(name, task.id),
    onMutate: (name) => updateCache(t => ({ ...t, name })),
    onSettled: () => queryClient.invalidateQueries({ queryKey: projectKey })
  });

  const { mutate: deleteThisTask } = useMutation({
    mutationFn: () => deleteTask(task.id),
    onMutate: () => {
      queryClient.setQueryData(projectKey, (old: any) => {
        if (!old) return old;
        return { ...old, tasks: old.tasks.filter((t: Task) => t.id !== task.id) };
      });
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: projectKey })
  });

  // UI State...
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(task.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const open = (e: React.MouseEvent) => {
    e.preventDefault();
    setRenaming(false);
    setNewName(task.name);
    setPos({ x: e.clientX, y: e.clientY });
  };
  
  const close = () => { setPos(null); setRenaming(false); };

  const commitRename = () => {
    const trimmed = newName.trim();
    if (trimmed && trimmed !== task.name) updateTaskName(trimmed);
    close();
  };

  useEffect(() => { if (renaming) inputRef.current?.focus(); }, [renaming]);

  useEffect(() => {
    if (!pos) return;
    const onMouse = (e: MouseEvent) => { 
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) close(); 
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("mousedown", onMouse);
    window.addEventListener("keydown", onKey);
    return () => { 
        window.removeEventListener("mousedown", onMouse); 
        window.removeEventListener("keydown", onKey); 
    };
  }, [pos]);

  const items = [
    task.status !== "completed" && { label: "Mark complete", onClick: () => { updateStatusToComplete(); close(); } },
    task.status !== "active" && { label: "Mark active", onClick: () => { updateStatusToActive(); close(); } },
    task.status !== "todo" && { label: "Mark todo", onClick: () => { updateStatusToTodo(); close(); } },
    { label: "Rename", onClick: () => setRenaming(true) },
    { label: "Delete", onClick: () => { deleteThisTask(); close(); }, danger: true, hint: "DEL" },
  ].filter(Boolean) as { label: string; onClick: () => void; hint?: string; danger?: boolean }[];

  return (
    <>
      {children(open)}
      {/* ... keep the same Framer Motion UI code ... */}
    </>
  );
}