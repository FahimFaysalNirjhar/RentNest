import { prisma } from "../../lib/prisma";
import { CreatePropertiesPayload } from "./landlord.instance";

const createProperties = async (
  userId: string,
  payload: CreatePropertiesPayload,
) => {
  const landlord = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (landlord.status === "BANNED") {
    throw new Error("Your account has been blocked. Please contact support.");
  }

  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  const property = await prisma.property.create({
    data: {
      title: payload.title,
      description: payload.description,
      location: payload.location,
      address: payload.address,
      city: payload.city,
      country: payload.country,
      propertyType: payload.propertyType,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      area: payload.area,
      rent: payload.rent,
      securityDeposit: payload.securityDeposit,
      amenities: payload.amenities,
      images: payload.images,
      isAvailable: payload.isAvailable,
      categoryId: payload.categoryId,
      landlordId: landlord.id,
    },
  });

  return property;
};

export const landlordService = { createProperties };
