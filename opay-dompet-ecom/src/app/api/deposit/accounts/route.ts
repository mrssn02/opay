export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const accounts = await prisma.depositAccount.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: accounts,
    })
  } catch (error) {
    console.error('Deposit account error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch deposit accounts',
      },
      { status: 500 }
    )
  }
}
