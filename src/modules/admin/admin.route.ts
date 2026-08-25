import { Router } from "express";
import { auth } from "../middleware/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controlle";
import { authController } from "../auth/auth.controller";

const router = Router();

// user related apis

router.get("/users", auth(UserRole.ADMIN), adminController.getAllUsers);

router.patch(
  "/users/:id/status",
  auth(UserRole.ADMIN),
  adminController.updateUserStatus,
);

// category related apis

router.post(
  "/categories",
  auth(UserRole.ADMIN),
  adminController.createCategory,
);

router.patch(
  "/categories/:id",
  auth(UserRole.ADMIN),
  adminController.updateCategory,
);

export const adminRouter = router;
