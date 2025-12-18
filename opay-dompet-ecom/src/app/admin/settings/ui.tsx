"use client";
import { useEffect, useState } from "react";

export function SettingsClient() {
  const [number, setNumber] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings/whatsapp").then(r => r.json()).then(j => setNumber(j.number ?? ""));
  }, []);

  async function save() {
    setMsg(null);
    const res = await fetch("/api/admin/settings/whatsapp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ number }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) return setMsg(j.error ?? "Gagal menyimpan");
    setMsg("Nomor CS WhatsApp berhasil diupdate.");
  }

  return (
    <div className="grid gap-4">
      <div className="card p-6">
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="mt-1 text-slate-600 text-sm">Ubah nomor Customer Service WhatsApp (format 628xxxx).</p>
      </div>

      <div className="card p-6 max-w-lg">
        <div className="label">Nomor CS WhatsApp</div>
        <input className="input mt-2" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="62812xxxxxxx" />
        <button className="btn btn-primary mt-3" onClick={save}>Simpan</button>
        {msg ? <div className="mt-3 text-sm">{msg}</div> : null}
      </div>
    </div>
  );
}
