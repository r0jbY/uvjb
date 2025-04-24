import { prisma } from "../config/database";
import { Role } from "@prisma/client";

export class UserService {

  // ✅ Retrieve user from database
  static async createUser(id: string, first_name: string, last_name: string, phone_number: string, address: string, role: string, active: boolean) {
    try {
      await prisma.user.create({
        data: {
          id,
          first_name,
          last_name,
          phone_number,
          address,
          role: role.toUpperCase() as Role,
          active
        }
      });
    } catch (error) {
      console.log(error);
      throw new Error("Internal Server Eroor");
    }
  }

  static async getUsers(limit: number, offset: number) {
    try {
      const users = await prisma.user.findMany({
        skip: offset,
        take: limit,
        orderBy: {first_name: 'asc'}
      });
      return users;
    } catch (err) {
      console.log(err);
      throw new Error("Internal Server Eroor");
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
        coalesce("phone_number", '') || ' ' ||
        coalesce("role"::text, '')
    ) @@ to_tsquery('english', ${formattedQuery})`;
      return result;
    } catch (err) {
      throw new Error("DB Error");
    }
  }
}
