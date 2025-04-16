import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export default class UserController {

    static async register (req: Request, res: Response) : Promise<Response> {
        try {
            const { id, first_name, last_name, phone_number, address} = req.body;

            await UserService.createUser(id, first_name, last_name, phone_number, address);
            return res.status(200).send("Account created") ;
            
        } catch (err) {
            console.log(err);
            return res.status(400).json({ message: "Account creation failed" });
        }
    }

    static async getUsers(req: Request, res: Response): Promise<Response>{
        try {
            const users = await UserService.getUsers();
            return res.status(200).send(users);
        } catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internval server error" });
        }
    }
};