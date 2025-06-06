import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema, updateSchema } from '../utils/auth.schema';
import catchAsync from "../utils/catchAsync";

const router = Router();

router.post("/login", validate(loginSchema), catchAsync(AuthController.login));

router.post("/logout", catchAsync(AuthController.logout));

router.post("/register", validate(registerSchema), catchAsync(AuthController.register));

router.get("/superbuddies", catchAsync(AuthController.getSuperbuddies));

router.get("/whoAmI", catchAsync(AuthController.whoAmI));

router.delete("/delete/:id", catchAsync(AuthController.deleteUser));

router.put("/update/:id", validate(updateSchema) , catchAsync(AuthController.updateUser));

router.get("/:id", catchAsync(AuthController.getUserById));




export default router;