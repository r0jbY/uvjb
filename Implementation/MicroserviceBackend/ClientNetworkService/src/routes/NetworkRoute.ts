import { Router } from "express";
import NetworkController from "../controllers/NetworkController";
import catchAsync from "../utils/catchAsync"; // Make sure this path is correct

const router = Router();

router.put("/manage", catchAsync(NetworkController.manageNetwork));

router.get("/getAll/:clientId/:layer", catchAsync(NetworkController.getNetwork));

router.get("/getClients/:buddyId", catchAsync(NetworkController.getClients))

export default router;
