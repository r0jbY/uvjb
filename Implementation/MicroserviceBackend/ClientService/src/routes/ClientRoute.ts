import { Router } from "express";
import ClientController from "../controllers/ClientController";
import { validate } from "../middleware/validate";
import catchAsync from "../utils/catchAsync"; // Make sure this path is correct
import { clientSchema } from "../utils/schema";

const router = Router();

router.get("/getAll", catchAsync(ClientController.getClients));

router.get("/search", catchAsync(ClientController.searchClients));

router.post("/create", validate(clientSchema), catchAsync(ClientController.createClient));

router.delete("/delete/:id", catchAsync(ClientController.deleteClient));

router.put("/update/:id", validate(clientSchema), catchAsync(ClientController.updateClient));

router.get("/:id", catchAsync(ClientController.getClient));

export default router;
