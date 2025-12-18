import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const accounts = await prisma.depositAccount.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, bankName: true, accountNo: true, accountName: true },
  });
  return NextResponse.json({ accounts });
}
