import { Router } from "express";
import UserController from "../controllers/UserController";
import { validate } from "../middleware/validate";
import { userSchema } from "../utils/user.schema";
import catchAsync from "../utils/catchAsync"; // Make sure this path is correct

const router = Router();

router.get("/getAll", catchAsync(UserController.getUsers));

router.get("/search", catchAsync(UserController.searchUsers));

router.get("/:id", catchAsync(UserController.getUser));

export default router;
