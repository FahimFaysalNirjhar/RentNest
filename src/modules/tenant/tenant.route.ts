import { Router } from "express";
import { auth } from "../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { rentalRequestController } from "./tenant.controller";

const router = Router();

router.post("/", auth(UserRole.TENANT), rentalRequestController.createRequest);

export const rentalRequestRouter = router;
