import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await adminService.getAllUsers(query);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Users Retrived Successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

export const adminController = {
  getAllUsers,
};
