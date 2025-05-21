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

  static async getNetwork(req: Request, res: Response): Promise<Response> {
    const clientId = req.params.clientId;
    const layer = parseInt(req.params.layer);

    if (!clientId || isNaN(layer)) {
    throw createHttpError("Invalid client ID or layer", 400);
  }

    const result = await NetworkService.getNetwork(clientId, layer);
    return res.status(200).json(result);
  }

};