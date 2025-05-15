import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();

  // Hash passwords
  const password1 = await bcrypt.hash('password', 12);
  const password2 = await bcrypt.hash('password', 12);
  const password3 = await bcrypt.hash('password', 12);

  // Seed users with fixed UUIDs
  await prisma.user.createMany({
    data: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'alice@example.com',
        password: password1,
        role: 'admin',
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        email: 'bob@example.com',
        password: password2,
        role: 'buddy',
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        email: 'charlie@example.com',
        password: password3,
        role: 'superbuddy',
      },
    ],
  });

  console.log('✅ Seeded test_authdb with 3 users (fixed UUIDs).');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
