import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default function AdminHome() {
  const session = getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="grid gap-6">
      <div className="card p-6">
        <h1 className="text-xl font-semibold">Admin Panel</h1>
        <p className="mt-1 text-slate-600 text-sm">Kelola deposit/withdraw, rekening deposit, dan nomor CS WhatsApp.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link className="btn btn-primary" href="/admin/deposits">Deposit Requests</Link>
          <Link className="btn btn-primary" href="/admin/withdraws">Withdraw Requests</Link>
          <Link className="btn" href="/admin/deposit-accounts">Rekening Deposit</Link>
          <Link className="btn" href="/admin/settings">Settings</Link>
        </div>
      </div>
    </div>
  );
}
