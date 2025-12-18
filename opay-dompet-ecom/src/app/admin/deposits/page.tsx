import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminDepositsClient } from "./ui";

export default function AdminDepositsPage() {
  const session = getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");
  return <AdminDepositsClient />;
}
