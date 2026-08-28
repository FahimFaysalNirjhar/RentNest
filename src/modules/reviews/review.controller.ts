import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";
import { reviewService } from "./review.service";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;
    const payload = req.body;

    const result = await reviewService.createReview(tenantId, payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Review submitted successfully",
      data: result,
    });
  },
);

export const reviewController = {
  createReview,
};
