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

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
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

app.use(notFound);
app.use(globalErrorHandler);

export default app;
