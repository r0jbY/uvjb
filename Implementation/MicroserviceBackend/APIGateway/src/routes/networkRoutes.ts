import axios from "axios";
import forwardRequest from "../utils/forwardRequest";
import { verifyJwt } from '../middleware/jwtMiddleware';
import catchAsync from '../utils/catchAsync'; // ✅ Import your catchAsync helper
import { Router } from "express";

const router = Router();

router.use(verifyJwt);

router.get('/network/getAll/:clientId/:layer', catchAsync((req, res, next) => {
    const { clientId, layer } = req.params;
    return forwardRequest(req, res, next, `http://localhost:3004/network/getAll/${clientId}/${layer}`);
}));

export default router;