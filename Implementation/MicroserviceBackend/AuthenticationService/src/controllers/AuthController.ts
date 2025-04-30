import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import jwt, { VerifyErrors } from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid";
import { publishUserCreatedEvent, publishUserUpdatedEvent } from "../utils/publisher";

type TypedError = Error & { statusCode?: number };

export const createHttpError = (message: string, statusCode: number): TypedError => {
  const err = new Error(message) as TypedError;
  err.statusCode = statusCode;
  return err;
};

export default class AuthController {


  static async login(req: Request, res: Response): Promise<Response> {

    const { email, password } = req.body;
    // 1️⃣ Get user from database
    const user = await AuthService.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createHttpError("Invalid credentials", 401);
    }

    if (user.role !== 'admin') {
      throw createHttpError("Access denied", 403);
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_SECRET as string, { expiresIn: '15m' })
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.REFRESH_SECRET as string, { expiresIn: '1d' })

    return res
      .cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: "none" })
      .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none", maxAge: 86400000 })
      .status(200)
      .json({ message: "User logged in successfully", result: true, userid: user.id });
  }


  static async logout(req: Request, res: Response): Promise<Response> {
    return res
      .cookie("accessToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
      })
      .cookie("refreshToken", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(0),
      })
      .status(200)
      .send("Logout successful");
  }

  static async getUserById(req: Request, res: Response): Promise<Response> {
    const user = await AuthService.getUserById(req.params.id);
    if (!user) throw createHttpError("User not found", 404);

    return res.status(200).json({ email: user.email, role: user.role });
  }

  static async updateUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { email, role, firstName, lastName, address, phoneNumber, active } = req.body;

    await AuthService.updateUser(id, email, role);

    try {
      await publishUserUpdatedEvent({ id, firstName, lastName, address, phoneNumber, active });
    } catch (pubErr) {
      console.error("Failed to publish update event:", pubErr);
      // Optional: don't crash, just log
    }
    

    return res.status(200).json({ message: "User updated successfully" });
  }

  static async whoAmI(req: Request, res: Response): Promise<Response> {


    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw createHttpError("No token provided", 401);

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET as string) as { id: string; role: string };
      return res.status(200).json({ id: decoded.id, role: decoded.role });
    } catch {
      throw createHttpError("Invalid or expired token", 401);
    }
  }

  static async register(req: Request, res: Response): Promise<Response> {

    const id = uuidv4();
    const { email, password, role, firstName, lastName, phoneNumber, address, active } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    await AuthService.createAccount(id, email, hashedPassword, role);

    await publishUserCreatedEvent({
      uuid: id,
      firstName,
      lastName,
      address,
      phoneNumber,
      active
    });

    return res.status(200).send("Account created");
  }
}