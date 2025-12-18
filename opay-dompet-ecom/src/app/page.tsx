import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold">O-Pay — Dompet Digital untuk E-Commerce</h1>
        <p className="mt-2 text-slate-600">
          Demo realistis: login, wallet (ledger), request deposit/withdraw, admin approval, rekening deposit dari panel admin,
          dan tombol Customer Service WhatsApp.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link className="btn btn-primary" href="/register">Mulai (Daftar)</Link>
          <Link className="btn" href="/login">Login</Link>
          <Link className="btn" href="/dashboard">Dashboard</Link>
          <Link className="btn" href="/admin">Admin Panel</Link>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold">Catatan</h2>
        <ul className="mt-2 list-disc pl-5 text-slate-600 space-y-1">
          <li>Deposit/WD di demo ini: approval manual admin (lebih aman & realistis).</li>
          <li>Saldo diubah hanya lewat transaksi database + ledger.</li>
          <li>Nomor CS WhatsApp bisa diubah dari Admin → Settings.</li>
        </ul>
      </div>
    </div>
  );
}
