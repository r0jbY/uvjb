import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.USE_MOCK_DB === 'true') {
  // Load and export a mocked version of the Prisma client.
  prisma = {
    user: {
      findUnique: async (args: { where: { email: string } }) => {
        const {email} = args.where;
        if(email === "robert@gmail.com") {
            console.log("Works right now");
            return ({id: "1" , email: "robert@gmail.com",password: "$2a$12$vkucDEfVnrMIqM6Isu.tp.imjcKMGzngQ9H7y0aoltQ0ReXbZ3M0S", role: "admin"}); 
        } else if (email =="error@db.com") {
            throw new Error("Db error");
        }
        return null;
      },
      create: async (args: any) => {
        return args.data;
      },
    },
  } as unknown as PrismaClient;
} else {
    
  // Use the real Prisma client
  console.log("Went here!")
  prisma = new PrismaClient();
}

export { prisma };
