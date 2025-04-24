import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export default class UserController {

    static async register (req: Request, res: Response) : Promise<Response> {
        try {
            const { id, first_name, last_name, phone_number, address, role} = req.body;

            await UserService.createUser(id, first_name, last_name, phone_number, address, role);
            return res.status(200).send("Account created") ;
            
        } catch (err) {
            console.log(err);
            return res.status(400).json({ message: "Account creation failed" });
        }
    }

    static async getUsers(req: Request, res: Response): Promise<Response>{

        const limit = parseInt(req.query.limit as string) || 20;
        const offset = parseInt(req.query.offset as string) || 0;

        try {
            const users = await UserService.getUsers(limit, offset);
            return res.status(200).send(users);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internval server error" });
        }
    }

    static async searchUsers(req: Request, res: Response) {
        const query = req.query.query as string;
        try {
          const users = await UserService.searchUsers(query);
          res.status(200).send(users);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Internal server error" });
        }
      }
};