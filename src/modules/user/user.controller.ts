import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const user = await userService.registerUser(payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "User registered successfully",
      data: { user },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const profile = await userService.getMyProfile(id as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User Profile fetched successfully",
      data: { profile },
    });
  },
);

export const userController = {
  registerUser,
  getMyProfile,
};
