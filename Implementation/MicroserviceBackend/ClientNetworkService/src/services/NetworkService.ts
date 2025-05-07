import { prisma } from "../config/database";
import { createHttpError } from "../controllers/NetworkController";

export class NetworkService {

  // ✅ Retrieve user from database
  static async updateNetwork(client_id: string, add: string[], remove: string[], layer: number) {
    try {
        await prisma.$transaction(async (tx) => {
          if(remove.length > 0) {
            await tx.network.deleteMany({
              where: {
                client_id,
                buddy_id: {in : remove},
                layer: layer
              }
            });
          }

          if(add.length > 0) {
            const toAdd = add.map((buddy_id) => ({client_id, buddy_id, layer}));

            await tx.network.createMany({
              data: toAdd,
              skipDuplicates: true
            })
          }
        });
      } catch (error) {
      console.error("Error managing netowrk:", error);
      throw createHttpError("Failed to update client network", 500);
    }
  }

  static async getNetwork(client_id: string, layer: number) {
    try {
        const res = prisma.network.findMany({
          where: {
            client_id,
            layer
          },
          select: {
            buddy_id: true,
          },
        })
        return res;
      } catch (error) {
      console.error("Error managing netowrk:", error);
      throw createHttpError("Failed to update client network", 500);
    }
  }
  
}
