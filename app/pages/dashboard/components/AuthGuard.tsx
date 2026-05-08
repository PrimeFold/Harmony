// components/auth/AuthGuard.tsx
import { generateRefreshToken } from "@/app/api/auth/action";
import { getAuthenticatedUser } from "@/app/lib/services/auth.service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export default async function AuthGuard({ children }: { children: (user: any) => React.ReactNode }) {

    const cookieStore = await cookies();
    let accessToken = cookieStore.get("access-token")?.value;
    const refreshToken = cookieStore.get("refresh-token")?.value;
    
    let user = accessToken ? await getAuthenticatedUser(accessToken) : null;
    
    if (!user && refreshToken) {
      const rotation = await generateRefreshToken();
      if (rotation.success) {
        const newAccess = (await cookies()).get("access-token")?.value;
        user = await getAuthenticatedUser(newAccess!);
      }
    }
  
    if (!user) redirect("/sign-in");
  
    // Pass the user object back to the layout
    return <>{children(user)}</>;
}