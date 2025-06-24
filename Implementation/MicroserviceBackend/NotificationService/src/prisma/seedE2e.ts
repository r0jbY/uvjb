import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed the `User` table with 15 default users
 */
async function main() {
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        id: "01010101-0101-0101-0101-010101010101",
        first_name: "Sophie",
        last_name: "Anderson",
        phone_number: "+31610000001",
        address: "12 Park Lane",
        active: true,
      },
      {
        id: "02020202-0202-0202-0202-020202020202",
        first_name: "Liam",
        last_name: "Bakker",
        phone_number: "+31610000002",
        address: "88 River Road",
        active: false,
      },
      {
        id: "03030303-0303-0303-0303-030303030303",
        first_name: "Emma",
        last_name: "Anderson",
        phone_number: "+31610000003",
        address: "42 Forest Ave",
        active: true,
      },
      {
        id: "04040404-0404-0404-0404-040404040404",
        first_name: "Noah",
        last_name: "de Vries",
        phone_number: "+31610000004",
        address: "75 Sunset Blvd",
        active: true,
      },
      {
        id: "05050505-0505-0505-0505-050505050505",
        first_name: "Julia",
        last_name: "Jansen",
        phone_number: "+31610000005",
        address: "19 Elm Street",
        active: true,
      },
      {
        id: "06060606-0606-0606-0606-060606060606",
        first_name: "Milan",
        last_name: "Visser",
        phone_number: "+31610000006",
        address: "34 Ocean View",
        active: true,
      },
      {
        id: "07070707-0707-0707-0707-070707070707",
        first_name: "Tess",
        last_name: "Smit",
        phone_number: "+31610000007",
        address: "51 Hill Street",
        active: false,
      },
      {
        id: "08080808-0808-0808-0808-080808080808",
        first_name: "Daan",
        last_name: "Meijer",
        phone_number: "+31610000008",
        address: "76 Willow Way",
        active: true,
      },
      {
        id: "09090909-0909-0909-0909-090909090909",
        first_name: "Lotte",
        last_name: "Vos",
        phone_number: "+31610000009",
        address: "13 Maple Lane",
        active: true,
      },
      {
        id: "10101010-1010-1010-1010-101010101010",
        first_name: "Luuk",
        last_name: "Willems",
        phone_number: "+31610000010",
        address: "9 Birch Blvd",
        active: true,
      },
      {
        id: "11111111-1111-1111-1111-111111111111",
        first_name: "Eva",
        last_name: "Dekker",
        phone_number: "+31610000011",
        address: "61 Ivy Drive",
        active: false,
      },
      {
        id: "12121212-1212-1212-1212-121212121212",
        first_name: "Sem",
        last_name: "Kok",
        phone_number: "+31610000012",
        address: "44 Lavender Ln",
        active: true,
      },
      {
        id: "13131313-1313-1313-1313-131313131313",
        first_name: "Fleur",
        last_name: "Peters",
        phone_number: "+31610000013",
        address: "28 Rose Ave",
        active: true,
      },
      {
        id: "14141414-1414-1414-1414-141414141414",
        first_name: "Thijs",
        last_name: "Bos",
        phone_number: "+31610000014",
        address: "90 Oak Hill",
        active: true,
      },
      {
        id: "15151515-1515-1515-1515-151515151515",
        first_name: "Anna",
        last_name: "de Boer",
        phone_number: "+31610000015",
        address: "7 Pine Place",
        active: true,
      },
    ],
  });
}


main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
