import {
  PaymentStatus,
  RentalRequestStatus,
} from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IReviewPayload } from "./review.interface";

const createReview = async (tenantId: string, payload: IReviewPayload) => {
  const { rentalRequestId, rating, comment } = payload;

  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
    where: {
      id: rentalRequestId,
    },
    include: {
      payment: true,
    },
  });

  // Check tenant ownership
  if (rentalRequest.tenantId !== tenantId) {
    throw new Error("You are not authorized to review this booking.");
  }

  // Rental must be completed
  if (rentalRequest.status !== RentalRequestStatus.COMPLETED) {
    throw new Error("You can only review a completed rental.");
  }

  // Payment must be paid
  if (
    !rentalRequest.payment ||
    rentalRequest.payment.status !== PaymentStatus.PAID
  ) {
    throw new Error("Please complete the payment before leaving a review.");
  }

  // Prevent duplicate review
  const existingReview = await prisma.review.findUnique({
    where: {
      tenantId_propertyId: {
        tenantId,
        propertyId: rentalRequest.propertyId,
      },
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this property.");
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      tenantId,
      propertyId: rentalRequest.propertyId,
      rating,
      comment,
    },
  });

  return review;
};

const getAllReviews = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
      property: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
};

export const reviewService = {
  createReview,
  getAllReviews,
};
