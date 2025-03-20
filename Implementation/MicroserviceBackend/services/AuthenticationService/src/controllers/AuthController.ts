import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export default class AuthController {
    constructor () {}

    static async login (req: Request, res: Response) : Promise<Response> {
        try {
            const { email, password } = req.body;
      
            if(!email || !password) {
              return res.status(404).json({ message: "Missing", result: false });
            }

            if(typeof(email) !== "string" || typeof(password) !== "string" ) {
              return res.status(404).json({ message: "Invalid format", result: false });
            }

            // 1️⃣ Get user from database
            const user = await AuthService.getUserByEmail(email);
            if (!user) {
              return res.status(404).json({ message: "Invalid credentials", result: false });
            }
      
            // 2️⃣ Validate password
            const isMatch = await AuthService.validatePassword(password, user.password);
            if (!isMatch) {
              return res.status(401).json({ message: "Invalid credentials", result: false });
            }

            return res.status(200).json({
                message: "User logged in successfully",
                result: true,
                userid: user.id,
              });
        }
        catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Internal server error" });
        }
    }

    async logout (req: Request, res: Response) : Promise<Response> {
        return res.status(200).send("Logout successful");
    }
}