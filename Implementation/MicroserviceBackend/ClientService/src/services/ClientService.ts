import { prisma } from "../config/database";
import { createHttpError } from "../controllers/ClientController";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export class ClientService {

  // ✅ Retrieve user from database
  static async createClient(id: string, device_code: string, superbuddy_id: string, first_name: string, last_name: string, phone_number: string, address: string, active: boolean) {
    try {
      await prisma.client.create({
        data: {
          id,
          device_code,
          superbuddy_id,
          first_name,
          last_name,
          phone_number,
          address,
          active
        }
      });
    } catch (error: unknown) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        (error.meta?.target as string[])?.includes('device_code')
      ) {
        throw createHttpError("Device code is already in use.", 409);
      }
      console.error("DB error (createClient):", error);
      throw createHttpError("Failed to create client.", 500);
    }
  }

  static async updateClient(id: string, device_code: string, superbuddy_id: string, first_name: string, last_name: string, phone_number: string, address: string, active: boolean) {
    try {
      return await prisma.client.update({
        where: { id },
        data: { first_name, last_name, address, phone_number, active, device_code, superbuddy_id },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        (error.meta?.target as string[])?.includes('device_code')
      ) {
        throw createHttpError("Device code already in use.", 409);
      }
      console.error("DB error (updateClient):", error);
      throw createHttpError("Failed to update client.", 500);
    }
  }

  static async getClients(limit: number, offset: number) {
    try {
      const clients = await prisma.client.findMany({
        skip: offset,
        take: limit,
        orderBy: { first_name: 'asc' }
      });
      return clients;
    } catch (error) {
      console.error("DB error (getClients):", error);
      throw createHttpError("Failed to get clients.", 500);
    }
  }

  static async getSomeClients(clientIds: string[]) {
    
    try {
      return prisma.client.findMany({
        where: {
          id: { in: clientIds },
        },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          phone_number: true,
          address: true

        }
      });
    } catch (err) {
      console.error("DB error (listActiveMeetings):", err);
      throw createHttpError("Failed to retrieve meetings.", 500);
    }
  }

  static async getClient(id: string) {
    try {
      return await prisma.client.findUnique({ where: { id } });
    } catch (error) {
      console.error("DB error (getClient):", error);
      throw createHttpError("Failed to get client.", 500);
    }
  }

  static async getClientByCode(code: string) {
    try {
      return await prisma.client.findUnique({ where: { device_code: code }, select: {id: true} });
    } catch (error) {
      console.error("DB error (getClient):", error);
      throw createHttpError("Failed to get client.", 500);
    }
  }

  static async searchClients(query: string, limit?: number) {
    const trimmedQuery = query?.trim();


    if (!trimmedQuery) {
      try {
        return await prisma.client.findMany({
          ...(limit ? { take: limit } : {}),
          select: {
            id: true,
            first_name: true,
            last_name: true,
            address: true,
            phone_number: true,
          },
        });
      } catch (error) {
        console.error("DB error (searchClients):", error);
      throw createHttpError("Search failed due to DB issue.", 500);
      }
    }

    const formattedQuery = trimmedQuery
      .split(/\s+/)
      .map((word) => `${word}:*`)
      .join(" & ");

    // Dynamically inject LIMIT only if provided
    const sql = `
      SELECT * FROM "Client"
      WHERE to_tsvector('english',
        coalesce("first_name", '') || ' ' ||
        coalesce("last_name", '') || ' ' ||
        coalesce("address", '') || ' ' ||
        coalesce("phone_number", '')
      ) @@ to_tsquery('english', $1)
      ${typeof limit === 'number' ? `LIMIT ${Number(limit)}` : ''}
    `;

    try {
      const result = await prisma.$queryRawUnsafe(sql, formattedQuery);
      return result;
    } catch (error) {
      console.error("DB error (searchClients):", error);
      throw createHttpError("Search failed due to DB issue.", 500);
    }
  }

  static async deleteClient(id: string) {
    try {
      await prisma.client.delete({
        where: {
          id
        }
      })
    } catch (error) {
      console.error("Unexpected DB error (deleteClient):", error);
      throw createHttpError("Failed to delete client. Internal server error.", 500);
    }
  }
}
