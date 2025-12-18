import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { email, password } = await req.json().catch(() => ({}));

  if (!email || typeof email !== "string" || !password || typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "Input tidak valid" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      wallet: { create: {} },
    },
    select: { id: true, email: true },
  });

  return NextResponse.json({ user });
}
