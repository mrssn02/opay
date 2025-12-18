import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { accountId, amount, note } = await req.json().catch(() => ({}));
  const amt = BigInt(String(amount ?? "0").replace(/[^\d]/g, "") || "0");

  if (!accountId || typeof accountId !== "string" || amt < 1000n) {
    return NextResponse.json({ error: "Minimal deposit Rp1.000" }, { status: 400 });
  }

  const acc = await prisma.depositAccount.findFirst({ where: { id: accountId, isActive: true } });
  if (!acc) return NextResponse.json({ error: "Rekening tujuan tidak valid" }, { status: 400 });

  const dep = await prisma.depositRequest.create({
    data: { userId: session.userId, accountId, amount: amt, note: typeof note === "string" ? note : undefined },
  });

  return NextResponse.json({ depositRequestId: dep.id });
}
