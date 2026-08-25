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

const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const payload = req.body;

    const result = await adminService.updateUserStatus(id, payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User status updated successfully",
      data: result,
    });
  },
);
const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await adminService.createCategory(payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Category created successfully",
      data: result,
    });
  },
);

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;
    const payload = req.body;
    const result = await adminService.updateCategory(id, payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Category updated successfully",
      data: result,
    });
  },
);
const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string;

    await adminService.deleteCategory(id);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Category deleted successfully",
      data: null,
    });
  },
);

export const adminController = {
  getAllUsers,
  updateUserStatus,
  createCategory,
  updateCategory,
  deleteCategory,
};
