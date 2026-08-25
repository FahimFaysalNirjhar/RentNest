import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";

export interface IUserQuery extends UserWhereInput {
  role?: UserRole;
  status?: UserStatus;
  searchTerm?: string;
  page?: string;
  limit?: string;
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
}

export interface CategoryPayload {
  name: string;
  description?: string;
}
