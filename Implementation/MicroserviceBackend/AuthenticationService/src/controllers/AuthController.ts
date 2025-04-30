import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import jwt, { VerifyErrors } from "jsonwebtoken";
import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid";
import { publishUserCreatedEvent, publishUserUpdatedEvent } from "../utils/publisher";

type TypedError = Error & { statusCode?: number };

export default class AuthController {

  

  static async login(req: Request, res: Response): Promise<Response> {
    try {

      const { email, password } = req.body;
      // 1️⃣ Get user from database
      const user = await AuthService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "Invalid credentials", result: false });
      }

      // 2️⃣ Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(404).json({ message: "Invalid credentials", result: false });
      }

      if (user.role !== 'admin') {
        return res.status(401).json({ message: "Access denied" });
      }


      const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.ACCESS_SECRET as string, { expiresIn: '15m' })
      const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.REFRESH_SECRET as string, { expiresIn: '1d' })

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.cookie("refreshToken", refreshToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      return res.status(200).json({
        message: "User logged in successfully",
        result: true,
        userid: user.id,
      });
    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async logout(req: Request, res: Response): Promise<Response> {
    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0),
    });
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0),
    });
    return res.status(200).send("Logout successful");
  }

  static async getUserById(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const user = await AuthService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Invalid id", result: false });
    }
    return res.status(200).send({ email: user.email, role: user.role });
  }

  static async updateUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { email, role, firstName, lastName, address, phoneNumber, active } = req.body;

    try {
      const updatedUser = await AuthService.updateUser(id, email, role);

      await publishUserUpdatedEvent({
        id,
        firstName: firstName,
        lastName: lastName,
        address,
        phoneNumber,
        active
      });

      return res.status(200).json({ message: "User updated successfully" });

    } catch (error) {

      console.log(error);

      const message =
        error instanceof Error ? error.message : "An unknown error occurred";

      return res.status(400).json(message);
    }
  }

  static async whoAmI(req: Request, res: Response): Promise<Response> {


    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Expired access" });
    }

    try {
      const decoded = await new Promise<{ id: string; role: string }>((resolve, reject) => {
        jwt.verify(accessToken, process.env.ACCESS_SECRET as string, (err: VerifyErrors | null, _decoded: string | undefined | object) => {
          if (err || !_decoded) {
            reject(new Error("Invalid or expired token"));
          } else {
            resolve(_decoded as { id: string; role: string });
          }
        });
      });
      return res.status(200).json({ id: decoded.id, role: decoded.role });

    } catch {
      return res.status(401).json({ message: "Expired access" });
    }
  }

  static async register(req: Request, res: Response): Promise<Response> {

    const id = uuidv4();
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber,
      address,
      active
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      await AuthService.createAccount(id, email, hashedPassword, role);

      await publishUserCreatedEvent({
        uuid: id,
        firstName: firstName,
        lastName: lastName,
        address,
        phoneNumber,
        active
      });

      return res.status(200).send("Account created");
    } catch (error: unknown) {
      const err = error as TypedError;
      const status = err.statusCode || 400;
      const message = err.message || "Unknown error occurred";
    
      return res.status(status).json({ success: false, message });
    }
  }
}