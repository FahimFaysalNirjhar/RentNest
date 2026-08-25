import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router();

router.get("/", categoryController.getAllcategories);

export const categoryRouter = router;
