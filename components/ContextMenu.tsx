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
          <AnimatePresence>
            {pos && (
              <motion.div
                ref={menuRef}
                className="fixed z-[100] min-w-[160px] bg-white border border-neutral-200 shadow-xl rounded-lg overflow-hidden p-1"
                style={{ left: pos.x, top: pos.y }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                {renaming ? (
                  <div className="p-2">
                    <input
                      ref={inputRef}
                      className="w-full bg-neutral-100 border-none outline-none rounded px-2 py-1 text-sm"
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") { e.preventDefault(); commitRename(); }
                        if (e.key === "Escape") close();
                      }}
                      onBlur={commitRename}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {items.map((it, i) => (
                      <button
                        key={i}
                        className="flex items-center justify-between w-full px-3 py-2 text-sm text-left hover:bg-neutral-100 transition-colors rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          it.onClick();
                        }}
                        style={it.danger ? { color: "#ef4444" } : { color: "#171717" }}
                      >
                        <span>{it.label}</span>
                        {it.hint && <span className="text-[10px] opacity-40 ml-4">{it.hint}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      );
    }

 