import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = params.id;
  const { reason } = await req.json().catch(() => ({}));

  const dep = await prisma.depositRequest.findUnique({ where: { id } });
  if (!dep || dep.status !== "PENDING") return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  await prisma.depositRequest.update({
    where: { id },
    data: { status: "REJECTED", reviewedBy: admin.userId, reviewedAt: new Date(), note: String(reason ?? dep.note ?? "") },
  });

  await prisma.adminAuditLog.create({
    data: { adminId: admin.userId, action: "REJECT_DEPOSIT", metaJson: JSON.stringify({ depositId: id, reason }) },
  });

  return NextResponse.json({ ok: true });
}
