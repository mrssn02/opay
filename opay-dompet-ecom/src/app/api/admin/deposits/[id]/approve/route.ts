import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = params.id;

  try {
    await prisma.$transaction(async (tx) => {
      const dep = await tx.depositRequest.findUnique({ where: { id } });
      if (!dep || dep.status !== "PENDING") throw new Error("Invalid request");

      const wallet = await tx.wallet.findUnique({ where: { userId: dep.userId } });
      if (!wallet) throw new Error("Wallet missing");

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: wallet.balance + dep.amount },
      });

      await tx.ledgerEntry.create({
        data: {
          walletId: wallet.id,
          type: "CREDIT",
          amount: dep.amount,
          refType: "DEPOSIT",
          refId: dep.id,
          note: "Deposit approved",
        },
      });

      await tx.depositRequest.update({
        where: { id },
        data: { status: "APPROVED", reviewedBy: admin.userId, reviewedAt: new Date() },
      });

      await tx.adminAuditLog.create({
        data: {
          adminId: admin.userId,
          action: "APPROVE_DEPOSIT",
          metaJson: JSON.stringify({ depositId: id, amount: dep.amount.toString(), userId: dep.userId }),
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 400 });
  }
}
