import { PropertyType } from "../../../generated/prisma/enums";

export interface IPropertyQuery {
  searchTerm?: string;
  location?: string;
  city?: string;
  propertyType?: PropertyType;
  categoryId?: string;

  minRent?: number;
  maxRent?: number;

  minBedrooms?: number;
  maxBedrooms?: number;

  isAvailable?: boolean;

  page?: number;
  limit?: number;

  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
