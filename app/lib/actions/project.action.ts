"use server"

import { getAllProjects } from "@/app/api/project/action";
import { getUserIdFromCookies } from "../auth-utils";


export async function fetchProjectsAction() {
  try {
    const userId = await getUserIdFromCookies();

    if(!userId){
        throw new Error("Unauthorized")
    }

    return await getAllProjects(userId);
    
  } catch (error) {
    throw new Error("Failed to fetch projects");
  }
}