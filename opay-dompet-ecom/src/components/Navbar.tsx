import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/session";

export async function Navbar() {
  const session = getSession();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="O-Pay" width={110} height={44} priority />
        </Link>

        <nav className="flex items-center gap-2">
          <Link className="btn" href="/shop">Shop</Link>
          {session ? (
            <>
              <Link className="btn" href="/dashboard">Dashboard</Link>
              {session.role === "ADMIN" ? <Link className="btn" href="/admin">Admin</Link> : null}
              <form action="/api/auth/logout" method="post">
                <button className="btn" type="submit">Logout</button>
              </form>
            </>
          ) : (
            <>
              <Link className="btn" href="/login">Login</Link>
              <Link className="btn btn-primary" href="/register">Daftar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
