import { Request, Response } from "express";
import { UserService } from "../services/UserService";

type TypedError = Error & { statusCode?: number };

export const createHttpError = (message: string, statusCode: number): TypedError => {
  const err = new Error(message) as TypedError;
  err.statusCode = statusCode;
  return err;
};

export default class UserController {

  static async getUsers(req: Request, res: Response): Promise<Response> {

    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const users = await UserService.getUsers(limit, offset);
    return res.status(200).json(users);
  }

  static async searchUsers(req: Request, res: Response) {
    const query = req.query.query as string;

    const users = await UserService.searchUsers(query);
    return res.status(200).json(users);

  }

  static async getUser(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const user = await UserService.getUser(id);

    if (!user) {
      throw createHttpError("User not found", 404);
    }

    return res.status(200).json({
      firstName: user.first_name,
      lastName: user.last_name,
      phoneNumber: user.phone_number,
      address: user.address,
      active: user.active,
    });
  }
};