import { prisma } from "../config/database";
import { createHttpError } from "../controllers/MeetingController";



export class MeetingService {



  static async createMeeting(clientId: string) {
    try {

      const existing = await prisma.meeting.findFirst({
        where: {
          clientId,
          status: { in: ['pending', 'accepted'] },
        },
      }) || null;

      console.log(existing);

      if (existing) {

        console.log("Entered this!");

        return ({ message: "Meeting exists already", status: existing.status, meetingId: existing.id }); // 409 Conflict
      }

      const meeting = await prisma.meeting.create({
        data: {
          clientId: clientId,
        },
      });

      return ({ message: "Meeting created!", status: meeting.status, meetingId: meeting.id });
    } catch (error) {

      if (error instanceof Error && 'statusCode' in error) {
        throw error; // 🔁 re-throw the original error with its status code
      }


      console.error("DB error (createMeeting):", error);
      throw createHttpError("Failed to create meeting.", 500);
    }
  }

  static async getStatus(clientId: string) {
   
    const EXPIRATION_THRESHOLD = 21 * 60; 
    const NOTIFICATION_THRESHOLD = 10 * 60;      
  

    try {
      const meeting = await prisma.meeting.findFirst({
        where: { clientId, status: { in: ['accepted', 'pending'] } },
        orderBy: { createdAt: 'desc' },
      });

      if (!meeting) throw createHttpError('No meeting found.', 404);

      const now = Date.now();
      const secondsPassed = (now - new Date(meeting.createdAt).getTime()) / 1000;

      const shouldExpire = meeting.status === 'pending'
        && secondsPassed > EXPIRATION_THRESHOLD;

      const shouldNotify = !meeting.notified
        && secondsPassed > NOTIFICATION_THRESHOLD;

      
      if (!shouldExpire && !shouldNotify) {
        return { ...meeting, notifiedUpdated: false };
      }

     
      const updatedMeeting = await prisma.meeting.update({
        where: { id: meeting.id },
        data: {
          status: shouldExpire ? 'expired' : meeting.status,
          notified: shouldNotify ? true : meeting.notified,
        },
      });
     

      return { ...updatedMeeting, notifiedUpdated: shouldNotify };
    } catch (err) {
      console.error('DB error (getStatus):', err);
      throw createHttpError('Failed to retrieve meeting status.', 500);
    }
  }

  static async getMeetingHistory(buddyId: string) {

    try {
      
      return prisma.meeting.findMany({
        where: {
          buddyId,
          status: 'closed',
        },
        select: {
          clientId: true,
          createdAt: true,
          description: true
        }
      });
    } catch (err) {
      console.error("DB error (listActiveMeetings):", err);
      throw createHttpError("Failed to retrieve meetings.", 500);
    }
  }

  static async listActiveMeetings(clientIds: string[]) {
    const now = new Date();
    const cutoff = new Date(now.getTime() - 21 * 60 * 1000);

    try {


      await prisma.meeting.updateMany({
        where: {
          status: 'pending',
          createdAt: { lt: cutoff },
        },
        data: { status: 'expired' },
      });

     
      return prisma.meeting.findMany({
        where: {
          clientId: { in: clientIds },
          status: 'pending',
        },
        select: {
          id: true,
          clientId: true,
          createdAt: true

        }
      });
    } catch (err) {
      console.error("DB error (listActiveMeetings):", err);
      throw createHttpError("Failed to retrieve meetings.", 500);
    }
  }

  static async getAcceptedMeeting(buddyId: string) {

    try {
     
      return prisma.meeting.findFirst({
        where: {
          buddyId,
          status: 'accepted',
        },
        select: {
          id: true,
          clientId: true
        }
      });
    } catch (err) {
      console.error("DB error (listActiveMeetings):", err);
      throw createHttpError("Failed to retrieve meetings.", 500);
    }
  }

  static async acceptMeeting(buddyId: string, meetingId: string) {
    try {
      console.log(meetingId + ' This is the id of the meeting')
      const result = await prisma.meeting.updateMany({
        where: {
          AND: [
            { id: meetingId },
            { status: 'pending' },
          ],
        },
        data: {
          buddyId,
          acceptedAt: new Date(),
          status: 'accepted',
        },
      });

      if (result.count === 0) {
        throw createHttpError("Meeting not found or already accepted / expired.", 404);
      }

     
      return await prisma.meeting.findUnique({ where: { id: meetingId } });
    } catch (error) {
      console.error("DB error (acceptMeeting):", error);

      if (error instanceof Error && 'statusCode' in error) {
        throw error; // 🔁 re-throw the original error with its status code
      }

      throw createHttpError("Failed to accept meeting.", 500);
    }
  }

  static async finishMeeting(buddyId: string, meetingId: string, description: string) {
    try {
      console.log(meetingId + ' This is the id of the meeting')
      const result = await prisma.meeting.update({
        where: {
          id: meetingId,
          buddyId: buddyId, // ✅ now allowed
          status: "accepted"
        },
        data: {
          description,
          status: "closed",
        },
      });



      
      return await prisma.meeting.findUnique({ where: { id: meetingId } });
    } catch (error) {
      console.error("DB error (acceptMeeting):", error);

      throw createHttpError("Failed to finish meeting.", 500);
    }
  }




}
