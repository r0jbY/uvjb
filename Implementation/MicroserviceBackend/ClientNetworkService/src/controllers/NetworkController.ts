import { Request, Response } from "express";
import { NetworkService } from "../services/NetworkService";

type TypedError = Error & { statusCode?: number };

export const createHttpError = (message: string, statusCode: number): TypedError => {
  const err = new Error(message) as TypedError;
  err.statusCode = statusCode;
  return err;
};

export default class NetworkController {

  
  static async manageNetwork(req: Request, res: Response): Promise<Response> {

    const { clientId, addBuddies, removeBuddies, layer } = req.body;

    await NetworkService.updateNetwork(clientId, addBuddies || [], removeBuddies || [], layer);
    return res.status(200).json({ message: "Client network updated successfully." });
  }
  
};