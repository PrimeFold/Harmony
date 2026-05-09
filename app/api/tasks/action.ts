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
                projectId:true,
                status:true
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
                projectId:true,
                status:true
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
            data:{name:newName},
            select:{
                id:true,
                name:true,
                projectId:true,
                status:true
            }
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
            },
            select:{
                id:true,
                name:true,
                projectId:true,
                status:true
            }
        })

        if(!completedTask){
            throw new Error("Couldn't mark task as completed")
        }

        return{
            success:true,
            message:"Task completed",
            data:completedTask
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
            where:{id:taskId,status:"completed"},
            data:{
                status:"active"
            },
            select:{
                id:true,
                name:true,
                projectId:true,
                status:true
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
export const markTaskTodo = async(taskId:string)=>{
    try {
        const activeTask = await prisma.task.update({
            where:{id:taskId},
            data:{
                status:"todo"
            },
            select:{
                id:true,
                name:true,
                projectId:true,
                status:true
            }
        })

        if(!activeTask){
            throw new Error("Couldn't mark task as todo")
        }

        return{
            success:true,
            message:"Task added to todo",
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



