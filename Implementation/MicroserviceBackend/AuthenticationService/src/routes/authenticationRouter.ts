import { Router, Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from '../utils/auth.schema';
import { verifyJwt } from "../middleware/jwtMiddleware";

const router = Router();

router.post("/login", validate(loginSchema), (req: Request, res: Response) => {
    AuthController.login(req, res);
});

router.post("/logout" ,  (req: Request, res: Response) => {
    AuthController.logout(req, res);
});

router.post("/register", verifyJwt, validate(registerSchema), (req: Request, res: Response) => {
    AuthController.register(req, res);
});

export default router;