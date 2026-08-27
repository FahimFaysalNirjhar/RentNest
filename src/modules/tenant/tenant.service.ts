import { RentalRequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { CreateRentalRequestPayload } from "./tenant.interface";

const createRequest = async (
  id: string,
  payload: CreateRentalRequestPayload,
) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: payload.propertyId,
      isAvailable: true,
    },
    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  });

  const startDate = new Date(payload.startDate);

  const endDate = new Date(payload.endDate);

  if (startDate >= endDate) {
    throw new Error("Start Date must be before end Date.");
  }

  const conflict = await prisma.rentalRequest.findFirst({
    where: {
      propertyId: property.id,
      status: {
        in: [RentalRequestStatus.REQUESTED, RentalRequestStatus.ACCEPTED],
      },
      AND: [
        {
          startDate: {
            lt: endDate,
          },
        },
        {
          endDate: {
            gt: startDate,
          },
        },
      ],
    },
  });

  if (conflict) {
    throw new Error("The selected time slot has already been booked.");
  }

  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      tenantId: id,
      propertyId: property.id,
      startDate: startDate,
      endDate: endDate,
      totalAmount: payload.totalAmount,
      message: payload.message,
      monthlyRent: payload.monthlyRent,
    },
    include: {
      tenant: {
        omit: {
          password: true,
        },
      },
      property: {
        include: {
          landlord: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });

  return rentalRequest;
};

export const rentalRequestService = { createRequest };
