import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = params.id;

  try {
    await prisma.$transaction(async (tx) => {
      const wd = await tx.withdrawRequest.findUnique({ where: { id } });
      if (!wd || wd.status !== "PENDING") throw new Error("Invalid request");

      const wallet = await tx.wallet.findUnique({ where: { userId: wd.userId } });
      if (!wallet) throw new Error("Wallet missing");
      if (wallet.balance < wd.amount) throw new Error("Saldo user tidak cukup");

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: wallet.balance - wd.amount },
      });

      await tx.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          type: "DEBIT",
          amount: wd.amount,
          refType: "WITHDRAW",
          refId: wd.id,
          note: "Withdraw approved",
        },
      });

      await tx.withdrawRequest.update({
        where: { id },
        data: { status: "APPROVED", reviewedBy: admin.userId, reviewedAt: new Date() },
      });

      await tx.adminAuditLog.create({
        data: {
          adminId: admin.userId,
          action: "APPROVE_WITHDRAW",
          metaJson: JSON.stringify({ withdrawId: id, amount: wd.amount.toString(), userId: wd.userId }),
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 400 });
  }
}
