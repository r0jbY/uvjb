import { Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { createHttpError } from "../controllers/AuthController";

export class AuthService {

  // ✅ Retrieve user from database
  static async getUserByEmail(email: string) {
    try {
      return await prisma.user.findUnique({ where: { email } });
    } catch (error) {
      console.error("DB error (getUserByEmail):", error);
      throw createHttpError("Internal server error.", 500);
    }
  }

  static async getUserById(id: string) {
    try {
      return await prisma.user.findUnique({ where: { id } });
    } catch (error) {
      console.error("DB error (getUserById):", error);
      throw createHttpError("Internal server error.", 500);
    }
  }

  static async updateUser(id: string, email: string, role: string) {

    try {
      return await prisma.user.update({
        where: { id },
        data: { email, role },
      });
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002' &&
        (err.meta?.target as string[])?.includes('email')
      ) {
        throw createHttpError("Email is already in use.", 409);
      }

      console.error("Unexpected DB error (updateUser):", err);
      throw createHttpError("Failed to update user. Internal server error.", 500);
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
        throw createHttpError("Email is already in use.", 409);
      }

      console.error("Unexpected DB error (createAccount):", err);
      throw createHttpError("Failed to create user. Internal server error.", 500);
    }
  }
}