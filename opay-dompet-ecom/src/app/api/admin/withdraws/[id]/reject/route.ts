import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = params.id;
  const { reason } = await req.json().catch(() => ({}));

  const wd = await prisma.withdrawRequest.findUnique({ where: { id } });
  if (!wd || wd.status !== "PENDING") return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  await prisma.withdrawRequest.update({
    where: { id },
    data: { status: "REJECTED", reviewedBy: admin.userId, reviewedAt: new Date(), note: String(reason ?? wd.note ?? "") },
  });

  await prisma.adminAuditLog.create({
    data: { adminId: admin.userId, action: "REJECT_WITHDRAW", metaJson: JSON.stringify({ withdrawId: id, reason }) },
  });

  return NextResponse.json({ ok: true });
}
