import { Router, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import { validate } from "../middleware/validate";
import { loginSchema } from '../utils/auth.schema';

const router = Router();

router.post("/login", validate(loginSchema), (req: Request, res: Response) => {
    AuthController.login(req, res);
});

router.post("/logout" ,  (req: Request, res: Response) => {
    AuthController.logout(req, res);
});

export default router;