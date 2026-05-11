import AuthGuard from "@/app/pages/dashboard/components/AuthGuard";
import { Shell } from "@/components/Shell";
import QueryProvider from "@/app/providers/QueryProvider";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AuthGuard>
        {(user)=>(
          <Shell user={user} variant="app" active="app" >
            {children}
            
          </Shell>
        )}
      </AuthGuard>
    </QueryProvider>
  );
}