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
    return await prisma.user.findUnique({ where: { email } });
  }

  // ✅ Compare password hashes
  static async validatePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // // ✅ Generate JWT tokens
  // static generateTokens(userId: string, role: string) {
  //   const accessToken = jwt.sign(
  //     { id: userId, role },
  //     process.env.ACCESS_SECRET as string,
  //     { expiresIn: "15m" }
  //   );

  //   const refreshToken = jwt.sign(
  //     { id: userId, role },
  //     process.env.REFRESH_SECRET as string,
  //     { expiresIn: "3d" }
  //   );

  //   return { accessToken, refreshToken };
  // }
}
