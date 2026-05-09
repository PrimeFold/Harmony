import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/app/lib/services/auth.service";
import { redirect } from "next/navigation";
import { SettingsView } from "./SettingsView";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;
  if (!token) redirect("/auth/signIn");

  const user = await getAuthenticatedUser(token);
  if (!user) redirect("/auth/signIn");

  return <SettingsView user={user} />;
}