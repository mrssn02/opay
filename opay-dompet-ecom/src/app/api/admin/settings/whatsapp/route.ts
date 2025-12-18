import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: Request) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { number } = await req.json().catch(() => ({}));
  if (!number || !/^[0-9]{10,15}$/.test(String(number))) {
    return NextResponse.json({ error: "Nomor WA harus format 628xxxx (10-15 digit)" }, { status: 400 });
  }

  await prisma.setting.upsert({
    where: { key: "whatsapp_cs_number" },
    create: { key: "whatsapp_cs_number", value: String(number) },
    update: { value: String(number) },
  });

  await prisma.adminAuditLog.create({
    data: { adminId: admin.userId, action: "UPDATE_WHATSAPP_CS", metaJson: JSON.stringify({ number }) },
  });

  return NextResponse.json({ ok: true });
}
