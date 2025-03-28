import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import {v4 as uuidv4} from "uuid";


export default class AuthController {
    
    static async login (req: Request, res: Response) : Promise<Response> {
        try {
            const { email, password } = req.body;
            // 1️⃣ Get user from database
            const user = await AuthService.getUserByEmail(email);
            if (!user) {
              return res.status(404).json({ message: "Invalid credentials", result: false });
            }

            // 2️⃣ Validate password
            const isMatch =await bcrypt.compare(password, user.password);
            if (!isMatch) {
              return res.status(404).json({ message: "Invalid credentials", result: false });
            }

            const accessToken = jwt.sign({id: user.id, role: user.role}, process.env.ACCESS_SECRET as string, {expiresIn: '15m'})
            const refreshToken = jwt.sign({id: user.id, role: user.role}, process.env.REFRESH_SECRET as string, {expiresIn: '1d'})

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

    static async logout (req: Request, res: Response) : Promise<Response> {
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

    static async register(req: Request, res: Response): Promise<Response> {

      const id = uuidv4();
      const {email, password, role} = req.body;

      const hashedPassword = await bcrypt.hash(password, 12);

      try {
        await AuthService.createAccount(id, email, hashedPassword, role);
        return res.status(200).send("Account created");
      } catch (error) {
        console.log(error);
        return res.status(400).send("Account creation failed");
      }
    }
}