import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: { name: string; email: string; id: string; role: UserRole };
    }
  }
}

export const auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error(
        "You are not logged in. Please log in to access this resource",
      );
    }

    const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { name, email, id, role } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error("You do not have permission to access this resource");
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });

    if (!user) {
      throw new Error("User not Found! Please login again");
    }

    if (user.status === "BANNED") {
      throw new Error("Your account has been banned. Please contact support");
    }

    req.user = { name, email, id, role };

    next();
  });
};
