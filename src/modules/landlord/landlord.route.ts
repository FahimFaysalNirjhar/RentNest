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

router.put(
  "/properties/:id",
  auth(UserRole.LANDLORD),
  landlordController.updateProperty,
);

router.delete(
  "/properties/:id",
  auth(UserRole.LANDLORD),
  landlordController.deleteProperty,
);

export const landlordRouter = router;
