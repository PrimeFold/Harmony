import AuthGuard from "@/app/pages/dashboard/components/AuthGuard";
import { Shell } from "@/components/Shell";
import QueryProvider from "@/app/providers/QueryProvider";
import { UserDock } from "@/components/UserDock";


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
            <UserDock user={user} />
            {children}

          </Shell>
        )}
      </AuthGuard>
    </QueryProvider>
  );
}