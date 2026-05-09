import { verifyAccessToken } from "../jwt";
import { prisma } from "../prisma";

export async function getAuthenticatedUser(token: string) {
  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  //Fetching user's id , name , email.. NOTE : WE'RE DOING THIS VERFICATION HERE AGAIN BECAUSE - The jwt.ts file is used only for token verification purposes which returns a payload with userId
  const data = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, username: true, email: true} 
  })
  return data;
}