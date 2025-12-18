"use client";
import { useEffect, useState } from "react";

type Row = { id: string; bankName: string; accountNo: string; accountName: string; isActive: boolean; createdAt: string };

export function DepositAccountsClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  const [bankName, setBankName] = useState("BCA");
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isActive, setIsActive] = useState(true);

  async function load() {
    const r = await fetch("/api/admin/deposit-accounts");
    const j = await r.json();
    setRows(j.rows ?? []);
  }

  useEffect(() => { load(); }, []);

  async function create() {
    setMsg(null);
    const res = await fetch("/api/admin/deposit-accounts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bankName, accountNo, accountName, isActive }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(j.error ?? "Gagal");
    setMsg("Rekening ditambahkan.");
    setAccountNo("");
    setAccountName("");
    await load();
  }

  async function toggle(id: string, value: boolean) {
    setMsg(null);
    const res = await fetch(`/api/admin/deposit-accounts/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ isActive: value }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(j.error ?? "Gagal");
    await load();
  }

  async function del(id: string) {
    if (!confirm("Hapus rekening ini?")) return;
    setMsg(null);
    const res = await fetch(`/api/admin/deposit-accounts/${id}`, { method: "DELETE" });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(j.error ?? "Gagal");
    await load();
  }

  return (
    <div className="grid gap-4">
      <div className="card p-6">
        <h1 className="text-xl font-semibold">Rekening Deposit</h1>
        <p className="mt-1 text-slate-600 text-sm">User hanya melihat rekening yang aktif.</p>
        {msg ? <div className="mt-3 text-sm">{msg}</div> : null}
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Tambah Rekening</h2>
        <div className="mt-3 grid md:grid-cols-4 gap-3">
          <div>
            <div className="label">Bank</div>
            <input className="input" value={bankName} onChange={(e) => setBankName(e.target.value)} />
          </div>
          <div>
            <div className="label">No Rek</div>
            <input className="input" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
          </div>
          <div>
            <div className="label">Nama</div>
            <input className="input" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
          </div>
          <div className="flex items-end gap-2">
            <label className="text-sm text-slate-700 flex items-center gap-2">
              <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
              Aktif
            </label>
            <button className="btn btn-primary" onClick={create}>Tambah</button>
          </div>
        </div>
      </div>

      <div className="card p-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-slate-500">
            <tr className="border-b">
              <th className="py-2 text-left">Bank</th>
              <th className="py-2 text-left">No Rek</th>
              <th className="py-2 text-left">Nama</th>
              <th className="py-2 text-left">Status</th>
              <th className="py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id} className="border-b last:border-b-0">
                <td className="py-2">{x.bankName}</td>
                <td className="py-2">{x.accountNo}</td>
                <td className="py-2">{x.accountName}</td>
                <td className="py-2">{x.isActive ? "Aktif" : "Nonaktif"}</td>
                <td className="py-2 flex gap-2">
                  <button className="btn" onClick={() => toggle(x.id, !x.isActive)}>{x.isActive ? "Nonaktifkan" : "Aktifkan"}</button>
                  <button className="btn" onClick={() => del(x.id)}>Hapus</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr><td className="py-3 text-slate-500" colSpan={5}>Belum ada rekening.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
