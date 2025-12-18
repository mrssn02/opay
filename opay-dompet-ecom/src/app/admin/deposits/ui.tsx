"use client";
import { useEffect, useState } from "react";

type Row = {
  id: string;
  userId: string;
  accountId: string;
  amount: bigint | string;
  status: string;
  note?: string | null;
  createdAt: string;
};

export function AdminDepositsClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/deposits?status=PENDING");
    const j = await r.json();
    setRows(j.rows ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function act(id: string, type: "approve" | "reject") {
    setMsg(null);
    const reason = type === "reject" ? prompt("Alasan reject? (opsional)") ?? "" : "";
    const res = await fetch(`/api/admin/deposits/${id}/${type}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: type === "reject" ? JSON.stringify({ reason }) : undefined,
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(j.error ?? "Gagal");
    setMsg(`Berhasil ${type} #${id.slice(0, 6)}`);
    await load();
  }

  return (
    <div className="grid gap-4">
      <div className="card p-6">
        <h1 className="text-xl font-semibold">Deposit Requests (PENDING)</h1>
        <p className="mt-1 text-slate-600 text-sm">Approve akan menambah saldo user + membuat ledger.</p>
        {msg ? <div className="mt-3 text-sm">{msg}</div> : null}
      </div>

      <div className="card p-6 overflow-x-auto">
        {loading ? (
          <div className="text-slate-600">Loading...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="text-slate-500">
              <tr className="border-b">
                <th className="py-2 text-left">ID</th>
                <th className="py-2 text-left">User</th>
                <th className="py-2 text-left">Amount</th>
                <th className="py-2 text-left">Note</th>
                <th className="py-2 text-left">Created</th>
                <th className="py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((x) => (
                <tr key={x.id} className="border-b last:border-b-0">
                  <td className="py-2 font-mono">#{x.id.slice(0, 8)}</td>
                  <td className="py-2 font-mono">{x.userId.slice(0, 8)}</td>
                  <td className="py-2">Rp {Number(x.amount).toLocaleString("id-ID")}</td>
                  <td className="py-2 text-slate-600">{x.note ?? "-"}</td>
                  <td className="py-2">{new Date(x.createdAt).toLocaleString("id-ID")}</td>
                  <td className="py-2 flex gap-2">
                    <button className="btn btn-primary" onClick={() => act(x.id, "approve")}>Approve</button>
                    <button className="btn" onClick={() => act(x.id, "reject")}>Reject</button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr><td className="py-3 text-slate-500" colSpan={6}>Tidak ada request pending.</td></tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
