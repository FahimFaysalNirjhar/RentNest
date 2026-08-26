import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { propertyService } from "./property.service";
import HttpStatus from "http-status";
import { sendResponse } from "../utils/sendResponse";

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await propertyService.getAllProperties(query);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Properties retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

const getSingleProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const result = await propertyService.getSingleProperty(id);
  },
);

export const propertyController = {
  getAllProperties,
  getSingleProperty,
};
