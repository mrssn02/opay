import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DepositAccountsClient } from "./ui";

export default function DepositAccountsPage() {
  const session = getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");
  return <DepositAccountsClient />;
}
