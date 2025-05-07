import { Request, Response } from "express";
import { UserService } from "../services/ClientService";
import { v4 as uuidv4 } from "uuid";
type TypedError = Error & { statusCode?: number };

export const createHttpError = (message: string, statusCode: number): TypedError => {
  const err = new Error(message) as TypedError;
  err.statusCode = statusCode;
  return err;
};

export default class ClientController {

  static async getClients(req: Request, res: Response): Promise<Response> {

    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const users = await UserService.getClients(limit, offset);
    return res.status(200).json(users);
  }

  static async searchClients(req: Request, res: Response) {
    const query = req.query.query as string;
    const limit = parseInt(req.query.limit as string) || undefined;
    const users = await UserService.searchClients(query, limit);
    return res.status(200).json(users);

  }

  static async getClient(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const client = await UserService.getClient(id);

    if (!client) {
      throw createHttpError("Client not found", 404);
    }

    return res.status(200).json({
      firstName: client.first_name,
      lastName: client.last_name,
      phoneNumber: client.phone_number,
      address: client.address,
      active: client.active,
      deviceCode: client.device_code,
      superbuddyId: client.superbuddy_id
    });
  }

  static async createClient(req: Request, res: Response): Promise<Response> {
    const {
      deviceCode,
      superbuddyId,
      firstName,
      lastName,
      phoneNumber,
      address,
      active
    } = req.body;
    
    const id = uuidv4();

    await UserService.createClient(
      id,
      deviceCode,
      superbuddyId,
      firstName,
      lastName,
      phoneNumber,
      address,
      active
    );
  
    return res.status(200).json({ message: "Client created successfully." });
  }

  static async updateClient(req: Request, res: Response): Promise<Response> {

    const id = req.params.id;

    const {
      deviceCode,
      superbuddyId,
      firstName,
      lastName,
      phoneNumber,
      address,
      active
    } = req.body;
  
    await UserService.updateClient(
      id,
      deviceCode,
      superbuddyId,
      firstName,
      lastName,
      phoneNumber,
      address,
      active
    );
  
    return res.status(200).json({ message: "Client updated successfully." });
  }

  static async deleteClient(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
  
    await UserService.deleteClient(id);
  
    return res.status(200).json({ message: "Client deleted successfully." });
  }
};