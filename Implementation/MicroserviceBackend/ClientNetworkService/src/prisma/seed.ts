import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.network.deleteMany();

  const client1 = '11111111-1111-1111-1111-111111111111';
  const client2 = '22222222-2222-2222-2222-222222222222';

  await prisma.network.createMany({
    data: [
      // Client 1 network
      { client_id: client1, buddy_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', layer: 1 },
      { client_id: client1, buddy_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', layer: 2 },
      { client_id: client1, buddy_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', layer: 1 },
      { client_id: client1, buddy_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', layer: 2 },
      { client_id: client1, buddy_id: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', layer: 1 },

      // Client 2 network (some buddies shared)
      { client_id: client2, buddy_id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', layer: 1 },
      { client_id: client2, buddy_id: 'cccccccc-cccc-cccc-cccc-cccccccccccc', layer: 2 },
      { client_id: client2, buddy_id: 'ffffffff-ffff-ffff-ffff-ffffffffffff', layer: 1 },
      { client_id: client2, buddy_id: 'dddddddd-dddd-dddd-dddd-dddddddddddd', layer: 2 },
      { client_id: client2, buddy_id: '99999999-9999-9999-9999-999999999999', layer: 1 },
    ],
  });

  console.log("✅ Seeded Network table with 10 entries across 2 clients.");
}

main()
  .catch((e) => {
    console.error("❌ Network seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
