import {
  PropertyType,
  RentalRequestStatus,
} from "../../../generated/prisma/enums";

export interface CreatePropertiesPayload {
  title: string;
  description: string;

  location: string;
  address?: string;
  city?: string;
  country?: string;

  propertyType: PropertyType;

  bedrooms?: number;
  bathrooms?: number;
  area?: number;

  rent: number;
  securityDeposit?: number;

  amenities?: string[];
  images?: string[];

  isAvailable?: boolean;

  categoryId: string;
}
export interface UpdatePropertiesPayload {
  title?: string;
  description?: string;

  location?: string;
  address?: string;
  city?: string;
  country?: string;

  propertyType?: PropertyType;

  bedrooms?: number;
  bathrooms?: number;
  area?: number;

  rent?: number;
  securityDeposit?: number;

  amenities?: string[];
  images?: string[];

  isAvailable?: boolean;
  categoryId?: string;
}

export interface UpdateRentalRequestPayload {
  status: RentalRequestStatus;
}
