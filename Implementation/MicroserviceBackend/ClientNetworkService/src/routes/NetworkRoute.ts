import { Router } from "express";
import NetworkController from "../controllers/NetworkController";
import catchAsync from "../utils/catchAsync"; // Make sure this path is correct

const router = Router();

router.put("/manage", catchAsync(NetworkController.manageNetwork));


export default router;
