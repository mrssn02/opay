import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi' },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        wallet: {
          create: {
            balance: 0n,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      userId: user.id,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Gagal daftar' },
      { status: 500 }
    )
  }
}
