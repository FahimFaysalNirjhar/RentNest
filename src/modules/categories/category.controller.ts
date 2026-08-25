import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";

const getAllcategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllcategories();

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Categories retrieved successfully",
      data: result,
    });
  },
);

export const categoryController = {
  getAllcategories,
};
