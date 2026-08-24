import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IUserQuery } from "./admin.interface";

const getAllUsers = async (query: IUserQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;

  const page = query.page ? Number(query.page) : 1;

  const skip = (page - 1) * limit;

  const andConditions: UserWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        {
          email: { contains: query.searchTerm, mode: "insensitive" },
        },
      ],
    });
  }

  // Object.values(Role).includes(role as Role)

  if (query.role && Object.values(UserRole).includes(query.role as UserRole)) {
    andConditions.push({ role: query.role as UserRole });
  }

  if (
    query.status &&
    Object.values(UserStatus).includes(query.status as UserStatus)
  ) {
    andConditions.push({
      status: query.status as UserStatus,
    });
  }

  const users = await prisma.user.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip: skip,
    omit: {
      password: true,
    },
    include: {
      properties: true,
      rentalRequests: true,
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const totalUserCount = await prisma.user.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: users,
    meta: {
      page: page,
      limit: limit,
      total: totalUserCount,
      totalPage: Math.ceil(totalUserCount / limit),
    },
  };
};

export const adminService = {
  getAllUsers,
};
