import { prisma } from "../../lib/prisma";
import {
  CreatePropertiesPayload,
  UpdatePropertiesPayload,
} from "./landlord.instance";

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
    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  });

  return property;
};

const updateProperty = async (
  userId: string,
  propertyId: string,
  payload: UpdatePropertiesPayload,
) => {
  const landlord = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  if (property.landlordId !== landlord.id) {
    throw new Error("You are not authorized to update this property.");
  }

  if (payload.categoryId) {
    await prisma.category.findUniqueOrThrow({
      where: { id: payload.categoryId },
    });
  }

  const updatedProperty = await prisma.property.update({
    where: { id: property.id },
    data: payload,
    include: {
      category: true,
      landlord: {
        omit: {
          password: true,
        },
      },
    },
  });

  return updatedProperty;
};

const deleteProperty = async (userId: string, propertyId: string) => {
  const landlord = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  if (property.landlordId !== landlord.id) {
    throw new Error("You are not authorized to delete this service.");
  }

  await prisma.property.delete({
    where: { id: property.id },
  });
};

export const landlordService = {
  createProperties,
  updateProperty,
  deleteProperty,
};
