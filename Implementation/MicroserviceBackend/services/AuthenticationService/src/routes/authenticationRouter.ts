import { Router, Request, Response } from "express";
import AuthController from "../controllers/AuthController";


const router = Router();

router.post("/login", (req: Request, res: Response) => {
    AuthController.login(req, res);
});

router.post("/logout", (req: Request, res: Response) => {
    res.send("Hello world");
})

export default router;