import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount, bankName, accountNo, accountName, note } = await req.json().catch(() => ({}));
  const amt = BigInt(String(amount ?? "0").replace(/[^\d]/g, "") || "0");

  if (amt < 1000n) return NextResponse.json({ error: "Minimal WD Rp1.000" }, { status: 400 });
  if (!bankName || !accountNo || !accountName) return NextResponse.json({ error: "Data rekening WD belum lengkap" }, { status: 400 });

  const wallet = await prisma.wallet.findUnique({ where: { userId: session.userId } });
  if (!wallet || wallet.balance < amt) return NextResponse.json({ error: "Saldo tidak cukup" }, { status: 400 });

  const wd = await prisma.withdrawRequest.create({
    data: {
      userId: session.userId,
      amount: amt,
      bankName: String(bankName),
      accountNo: String(accountNo),
      accountName: String(accountName),
      note: typeof note === "string" ? note : undefined,
    },
  });

  return NextResponse.json({ withdrawRequestId: wd.id });
}
