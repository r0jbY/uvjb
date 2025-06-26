import { prisma } from "../config/database";
import { createHttpError } from "../controllers/NotificationController";




export class NotificationService {

  // ✅ Retrieve user from database
  static async addToken(id: string, token: string) {
    try {
      await prisma.pushToken.upsert({
        where: {
          userId_token: { userId: id, token },
        },
        update: {},
        create: {
          userId: id,
          token,
        },
      });
    } catch (error) {
      console.error("DB error (addToken):", error);
      throw createHttpError("Failed to add token.", 500);
    }
  }

  static async removeToken(userId: string, token: string) {
    try {
      await prisma.pushToken.delete({
        where: {
          userId_token: { userId, token },
        },
      });
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
  }

  static async getTokensForUsers(userIds: string[]) {
    const tokens = await prisma.pushToken.findMany({
      where: { userId: { in: userIds } },
    });
    return tokens.map((t: { token: string }) => t.token);
  }

}
