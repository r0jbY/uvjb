import { Router, Request, Response } from "express";
import UserController from "../controllers/UserController";
import {validate} from "../middleware/validate"
import { userSchema } from "../utils/user.schema";

const router = Router();



router.get("/getAll", (req: Request, res: Response) => {
    UserController.getUsers(req, res);
})

router.get('/search', (req: Request, res: Response) => {
    UserController.searchUsers(req, res);
})

router.get('/:id', (req: Request, res: Response) => {
    UserController.getUser(req, res);
})
export default router;