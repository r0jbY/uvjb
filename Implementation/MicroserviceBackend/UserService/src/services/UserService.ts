import { prisma } from "../config/database";
import { createHttpError } from "../controllers/UserController";

export class UserService {

  // ✅ Retrieve user from database
  static async createUser(id: string, first_name: string, last_name: string, phone_number: string, address: string, active: boolean) {
    try {
      await prisma.user.create({
        data: {
          id,
          first_name,
          last_name,
          phone_number,
          address,
          active
        }
      });
    } catch (error) {
      console.error("DB error (createUser):", error);
      throw createHttpError("Failed to create user.", 500);
    }
  }

  static async updateUser(id: string, first_name: string, last_name: string, address: string, phone_number: string, active: boolean) {
    try {
      return await prisma.user.update({
        where: { id },
        data: { first_name, last_name, address, phone_number, active },
      });
    } catch (error) {
      console.error("DB error (updateUser):", error);
      throw createHttpError("Failed to update user.", 500);
    }
  }

  static async getUsers(limit: number, offset: number) {
    try {
      const users = await prisma.user.findMany({
        skip: offset,
        take: limit,
        orderBy: { first_name: 'asc' }
      });
      return users;
    } catch (error) {
      console.error("DB error (getUsers):", error);
      throw createHttpError("Failed to get users.", 500);
    }
  }

  static async getUsersByIds(ids: string[]) {
    try {
      return prisma.user.findMany({
        where: {
          id: {
            in: ids
          }
        }
      });
    } catch (error) {
      console.error("DB error (getUserByIds):", error);
      throw createHttpError("Failed to get users.", 500);
    }
  }

  static async getUser(id: string) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      console.error("DB error (getUser):", error);
      throw createHttpError("Failed to get user.", 500);
    }
  }

  static async searchUsers(query: string) {
    if (!query || query.trim() === "") return [];

    const formattedQuery = query
      .trim()
      .split(/\s+/)
      .map((word) => `${word}:*`)
      .join(" & ");
    try {
      const result = await prisma.$queryRaw<any[]>`
        SELECT * FROM "User"
        WHERE to_tsvector('english', 
        coalesce("first_name", '') || ' ' ||
        coalesce("last_name", '') || ' ' ||
        coalesce("address", '') || ' ' ||
        coalesce("phone_number", '') || ' ' 
    ) @@ to_tsquery('english', ${formattedQuery})`;
      return result;
    } catch (error) {
      console.error("DB error (searchUsers):", error);
      throw createHttpError("Search failed due to db issue.", 500);
    }
  }

  static async deleteUser(id: string) {
    try {
      await prisma.user.delete({
        where: {
          id
        }
      })
    } catch (error) {
      console.error("Unexpected DB error (deleteUser):", error);
      throw createHttpError("Failed to delete user. Internal server error.", 500);
    }
  }
}
