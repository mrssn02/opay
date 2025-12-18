import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = params.id;
  const body = await req.json().catch(() => ({}));

  const row = await prisma.depositAccount.update({
    where: { id },
    data: {
      bankName: body.bankName !== undefined ? String(body.bankName) : undefined,
      accountNo: body.accountNo !== undefined ? String(body.accountNo) : undefined,
      accountName: body.accountName !== undefined ? String(body.accountName) : undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,
    },
  });

  await prisma.adminAuditLog.create({
    data: { adminId: admin.userId, action: "UPDATE_DEPOSIT_ACCOUNT", metaJson: JSON.stringify({ id }) },
  });

  return NextResponse.json({ ok: true, row });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = params.id;
  await prisma.depositAccount.delete({ where: { id } });

  await prisma.adminAuditLog.create({
    data: { adminId: admin.userId, action: "DELETE_DEPOSIT_ACCOUNT", metaJson: JSON.stringify({ id }) },
  });

  return NextResponse.json({ ok: true });
}
