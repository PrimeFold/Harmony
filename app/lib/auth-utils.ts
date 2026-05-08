import { cookies } from "next/headers"
import { verifyAccessToken } from "./jwt";

export const getUserIdFromCookies = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('access-token')?.value;

  if (!token) {
    return null; 
  }

  const decoded = await verifyAccessToken(token);

  if (!decoded) {
    return null; 
  }
  return decoded.userId; 
}