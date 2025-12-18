import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { AdminWithdrawsClient } from "./ui";

export default function AdminWithdrawsPage() {
  const session = getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");
  return <AdminWithdrawsClient />;
}
