import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const rows = await prisma.depositAccount.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ rows });
}

export async function POST(req: Request) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { bankName, accountNo, accountName, isActive } = await req.json().catch(() => ({}));
  if (!bankName || !accountNo || !accountName) return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });

  const row = await prisma.depositAccount.create({
    data: {
      bankName: String(bankName),
      accountNo: String(accountNo),
      accountName: String(accountName),
      isActive: Boolean(isActive ?? true),
    },
  });

  await prisma.adminAuditLog.create({
    data: { adminId: admin.userId, action: "CREATE_DEPOSIT_ACCOUNT", metaJson: JSON.stringify({ id: row.id }) },
  });

  return NextResponse.json({ ok: true, row });
}
