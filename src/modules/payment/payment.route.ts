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

router.post("/webhook", paymentController.handleWebhook);

router.get(
  "/history",
  auth(UserRole.TENANT),
  paymentController.getPaymentHistory,
);

router.get(
  "/history/:id",
  auth(UserRole.TENANT),
  paymentController.getSinglePaymentHistory,
);

export const paymentRouter = router;
