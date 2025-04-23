import { Router, Request, Response } from "express";
import UserController from "../controllers/UserController";
import {validate} from "../middleware/validate"
import { userSchema } from "../utils/user.schema";

const router = Router();

router.post("/register", validate(userSchema),  (req: Request, res: Response) => {
    UserController.register(req, res);
});

router.get("/users", (req: Request, res: Response) => {
    UserController.getUsers(req, res);
})

router.get('/users/search', (req: Request, res: Response) => {
    UserController.searchUsers(req, res);
})
export default router;