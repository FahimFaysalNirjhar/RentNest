import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { landlordService } from "./landlord.service";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";

const createProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const result = await landlordService.createProperties(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Property created successfully",
      data: result,
    });
  },
);

const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const propertyId = req.params.id as string;
    const payload = req.body;

    const result = await landlordService.updateProperty(
      userId,
      propertyId,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Property updated successfully",
      data: result,
    });
  },
);

const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const propertyId = req.params.id as string;

    await landlordService.deleteProperty(userId, propertyId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Property deleted successfully",
      data: null,
    });
  },
);

export const landlordController = {
  createProperties,
  updateProperty,
  deleteProperty,
};
