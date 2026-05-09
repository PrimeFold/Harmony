import { Task } from "./task"

export interface Project{
    id:string,
    name:string,
    description?: string;
    tasks:Task[];
    createdAt: Date;
    expireAt: Date;
    status: "active" | "paused" | "cancelled" | "completed"
}