import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/app/lib/services/auth.service";

import { redirect } from "next/navigation";
import { ProjectView } from "./ProjectView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id
  
  
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;
  if (!token) redirect("/auth/signIn");

  const user = await getAuthenticatedUser(token);
  if (!user) redirect("/auth/signIn");

  return <ProjectView projectId={projectId} user={user} />;
}