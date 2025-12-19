export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: 'whatsapp_cs' },
    })

    return NextResponse.json({
      success: true,
      value: setting?.value || '',
    })
  } catch (error) {
    console.error('WhatsApp setting error:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load WhatsApp setting',
      },
      { status: 500 }
    )
  }
}
