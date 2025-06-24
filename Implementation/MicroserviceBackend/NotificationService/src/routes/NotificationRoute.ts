import { Router } from "express";
import catchAsync from "../utils/catchAsync"; // Make sure this path is correct
import { validate } from "../middleware/validate";
import { pushSchema } from "../utils/schemas";
import NotificationController from "../controllers/NotificationController";

const router = Router();

router.post("/addToken", validate(pushSchema), catchAsync(NotificationController.addToken));

router.delete('/removeToken', validate(pushSchema), catchAsync(NotificationController.removeToken))

export default router;
 