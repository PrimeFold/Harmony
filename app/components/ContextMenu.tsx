import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, markTaskActive, markTaskComplete, markTaskTodo, renameTask } from "../api/tasks/action";
import { User } from "../types/user";
import { Task } from "../types/task";

interface Props {
  task: Task;
  user: User;
  children: (open: (e: React.MouseEvent) => void) => React.ReactNode;
}

export function ContextMenu({ task, user, children }: Props) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["projects", user.id] });

  const { mutate: updateStatusToComplete } = useMutation({ mutationFn: () => markTaskComplete(task.id), onSuccess: invalidate });
  const { mutate: deleteThisTask }         = useMutation({ mutationFn: () => deleteTask(task.id),        onSuccess: invalidate });
  const { mutate: updateStatusToActive }   = useMutation({ mutationFn: () => markTaskActive(task.id),    onSuccess: invalidate });
  const { mutate: updateStatusToTodo }     = useMutation({ mutationFn: () => markTaskTodo(task.id),      onSuccess: invalidate });
  const { mutate: updateTaskName }         = useMutation({ mutationFn: (name: string) => renameTask(name, task.id), onSuccess: invalidate });

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

  // Focus input when rename mode activates
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
    { label: "Rename",  onClick: () => setRenaming(true) },
    { label: "Delete",  onClick: () => { deleteThisTask(); close(); }, danger: true, hint: "DEL" },
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