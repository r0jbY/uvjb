import { Request, Response } from "express";
import { NotificationService } from "../services/NotificationService";
import { Expo, ExpoPushMessage } from "expo-server-sdk";

type TypedError = Error & { statusCode?: number };

export const createHttpError = (message: string, statusCode: number): TypedError => {
  const err = new Error(message) as TypedError;
  err.statusCode = statusCode;
  return err;
};

export default class NotificationController {

  static async addToken(req: Request, res: Response): Promise<Response> {

    const { id, token } = req.body;


    await NotificationService.addToken(id, token);

    return res.sendStatus(200);
  }

  static async removeToken(req: Request, res: Response): Promise<Response> {
    const { id, token } = req.body;

    await NotificationService.removeToken(id, token);
    return res.sendStatus(200);
  }

  static async handleNotificationEmittedEvent(buddyIds: string[], meetingId: string) {
    try {
      const expo = new Expo();


      const tokens = await NotificationService.getTokensForUsers(buddyIds);

      console.log(tokens);

      const messages: ExpoPushMessage[] = tokens
        .filter(Expo.isExpoPushToken)
        .map((token: string) => ({
          to: token,
          sound: "default",
          title: "Meeting Request",
          body: "You have a new meeting request!",
          data: { meetingId }           // custom payload
        }));

      console.log(meetingId);

      const chunks = expo.chunkPushNotifications(messages);

      for (const chunk of chunks) {
        await expo.sendPushNotificationsAsync(chunk);
      }

      console.log(`✅ Sent notifications to ${tokens.length} tokens`);
    } catch (err) {
      console.error("❌ Failed to handle NotificationEmittedEvent:", err);
    }
  }


};