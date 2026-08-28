import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { adminRouter } from "./modules/admin/admin.route";
import { globalErrorHandler } from "./modules/utils/globalErrorHandler";
import { notFound } from "./modules/middleware/notFound";
import { categoryRouter } from "./modules/categories/category.route";
import { landlordRouter } from "./modules/landlord/landlord.route";
import { propertyRouter } from "./modules/properties/property.route";
import { tenantRouter } from "./modules/tenant/tenant.route";
import { paymentRouter } from "./modules/payment/payment.route";
import { paymentController } from "./modules/payment/payment.controller";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/landlord", landlordRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/rentals", tenantRouter);
app.use("/api/payments", paymentRouter);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
