import { userId} from "@/app/lib/jwt";
import { prisma } from "@/app/lib/prisma";
import { projectSchema } from "@/app/utils/zod";


export const createProject = async(name:string,deadline:Date)=>{
    
    const id = userId;

    if(!id){
        throw new Error("Unauthorized")
    }

    const result = projectSchema.safeParse({name});
    if(!result.success){
        return{
            success:false,
            message:"Enter a valid project name"
        }
    }

    try {
        
        const project = await prisma.project.create({
            data:{userId:id,name:name,expireAt:deadline}
        })

        if(!project){
            return{
                success:false,
                message:"Couldn't create project . Please Try again.."
            }
        }

        return{
            success:true,
            message:"Project created !"
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}

export const renameProject = async(newName:string,projectId:string)=>{

    try {
        
        const existingProject = await prisma.project.findFirst({
            where:{id:projectId}
        })

        if(!existingProject){
            return{
                success:false,
                message:"Project doesn't exist"
            }
        }

        const renamedProject = await prisma.project.update({
            where:{id:projectId},
            data:{name:newName},
            select:{
                id:true,
                name:true,
                tasks:true,
                createdAt:true
            }
        })

        return{
            success:true,
            message:"Project renamed ",
            data:renamedProject
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }

}

export const deleteProject = async(projectId:string)=>{
    try {
        const existingProject = await prisma.project.findFirst({
            where:{id:projectId}
        })

        if(!existingProject){
            return{
                success:false,
                message:"Project doesn't exist"
            }
        }

        const deleted = await prisma.project.delete({
            where:{id:projectId}
        })

        if(!deleted){
            
            throw new Error("Error deleting the project")
        }


        return{
            success:true,
            message:"Project deleted"
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}

export const getAllProjects = async()=>{
    const id  = userId;
    try {
        
        const projects = await prisma.project.findMany({
            where:{userId:id},
            select:{
                id:true,
                name:true,
                createdAt:true,
                tasks:true
            }
        })

        if(!projects){
            return{
                success:true,
                message:"No projects found!"
            }
        }

        return{
            success:true,
            message:"Projects found !",
            data:projects
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }

}

export const getProjectById = async(projectId:string)=>{
    
    try {
        
        const project = await prisma.project.findFirst({
            where:{id:projectId},
            select:{
                id:true,
                name:true,
                createdAt:true,
                tasks:true
            }
        })

        if(!project){
            return{
                success:true,
                message:"Poject not found"
            }
        }

        return{
            success:true,
            message:"Project found!",
            data:project
        }

    } catch (error) {
        throw new Error("Error fetching project")
    }
}


export const markProjectCancelled = async(projectId:string)=>{
    try {
        const cancelledProject = await prisma.project.update({
            where:{id:projectId,status:{not:"completed"}},
            data:{
                status:"cancelled"
            }
        })

        if(!cancelledProject){
            throw new Error("Couldn't mark project as cancelled")
        }

        return{
            success:true,
            message:"Project cancelled",
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}
export const markProjectComplete= async(projectId:string)=>{
    try {
        const completedProject = await prisma.project.update({
            where:{id:projectId,status:{not:"cancelled"}},
            data:{
                status:"completed"
            }
        })

        if(!completedProject){
            throw new Error("Couldn't mark project as completed")
        }

        return{
            success:true,
            message:"Project completed",
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}
export const markProjectPaused= async(projectId:string)=>{
    try {
        const pausedProject = await prisma.project.update({
            where:{id:projectId,status:{not:"cancelled"}},
            data:{
                status:"paused"
            }
        })

        if(!pausedProject){
            throw new Error("Couldn't mark project as paused")
        }

        return{
            success:true,
            message:"Project paused",
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}
export const markProjectActive= async(projectId:string)=>{
    try {
        const activeProject = await prisma.project.update({
            where:{id:projectId,status:{not:"cancelled"}},
            data:{
                status:"active"
            }
        })

        if(!activeProject){
            throw new Error("Couldn't mark project as active")
        }

        return{
            success:true,
            message:"Project active",
        }

    } catch (error) {
        return{
            success:false,
            message:(error as Error).message
        }
    }
}



