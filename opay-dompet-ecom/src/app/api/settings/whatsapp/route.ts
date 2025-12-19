import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const setting = await prisma.setting.findUnique({
    where: { key: 'WHATSAPP_CS' }
  })

  return NextResponse.json({
    value: setting?.value || null
  })
}
