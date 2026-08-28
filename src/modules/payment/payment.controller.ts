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

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as Buffer;
    const signature = req.headers["stripe-signature"]!;

    await paymentService.handleWebhook(payload, signature as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Webhook triggered successfully",
      data: null,
    });
  },
);

const getPaymentHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.user?.id as string;

    const result = await paymentService.getPaymentHistory(tenantId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Payment history retrieved successfully",
      data: result,
    });
  },
);

const getSinglePaymentHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const tenantIdId = req.user?.id as string;

    const result = await paymentService.getSinglePaymentHistory(id, tenantIdId);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Payment details retrieved successfully",
      data: result,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
  getPaymentHistory,
  getSinglePaymentHistory,
};
