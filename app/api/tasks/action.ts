import { prisma } from "@/app/lib/prisma";
import { taskSchema } from "@/app/utils/zod"


export const createTask = async(name:string,projectId:string)=>{
    const result = taskSchema.safeParse({name});
    if(!result.success){
        throw new Error("Invalid task name..Please try again")
    }

    try {
        
        const task  = await prisma.task.create({
            data:{name:name,projectId:projectId},
            select:{
                id:true,
                name:true,
                projectId:true
            }
        })

        if(!task){
            throw new Error("Error creating Task")
        }

        return{
            success:true,
            message:"Task  created !",
            data:task
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }


}

export const getTasksByProjectId = async(projectId:string)=>{
    if(!projectId){
        throw new Error("project not found !")
    }

    try {
        const tasks = await prisma.task.findMany({
            where:{projectId:projectId},
            select:{
                id:true,
                name:true,
                projectId:true
            }
        })

        if(!tasks){
            return{
                success:true,
                message:"No Tasks found . Create One?"
            }
        }

        return{
            success:true,
            message:"Tasks found !",
            data:tasks
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}

export const renameTask = async(taskId:string,newName:string)=>{
    if(!taskId){
        throw new Error("project not found !")
    }

    try {
        const task = await prisma.task.update({
            where:{id:taskId},
            data:{name:newName}
        })

        if(!task){
            return{
                success:true,
                message:"No Tasks found . Create One?"
            }
        }

        return{
            success:true,
            message:"Tasks found !"
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}



export const markTaskComplete = async(taskId:string)=>{
    try {
        const completedTask = await prisma.task.update({
            where:{id:taskId},
            data:{
                status:"completed"
            }
        })

        if(!completedTask){
            throw new Error("Couldn't mark task as completed")
        }

        return{
            success:true,
            message:"Task completed",
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}

export const markTaskPaused = async(taskId:string)=>{
    try {
        const pausedTask = await prisma.task.update({
            where:{id:taskId},
            data:{
                status:"paused"
            }
        })

        if(!pausedTask){
            throw new Error("Couldn't mark task as paused")
        }

        return{
            success:true,
            message:"Task paused",
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}

export const markTaskActive = async(taskId:string)=>{
    try {
        const activeTask = await prisma.task.update({
            where:{id:taskId,status:"paused"},
            data:{
                status:"active"
            }
        })

        if(!activeTask){
            throw new Error("Couldn't mark task as active")
        }

        return{
            success:true,
            message:"Task active",
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}
export const markTaskCancelled = async(taskId:string)=>{
    try {
        const cancelledTask = await prisma.task.update({
            where:{id:taskId,status:{not:"completed"}},
            data:{
                status:"cancelled"
            }
        })

        if(!cancelledTask){
            throw new Error("Couldn't mark task as cancelled")
        }

        return{
            success:true,
            message:"Task cancelled",
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}
export const deleteTask = async(taskId:string)=>{
    try {
        const deletedTask = await prisma.task.delete({
            where:{id:taskId}
        })

        if(!deletedTask){
            throw new Error("Couldn't delete task")
        }

        return{
            success:true,
            message:"Task deleted",
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}



