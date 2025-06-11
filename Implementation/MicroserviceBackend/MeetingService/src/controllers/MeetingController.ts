import { Response, Request } from "express";
import { MeetingService } from "../services/MeetingService";


type TypedError = Error & { statusCode?: number };

export const createHttpError = (message: string, statusCode: number): TypedError => {
    const err = new Error(message) as TypedError;
    err.statusCode = statusCode;
    return err;
};

export default class MeetingController {

    static async createMeeeting(req: Request, res: Response): Promise<Response> {
        console.log("Works!");

        const clientId = req.body.clientId;

        if (!clientId) {
            throw createHttpError('No id provided', 400);
        }

        const meeting = await MeetingService.createMeeting(clientId);

        console.log(meeting);

        return res.sendStatus(200);
    }

    static async getMeetings(req: Request, res: Response): Promise<Response> {


        console.log('Here!');


        const ids = req.query.clientIds;
        const clientIds = Array.isArray(ids)
            ? ids.map(id => String(id))    // 🔁 safely cast each to string
            : typeof ids === 'string'
                ? [ids]
                : [];


        const meetings = await MeetingService.listActiveMeetings(clientIds);
        return res.status(200).json(meetings);
    }

    static async acceptMeeting(req: Request, res: Response): Promise<Response> {
        console.log("Works!");

        const { buddyId } = req.body;
        const { meetingId } = req.params;

        const meeting = await MeetingService.acceptMeeting(buddyId, meetingId);

        console.log(meeting);

        return res.sendStatus(200);
    }

}