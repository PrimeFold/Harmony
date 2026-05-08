import AuthGuard from "@/app/pages/dashboard/components/AuthGuard";
import { Shell } from "@/app/components/Shell";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Shell>
        <main className="p-4">
          {children}
        </main>
      </Shell>
    </AuthGuard>
  );
}