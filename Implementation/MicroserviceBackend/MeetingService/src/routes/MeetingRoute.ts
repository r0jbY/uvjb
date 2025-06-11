import { Router } from "express";
import MeetingController from "../controllers/MeetingController";
import catchAsync from "../utils/catchAsync"; // Make sure this path is correct
import { allowSelfOrAdmin } from "../middleware/allowSelfOrAdmin";
import {validate} from '../middleware/validate'
import { acceptSchema } from "../utils/schema";

const router = Router();

router.get('/getMeetings', catchAsync(MeetingController.getMeetings))

router.post("/create",  catchAsync(MeetingController.createMeeeting));

router.put("/accept/:meetingId", validate(acceptSchema), catchAsync(MeetingController.acceptMeeting));

router.get('/current-accepted/:buddyId', catchAsync(MeetingController.getAccepted));


export default router;
 