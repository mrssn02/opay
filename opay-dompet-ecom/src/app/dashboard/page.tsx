import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { DepositWithdrawPanel } from "./widgets";

export default async function DashboardPage() {
  const session = getSession();
  if (!session) redirect("/login");

  const wallet = await prisma.wallet.findUnique({ where: { userId: session.userId } });
  const balance = wallet?.balance ?? 0n;

  const ledger = wallet
    ? await prisma.ledgerEntry.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: "desc" },
        take: 20,
      })
    : [];

  return (
    <div className="grid gap-6">
      <div className="card p-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-slate-600 text-sm">Saldo & transaksi dompetmu.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">Saldo</div>
          <div className="text-2xl font-semibold">Rp {Number(balance).toLocaleString("id-ID")}</div>
        </div>
      </div>

      <DepositWithdrawPanel />

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Riwayat (20 terakhir)</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-slate-500">
              <tr className="border-b">
                <th className="py-2 text-left">Waktu</th>
                <th className="py-2 text-left">Tipe</th>
                <th className="py-2 text-left">Nominal</th>
                <th className="py-2 text-left">Ref</th>
                <th className="py-2 text-left">Catatan</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((x) => (
                <tr key={x.id} className="border-b last:border-b-0">
                  <td className="py-2">{new Date(x.createdAt).toLocaleString("id-ID")}</td>
                  <td className="py-2">
                    <span className={x.type === "CREDIT" ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                      {x.type}
                    </span>
                  </td>
                  <td className="py-2">Rp {Number(x.amount).toLocaleString("id-ID")}</td>
                  <td className="py-2">{x.refType ?? "-"} {x.refId ? `#${x.refId.slice(0,6)}` : ""}</td>
                  <td className="py-2 text-slate-600">{x.note ?? "-"}</td>
                </tr>
              ))}
              {ledger.length === 0 ? (
                <tr><td className="py-3 text-slate-500" colSpan={5}>Belum ada transaksi.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
