import { UserRole } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profilePhoto?: string;
  phone: string;
  address: string;
}

export interface UpdatedUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  profilePhoto?: string;
  phone?: string;
  address?: string;
}
