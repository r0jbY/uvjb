import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();

  // Hash password once for reuse
  const hashedPassword = await bcrypt.hash('password', 12);

  const roles = ['admin', 'buddy', 'superbuddy'] as const;

  const ids = [
  "01010101-0101-0101-0101-010101010101",
  "02020202-0202-0202-0202-020202020202",
  "03030303-0303-0303-0303-030303030303",
  "04040404-0404-0404-0404-040404040404",
  "05050505-0505-0505-0505-050505050505",
  "06060606-0606-0606-0606-060606060606",
  "07070707-0707-0707-0707-070707070707",
  "08080808-0808-0808-0808-080808080808",
  "09090909-0909-0909-0909-090909090909",
  "10101010-1010-1010-1010-101010101010",
  "11111111-1111-1111-1111-111111111111",
  "12121212-1212-1212-1212-121212121212",
  "13131313-1313-1313-1313-131313131313",
  "14141414-1414-1414-1414-141414141414",
  "15151515-1515-1515-1515-151515151515",
];

  const users = Array.from({ length: 15 }).map((_, i) => {
    const index = i;
    return {
      id: ids[index],
      email: `user${index}@example.com`,
      password: hashedPassword,
      role: roles[i % roles.length], // rotate between admin, buddy, superbuddy
    };
  });

  await prisma.user.createMany({
    data: users,
  });

  console.log('✅ Seeded test_authdb with 15 users (fixed UUIDs).');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
