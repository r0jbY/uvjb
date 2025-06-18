import axios from "axios";
import forwardRequest from "../utils/forwardRequest";
import { verifyJwt } from '../middleware/jwtMiddleware';
import catchAsync from '../utils/catchAsync'; // ✅ Import your catchAsync helper
import { Router } from "express";

const router = Router();

router.use(verifyJwt('admin'));
router.get('/getAll/:clientId/:layer', catchAsync(async (req, res, next) => {
    const { clientId, layer } = req.params;
    const networkRes = await axios.get(`${process.env.NETWORK_SERVICE_URL}/network/getAll/${clientId}/${layer}`);

    const buddyIds = networkRes.data.map((entry: any) => entry.buddy_id);
    if (!buddyIds.length) return res.json([]);

    const usersRes = await axios.post(`${process.env.USER_SERVICE_URL}/users/byIds`, {
        ids: buddyIds
    });

    return res.json(usersRes.data);
}));

router.put('/update', catchAsync((req, res, next) => {
    return forwardRequest(req, res, next, `${process.env.NETWORK_SERVICE_URL}/network/manage`);
}));
export default router;