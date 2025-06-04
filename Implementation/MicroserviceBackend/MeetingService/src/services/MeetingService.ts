import { prisma } from "../config/database";
import { createHttpError } from "../controllers/MeetingController";



export class MeetingService {

  

  static async createMeeting(clientId: string) {
    try {
      const meeting = await prisma.meeting.create({
        data: {
          clientId: clientId,
        },
      });

      return meeting;
    } catch (error) {
      console.error("DB error (createMeeting):", error);
      throw createHttpError("Failed to create meeting.", 500);
    }
  }

  static async acceptMeeting(buddyId: string, meetingId: string) {
    try {
      const result = await prisma.meeting.updateMany({
        where: {
          id: meetingId,
          status: 'pending', // ✅ now allowed
        },
        data: {
          buddyId,
          acceptedAt: new Date(),
          status: "accepted",
        },
      });

      if (result.count === 0) {
        throw createHttpError("Meeting not found or already accepted / expired.", 404);
      }

      // Optionally return the updated record
      return await prisma.meeting.findUnique({ where: { id: meetingId } });
    } catch (error) {
      console.error("DB error (acceptMeeting):", error);

      if (error instanceof Error && 'statusCode' in error) {
        throw error; // 🔁 re-throw the original error with its status code
      }

      throw createHttpError("Failed to accept meeting.", 500);
    }
  }




}
