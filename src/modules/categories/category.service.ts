import { prisma } from "../../lib/prisma";

const getAllcategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};

export const categoryService = {
  getAllcategories,
};
