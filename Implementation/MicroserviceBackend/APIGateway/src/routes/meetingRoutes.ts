import { Router } from "express";
import axios from "axios";
import catchAsync from '../utils/catchAsync'; // ✅ Import your catchAsync helper
import { verifyJwt } from "../middleware/jwtMiddleware";
import forwardRequest from "../utils/forwardRequest";

const router = Router();


interface Meeting {
    id: string;
    clientId: string;
    createdAt: string;
}

router.post('/create', catchAsync( async (req, res) => {
    const {deviceCode} = req.body;

    if(!deviceCode) {
        return res.status(400);
    }

    const clientRes = await axios.get(`${process.env.CLIENT_SERVICE_URL}/clients/byDeviceCode/${deviceCode}`,);

    await axios.post(`${process.env.MEETING_SERVICE_URL}/meetings/create`, { clientId: clientRes.data.clientId });

    return res.status(200).json("Meetig created!");
}))


router.get('/meetingStatus/:deviceCode', catchAsync( async (req, res) => {
    const {deviceCode} = req.params;

    if(!deviceCode) {
        return res.status(400);
    }

    const clientRes = await axios.get(`${process.env.CLIENT_SERVICE_URL}/clients/byDeviceCode/${deviceCode}`,);

    const meetingRes = await axios.get(`${process.env.MEETING_SERVICE_URL}/meetings/getStatus/${clientRes.data.clientId}`);

    return res.status(200).json(meetingRes.data);
}))


router.use(verifyJwt('buddy'));

router.put('/accept/:id', catchAsync((req, res, next) => {
    const { id } = req.params;
    console.log(id);
    return forwardRequest(req, res, next, `${process.env.MEETING_SERVICE_URL}/meetings/accept/${id}`);
}));

router.put('/finish/:id', catchAsync((req, res, next) => {
    const { id } = req.params;

    return forwardRequest(req, res, next, `${process.env.MEETING_SERVICE_URL}/meetings/finish/${id}`);
}));



router.get('/history/:buddyId', catchAsync(async (req, res) => {

    console.log("Started!");

    const { buddyId } = req.params;
    const cookies = req.headers.cookie || "";


    const meetingResult = await axios.get(`${process.env.MEETING_SERVICE_URL}/meetings/history/${buddyId}`, {
        headers: { Authorization: req.headers.authorization, Cookie: cookies },
        withCredentials: true,
    });



    const clientIds = meetingResult.data.map((m: any) => m.clientId);



    const clientRes = await axios.get(`${process.env.CLIENT_SERVICE_URL}/clients/getSome`, {
        headers: { Authorization: req.headers.authorization, Cookie: cookies },
        withCredentials: true,
        params: { clientIds },
    });

    const clientsById = new Map(clientRes.data.map((c: any) => [c.id, c]));

    const merged: any[] = [];

    for (const meeting of meetingResult.data) {
        const client = clientsById.get(meeting.clientId);
        if (!client) continue;

        const { clientId, ...meetingRest } = meeting; // remove clientId

        merged.push({
            ...client,        // all client fields (includes `id`)
            ...meetingRest,   // all meeting fields except clientId
        });
    }

    res.status(200).json(merged);

}));



router.get('/current-accepted/:buddyId', catchAsync(async (req, res) => {

    const { buddyId } = req.params;
    const cookies = req.headers.cookie || "";

    const meetingResult = await axios.get(`${process.env.MEETING_SERVICE_URL}/meetings/current-accepted/${buddyId}`, {
        headers: { Authorization: req.headers.authorization, Cookie: cookies },
        withCredentials: true,
    });

    const clientRes = await axios.get(`${process.env.CLIENT_SERVICE_URL}/clients/${meetingResult.data.clientId}`, {
        headers: { ...req.headers, Cookie: cookies },
        withCredentials: true,
    });

    console.log(clientRes.data);

    console.log(meetingResult.data);
    return res.status(200).json({
        id: meetingResult.data.id,
        first_name: clientRes.data.firstName,
        last_name: clientRes.data.lastName,
        phone: clientRes.data.phoneNumber,
        address: clientRes.data.address
    });
}));

router.get('/:buddyId', catchAsync(async (req, res) => {
    const { buddyId } = req.params;
    const cookies = req.headers.cookie || "";

    const clientRes = await axios.get(`${process.env.NETWORK_SERVICE_URL}/network/getClients/${buddyId}`, {
        headers: { Authorization: req.headers.authorization, Cookie: cookies, }
    });

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


    const merged = clientFullRes.data
        .filter((client: any) => meetingByClientId.has(client.id)) // keep only matches
        .map((client: any) => {
            const meeting = meetingByClientId.get(client.id)!;

            return {
                ...client,              // all client fields
                ...meeting,             // clientId, createdAt, …
            };
        });


    return res.status(200).json(merged);
}));

export default router;
