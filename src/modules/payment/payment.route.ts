import { Router } from "express";
import { auth } from "../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/checkout",
  auth(UserRole.TENANT),
  paymentController.createCheckoutSession,
);

export const paymentRouter = router;
