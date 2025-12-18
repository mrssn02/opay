import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const row = await prisma.setting.findUnique({ where: { key: "whatsapp_cs_number" } });
  return NextResponse.json({ number: row?.value ?? "6280000000000" });
}
