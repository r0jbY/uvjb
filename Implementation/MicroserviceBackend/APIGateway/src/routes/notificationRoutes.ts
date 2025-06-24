import axios from "axios";
import forwardRequest from "../utils/forwardRequest";
import { verifyJwt } from '../middleware/jwtMiddleware';
import catchAsync from '../utils/catchAsync'; // ✅ Import your catchAsync helper
import { Router } from "express";

const router = Router();

router.use(verifyJwt('buddy'));

router.post('/addToken', catchAsync(async (req, res, next) => {
    return forwardRequest(req, res, next, `${process.env.NOTIFICATION_SERVICE_URL}/notifications/addToken`);
}));

router.delete('/removeToken', catchAsync(async (req, res, next) => {
    return forwardRequest(req, res, next, `${process.env.NOTIFICATION_SERVICE_URL}/notifications/removeToken`);
}));

export default router;