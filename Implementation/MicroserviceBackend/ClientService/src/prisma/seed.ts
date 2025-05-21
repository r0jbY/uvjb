// src/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.client.deleteMany();

  await prisma.client.createMany({
    data: [
      {
        id: '00000000-0000-0000-0000-000000000001',
        device_code: '10000000-0000-0000-0000-000000000001',
        superbuddy_id: '20000000-0000-0000-0000-000000000001',
        first_name: 'Alice',
        last_name: 'Johnson',
        phone_number: '+31123456789',
        address: '123 Elm St',
        active: true,
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        device_code: '10000000-0000-0000-0000-000000000002',
        superbuddy_id: '20000000-0000-0000-0000-000000000001',
        first_name: 'Bob',
        last_name: 'Smith',
        phone_number: '+31678912345',
        address: '456 Oak Ave',
        active: true,
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        device_code: '10000000-0000-0000-0000-000000000003',
        superbuddy_id: '20000000-0000-0000-0000-000000000002',
        first_name: 'Clara',
        last_name: 'Wells',
        phone_number: '+31876543210',
        address: '789 Maple Rd',
        active: false,
      },
      {
        id: '00000000-0000-0000-0000-000000000004',
        device_code: '10000000-0000-0000-0000-000000000004',
        superbuddy_id: '20000000-0000-0000-0000-000000000003',
        first_name: 'David',
        last_name: 'Lee',
        phone_number: '+31987654321',
        address: '321 Pine St',
        active: true,
      },
      {
        id: '00000000-0000-0000-0000-000000000005',
        device_code: '10000000-0000-0000-0000-000000000005',
        superbuddy_id: '20000000-0000-0000-0000-000000000001',
        first_name: 'Eva',
        last_name: 'Smith',
        phone_number: '+31765432109',
        address: '654 Cedar Ln',
        active: true,
      },
    ],
  });

  console.log('✅ Seeded Client table with 5 entries.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
