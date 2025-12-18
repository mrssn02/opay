"use client";
import { useEffect, useState } from "react";

type DepositAccount = { id: string; bankName: string; accountNo: string; accountName: string };

export function DepositWithdrawPanel() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <DepositCard />
      <WithdrawCard />
    </div>
  );
}

function DepositCard() {
  const [accounts, setAccounts] = useState<DepositAccount[]>([]);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("10000");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/deposit/accounts").then(r => r.json()).then(j => {
      setAccounts(j.accounts ?? []);
      if ((j.accounts ?? []).length) setAccountId(j.accounts[0].id);
    });
  }, []);

  async function submit() {
    setMsg(null);
    setLoading(true);
    const res = await fetch("/api/deposit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ accountId, amount, note }),
    });
    setLoading(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(j.error ?? "Gagal membuat request deposit");

    const acc = accounts.find(a => a.id === accountId);
    setMsg(`Request deposit dibuat. Silakan transfer ke: ${acc?.bankName} ${acc?.accountNo} a.n. ${acc?.accountName}. Setelah itu tunggu admin ACC.`);
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold">Deposit (Request)</h2>
      <p className="text-sm text-slate-600 mt-1">Pilih rekening tujuan, lalu admin akan melakukan approval.</p>

      <div className="mt-4 grid gap-3">
        <div>
          <div className="label">Rekening tujuan</div>
          <select className="input" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.bankName} • {a.accountNo} • {a.accountName}</option>
            ))}
          </select>
        </div>
        <div>
          <div className="label">Nominal (Rp)</div>
          <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
        </div>
        <div>
          <div className="label">Catatan (opsional)</div>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        {msg ? <div className="text-sm text-slate-700">{msg}</div> : null}

        <button className="btn btn-primary" disabled={loading || !accountId} onClick={submit}>
          {loading ? "Memproses..." : "Buat Request Deposit"}
        </button>
      </div>
    </div>
  );
}

function WithdrawCard() {
  const [amount, setAmount] = useState("10000");
  const [bankName, setBankName] = useState("BCA");
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setMsg(null);
    setLoading(true);
    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ amount, bankName, accountNo, accountName, note }),
    });
    setLoading(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(j.error ?? "Gagal membuat request withdraw");
    setMsg("Request withdraw dibuat. Tunggu admin ACC & proses transfer.");
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold">Withdraw (Request)</h2>
      <p className="text-sm text-slate-600 mt-1">Isi rekening tujuan milik kamu.</p>

      <div className="mt-4 grid gap-3">
        <div>
          <div className="label">Nominal (Rp)</div>
          <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="numeric" />
        </div>
        <div>
          <div className="label">Bank</div>
          <input className="input" value={bankName} onChange={(e) => setBankName(e.target.value)} />
        </div>
        <div>
          <div className="label">No Rekening</div>
          <input className="input" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
        </div>
        <div>
          <div className="label">Nama Pemilik</div>
          <input className="input" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
        </div>
        <div>
          <div className="label">Catatan (opsional)</div>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        {msg ? <div className="text-sm text-slate-700">{msg}</div> : null}

        <button className="btn btn-primary" disabled={loading} onClick={submit}>
          {loading ? "Memproses..." : "Buat Request Withdraw"}
        </button>
      </div>
    </div>
  );
}
