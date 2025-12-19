import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@opay.local' },
    update: {},
    create: {
      email: 'admin@opay.local',
      password: adminPassword,
      role: 'ADMIN',
      wallet: {
        create: {}
      }
    }
  })

  await prisma.setting.upsert({
    where: { key: 'WHATSAPP_CS' },
    update: { value: '628123456789' },
    create: {
      key: 'WHATSAPP_CS',
      value: '628123456789'
    }
  })

  console.log('✅ Seed completed')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
