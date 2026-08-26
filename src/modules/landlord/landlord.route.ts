import { Router } from "express";
import { auth } from "../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { landlordController } from "./landlord.controller";

const router = Router();

router.post(
  "/properties",
  auth(UserRole.LANDLORD),
  landlordController.createProperties,
);

export const landlordRouter = router;
