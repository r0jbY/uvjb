import { Router } from "express";
import MeetingController from "../controllers/MeetingController";
import catchAsync from "../utils/catchAsync"; // Make sure this path is correct
import { allowSelfOrAdmin } from "../middleware/allowSelfOrAdmin";
import {validate} from '../middleware/validate'
import { acceptSchema, finishSchema } from "../utils/schema";

const router = Router();

router.get('/getMeetings', catchAsync(MeetingController.getMeetings));

router.get('/getStatus/:clientId', catchAsync(MeetingController.getStatus));

router.post("/create",  catchAsync(MeetingController.createMeeeting));

router.put("/accept/:meetingId", validate(acceptSchema), catchAsync(MeetingController.acceptMeeting));

router.put("/finish/:meetingId", validate(finishSchema), catchAsync(MeetingController.finishMeeting));

router.get('/current-accepted/:buddyId', catchAsync(MeetingController.getAccepted));

router.get('/history/:buddyId', catchAsync(MeetingController.getHistory))

export default router;
 