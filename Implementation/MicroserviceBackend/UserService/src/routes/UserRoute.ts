import { Router } from "express";
import UserController from "../controllers/UserController";
import catchAsync from "../utils/catchAsync"; // Make sure this path is correct
import { allowSelfOrAdmin } from "../middleware/allowSelfOrAdmin";

const router = Router();

router.get("/getAll", catchAsync(UserController.getUsers));

router.get("/search", catchAsync(UserController.searchUsers));

router.get("/:id", allowSelfOrAdmin('id'), catchAsync(UserController.getUser));

router.post("/byIds", catchAsync(UserController.getUsersByIds))

export default router;
 