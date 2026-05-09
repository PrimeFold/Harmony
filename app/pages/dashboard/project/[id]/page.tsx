import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/app/lib/services/auth.service";

import { redirect } from "next/navigation";
import { ProjectView } from "./ProjectView";

type Props = {
  params: { projectId: string };
};

export default async function ProjectPage({ params }: Props) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;
  if (!token) redirect("/auth/signIn");

  const user = await getAuthenticatedUser(token);
  if (!user) redirect("/auth/signIn");

  return <ProjectView projectId={params.projectId} user={user} />;
}