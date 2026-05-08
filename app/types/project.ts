import { Task } from "./task"

export interface Project{
    id:string,
    userId: string;
    description?: string;
    name:string,
    tasks:Task[];
    createdAt: Date;
    status: "active" | "paused" | "cancelled" | "completed"
    deadline: string | Date;
}