import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET(req: Request) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") ?? "PENDING") as any;

  const rows = await prisma.withdrawRequest.findMany({
    where: { status },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return NextResponse.json({ rows });
}
