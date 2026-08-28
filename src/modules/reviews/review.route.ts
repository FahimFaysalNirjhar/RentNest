import { Router } from "express";
import { auth } from "../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/", auth(UserRole.TENANT), reviewController.createReview);

router.get("/", auth(UserRole.TENANT), reviewController.getAllReviews);

router.get("/:id", auth(UserRole.TENANT), reviewController.getSingleReviews);

export const reviewRouter = router;
