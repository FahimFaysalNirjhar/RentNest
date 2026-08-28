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

const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const reviews = await reviewService.getAllReviews();

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Reviews retrieved successfully",
      data: reviews,
    });
  },
);

const getSingleReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    const review = await reviewService.getSingleReviews(id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Review retrieved successfully",
      data: review,
    });
  },
);

export const reviewController = {
  createReview,
  getAllReviews,
  getSingleReviews,
};
