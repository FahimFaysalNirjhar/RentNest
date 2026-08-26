import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IPropertyQuery } from "./property.interface";

const getAllProperties = async (query: IPropertyQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.PropertyWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          country: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  if (query.propertyType) {
    andConditions.push({
      propertyType: query.propertyType,
    });
  }

  if (query.minRent || query.maxRent) {
    andConditions.push({
      rent: {
        ...(query.minRent && {
          gte: Number(query.minRent),
        }),
        ...(query.maxRent && {
          lte: Number(query.maxRent),
        }),
      },
    });
  }

  if (query.minBedrooms || query.maxBedrooms) {
    andConditions.push({
      bedrooms: {
        ...(query.minBedrooms && {
          gte: Number(query.minBedrooms),
        }),
        ...(query.maxBedrooms && {
          lte: Number(query.maxBedrooms),
        }),
      },
    });
  }

  andConditions.push({
    isAvailable: true,
  });

  const properties = await prisma.property.findMany({
    where: { AND: andConditions },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
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

  const total = await prisma.property.count({
    where: { AND: andConditions },
  });

  return {
    data: properties,
    meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
  };
};

const getSingleProperty = async (id: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id,
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

  return property;
};

export const propertyService = { getAllProperties, getSingleProperty };
