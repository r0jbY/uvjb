import axios from "axios";
import forwardRequest from "../utils/forwardRequest";
import { verifyJwt } from '../middleware/jwtMiddleware';
import catchAsync from '../utils/catchAsync'; // ✅ Import your catchAsync helper
import { Router } from "express";

const router = Router();

router.use(verifyJwt);

router.get('/network/getAll/:clientId/:layer', catchAsync(async (req, res, next) => {
    const { clientId, layer } = req.params;
    const networkRes = await axios.get(`http://localhost:3004/network/getAll/${clientId}/${layer}`);

    const buddyIds = networkRes.data.map((entry: any) => entry.buddy_id);

    if (!buddyIds.length) {
        return res.json([]);
    }

    const usersRes = await axios.post('http://localhost:3002/users/byIds', {
        ids: buddyIds
    });

    return res.json(usersRes.data);
}));

router.put('/network/update', catchAsync((req, res, next) => {
    return forwardRequest(req, res, next, `http://localhost:3004/network/manage`);
}));

export default router;