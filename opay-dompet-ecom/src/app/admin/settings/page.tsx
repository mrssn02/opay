import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SettingsClient } from "./ui";

export default function SettingsPage() {
  const session = getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");
  return <SettingsClient />;
}
