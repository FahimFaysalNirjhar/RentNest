import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { tenantService } from "./tenant.service";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";

const createRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const result = await tenantService.createRequest(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Rental Request created successfully",
      data: result,
    });
  },
);

export const tenantController = { createRequest };
