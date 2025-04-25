import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export default class UserController {

  static async getUsers(req: Request, res: Response): Promise<Response> {

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

  static async getUser(req: Request, res: Response) {
    const id = req.params.id;
    try {
      const user = await UserService.getUser(id);
      if (!user) {
        res.status(404).send("Could not find user");
      } else {
        res.status(200).send({firstName: user.first_name, lastName: user.last_name, phoneNumber: user.phone_number, address: user.address, active: user.active});
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};