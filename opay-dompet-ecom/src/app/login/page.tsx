"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Gagal login");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-xl font-semibold">Login</h1>
      <p className="text-slate-600 mt-1">Masuk untuk melihat wallet & transaksi.</p>

      <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
        <div>
          <div className="label">Email</div>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <div className="label">Password</div>
          <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>

        {err ? <div className="text-sm text-red-600">{err}</div> : null}

        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>

      <div className="mt-4 text-sm text-slate-600">
        Admin default (setelah seed): <b>admin@opay.local</b> / <b>admin123</b>
      </div>
    </div>
  );
}
