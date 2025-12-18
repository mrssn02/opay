import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@opay.local";
  const adminPass = "admin123";

  const hash = await bcrypt.hash(adminPass, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hash,
      role: "ADMIN",
      wallet: { create: {} },
    },
  });

  await prisma.setting.upsert({
    where: { key: "whatsapp_cs_number" },
    update: {},
    create: { key: "whatsapp_cs_number", value: "6280000000000" },
  });

  const existingAcc = await prisma.depositAccount.findFirst();
  if (!existingAcc) {
    await prisma.depositAccount.createMany({
      data: [
        { bankName: "BCA", accountNo: "1234567890", accountName: "O-Pay Official", isActive: true },
        { bankName: "Mandiri", accountNo: "0987654321", accountName: "O-Pay Official", isActive: true },
      ],
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
