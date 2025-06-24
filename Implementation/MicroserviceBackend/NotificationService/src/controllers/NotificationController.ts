import { Request, Response } from "express";
import { NotificationService } from "../services/NotificationService";

type TypedError = Error & { statusCode?: number };

export const createHttpError = (message: string, statusCode: number): TypedError => {
  const err = new Error(message) as TypedError;
  err.statusCode = statusCode;
  return err;
};

export default class NotificationController {

  static async addToken(req: Request, res: Response): Promise<Response> {

    const {id, token} = req.body;


    await NotificationService.addToken(id, token);

    return res.sendStatus(200);
  } 

  static async removeToken(req: Request, res: Response) {
  const { id, token } = req.body;

  await NotificationService.removeToken(id, token);
  return res.sendStatus(200);
}

 
};