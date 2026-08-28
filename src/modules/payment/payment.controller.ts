import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import HttpStatus from "http-status";
import { sendResponse } from "../utils/sendResponse";
import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { requestId } = req.body;
    const result = await paymentService.createCheckoutSession(requestId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
};
