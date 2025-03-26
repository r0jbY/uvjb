import { prisma } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
}

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
}
