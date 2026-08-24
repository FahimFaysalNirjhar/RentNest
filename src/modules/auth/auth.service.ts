import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import { jwtUtils } from "../utils/jwt";
import config from "../../config";
import { JwtPayload, SignOptions } from "jsonwebtoken";

const loginUser = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  if (user.status === "BANNED") {
    throw new Error("Your account has been blocked. Please contact support");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const JwtPayload = {
    id: user?.id,
    email: user?.email,
    name: user?.name,
    role: user?.role,
  };

  const accessToken = jwtUtils.createToken(
    JwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    JwtPayload,
    config.jwt_refesh_secret,
    config.jwt_refresh_expiries_in as SignOptions,
  );

  return { accessToken, refreshToken };
};

const issueRefreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refesh_secret,
  );

  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error);
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  if (user.status === "BANNED") {
    throw new Error("Your account has been blocked. Please contact support");
  }

  const JwtPayload = {
    id: user?.id,
    email: user?.email,
    name: user?.name,
    role: user?.role,
  };

  const accessToken = jwtUtils.createToken(
    JwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  return { accessToken };
};

export const authService = { loginUser, issueRefreshToken };
