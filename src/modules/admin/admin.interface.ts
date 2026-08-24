import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";

export interface IUserQuery extends UserWhereInput {
  role?: UserRole;
  status?: UserStatus;
  searchTerm?: string;
  page?: string;
  limit?: string;
}
