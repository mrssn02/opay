"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Gagal daftar");
      return;
    }
    // auto-login after register
    const login = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (login.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="max-w-md mx-auto card p-6">
      <h1 className="text-xl font-semibold">Daftar</h1>
      <p className="text-slate-600 mt-1">Buat akun baru untuk menggunakan O-Pay.</p>

      <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
        <div>
          <div className="label">Email</div>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <div className="label">Password (min 6)</div>
          <input className="input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required minLength={6} />
        </div>

        {err ? <div className="text-sm text-red-600">{err}</div> : null}

        <button className="btn btn-primary" disabled={loading} type="submit">
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>
    </div>
  );
}
