import { Router } from "express";
import axios from "axios";
import catchAsync from '../utils/catchAsync'; // ✅ Import your catchAsync helper
import { verifyJwt } from "../middleware/jwtMiddleware";

const router = Router();

router.use(verifyJwt('buddy'));

interface Meeting {
  id: string;
  clientId: string;
  createdAt: string;
}

router.get('/meetings/:buddyId', catchAsync(async (req, res) => {


    const { buddyId } = req.params;
    const cookies = req.headers.cookie || "";

    const clientRes = await axios.get(`${process.env.NETWORK_SERVICE_URL}/network/getClients/${buddyId}`);



    const clients = clientRes.data;

    console.log(clients);

    if (!clients || clients.length == 0) {
        return res.status(200).json([]);
    }

    const clientIds = clients.map((c: any) => c.client_id);

    console.log(process.env.MEETING_SERVICE_URL);

    const [clientFullRes, meetingRes] = await Promise.all([
        axios.get(`${process.env.CLIENT_SERVICE_URL}/clients/getSome`, {
            headers: { Authorization: req.headers.authorization, Cookie: cookies },
            withCredentials: true,
            params: { clientIds },
        }),
        axios.get(`${process.env.MEETING_SERVICE_URL}/meetings/getMeetings`, {
            headers: { Authorization: req.headers.authorization, Cookie: cookies },
            withCredentials: true,
            params: { clientIds },
        }),
    ]);

    const meetingByClientId = new Map<string, Meeting>(
        meetingRes.data.map((m: any) => [m.clientId, m] as const),
    );

    // 2.  Merge the two datasets, flattening the meeting fields
    const merged = clientFullRes.data
        .filter((client: any) => meetingByClientId.has(client.id)) // keep only matches
        .map((client: any) => {
            const meeting = meetingByClientId.get(client.id)!;

            return {
                ...client,              // all client fields
                ...meeting,             // clientId, createdAt, …
            };
        });

    // 3.  Send the merged array back to the caller
    return res.status(200).json(merged);
}));

export default router;
