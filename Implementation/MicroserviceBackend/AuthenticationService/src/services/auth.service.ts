import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";

export class AuthService {
  
  // ✅ Retrieve user from database
  static async getUserByEmail(email: string) {
    try {
        return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      console.log(error);
      throw new Error("Internal Server Eroor");
    }
    
  }

  static async createAccount(id: string, email: string, password: string, role: string) {
    try {
      await prisma.user.create({
        data: { id, email, password, role },
      });
      return true;
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002' &&
        (err.meta?.target as string[])?.includes('email')
      ) {
        throw new Error("Email is already in use.");
      }
  
      console.error("Unexpected error:", err);
      throw new Error("User could not be created.");
    }
  }
}