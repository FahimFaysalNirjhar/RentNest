import { Router } from "express";
import { auth } from "../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { tenantController } from "./tenant.controller";

const router = Router();

router.post("/", auth(UserRole.TENANT), tenantController.createRequest);

export const tenantRouter = router;
