import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed the `User` table with default data
 */
export async function seedUsers(): Promise<void> {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        id: "30000000-0000-0000-0000-000000000001",
        first_name: "Sophie",
        last_name: "Anderson",
        phone_number: "+31612345678",
        address: "12 Park Lane",
        active: true
      },
      {
        id: "30000000-0000-0000-0000-000000000002",
        first_name: "Liam",
        last_name: "Bakker",
        phone_number: "+31687654321",
        address: "88 River Road",
        active: false
      },
      {
        id: "30000000-0000-0000-0000-000000000003",
        first_name: "Emma",
        last_name: "Anderson",
        phone_number: "+31623456789",
        address: "42 Forest Ave",
        active: true
      },
      {
        id: "30000000-0000-0000-0000-000000000004",
        first_name: "Noah",
        last_name: "de Vries",
        phone_number: "+31634567890",
        address: "75 Sunset Blvd",
        active: true
      },
      {
        id: "30000000-0000-0000-0000-000000000005",
        first_name: "Julia",
        last_name: "Jansen",
        phone_number: "+31698765432",
        address: "19 Elm Street",
        active: true
      }
    ]
  });
}

// 🏃 Script runner support: allows `ts-node src/prisma/seedUsers.ts`
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log("✅ Seeded User table with 5 entries.");
    })
    .catch((e) => {
      console.error("❌ Failed to seed Users:", e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
