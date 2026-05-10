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

  const updateCache = (updater: (task: Task) => Task) => {
    queryClient.setQueryData(['project', task.projectId], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        tasks: old.tasks.map((t: Task) => t.id === task.id ? updater(t) : t),
      };
    });
  };

  const { mutate: updateStatusToComplete } = useMutation({
    mutationFn: () => markTaskComplete(task.id),
    onMutate: () => {
      console.log('=== COMPLETE ===');
      console.log('task:', task);
      console.log('projectId:', task.projectId);
      console.log('cache:', queryClient.getQueryData(['project', task.projectId]));
      updateCache(t => ({ ...t, status: "completed" }));
      console.log('cache after:', queryClient.getQueryData(['project', task.projectId]));
    },
  });
  
  const { mutate: updateStatusToActive } = useMutation({
    mutationFn: () => markTaskActive(task.id),
    onMutate: () => {
      console.log('=== ACTIVE ===');
      console.log('task:', task);
      console.log('projectId:', task.projectId);
      console.log('cache:', queryClient.getQueryData(['project', task.projectId]));
      updateCache(t => ({ ...t, status: "active" }));
      console.log('cache after:', queryClient.getQueryData(['project', task.projectId]));
    },
  });
  
  const { mutate: updateStatusToTodo } = useMutation({
    mutationFn: () => markTaskTodo(task.id),
    onMutate: () => {
      console.log('=== TODO ===');
      console.log('task:', task);
      console.log('projectId:', task.projectId);
      console.log('cache:', queryClient.getQueryData(['project', task.projectId]));
      updateCache(t => ({ ...t, status: "todo" }));
      console.log('cache after:', queryClient.getQueryData(['project', task.projectId]));
    },
  });
  
  const { mutate: updateTaskName } = useMutation({
    mutationFn: (name: string) => renameTask(name, task.id),
    onMutate: (name) => {
      console.log('=== RENAME ===');
      console.log('task:', task);
      console.log('new name:', name);
      console.log('cache:', queryClient.getQueryData(['project', task.projectId]));
      updateCache(t => ({ ...t, name }));
      console.log('cache after:', queryClient.getQueryData(['project', task.projectId]));
    },
  });
  
  const { mutate: deleteThisTask } = useMutation({
    mutationFn: () => deleteTask(task.id),
    onMutate: () => {
      console.log('=== DELETE ===');
      console.log('task:', task);
      console.log('projectId:', task.projectId);
      console.log('cache:', queryClient.getQueryData(['project', task.projectId]));
      queryClient.setQueryData(['project', task.projectId], (old: any) => {
        if (!old) return old;
        return { ...old, tasks: old.tasks.filter((t: Task) => t.id !== task.id) };
      });
      console.log('cache after:', queryClient.getQueryData(['project', task.projectId]));
    },
  });
  const [pos, setPos]           = useState<{ x: number; y: number } | null>(null);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName]   = useState(task.name);
  const inputRef                = useRef<HTMLInputElement>(null);
  const menuRef                 = useRef<HTMLDivElement>(null);

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
    const onMouse = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) close(); };
    const onKey   = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("mousedown", onMouse);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("mousedown", onMouse); window.removeEventListener("keydown", onKey); };
  }, [pos]);

  const items = [
    task.status !== "completed" && { label: "Mark complete", onClick: () => { updateStatusToComplete(); close(); } },
    task.status !== "active"   && { label: "Mark active",   onClick: () => { updateStatusToActive();   close(); } },
    task.status !== "todo"     && { label: "Mark todo",     onClick: () => { updateStatusToTodo();     close(); } },
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
            className="nothing-ctx fixed z-60"
            style={{ left: pos.x, top: pos.y }}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.12 }}
          >
            {renaming ? (
              <div className="nothing-ctx-item">
                <input
                  ref={inputRef}
                  className="bg-transparent outline-none w-full text-sm"
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
              items.map((it, i) => (
                <button
                  key={i}
                  className="nothing-ctx-item"
                  onClick={it.onClick}
                  style={it.danger ? { color: "var(--color-signal)" } : undefined}
                >
                  <span>{it.label}</span>
                  {it.hint && <span className="text-[9px] tracking-[0.18em] text-ink-mute">{it.hint}</span>}
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}