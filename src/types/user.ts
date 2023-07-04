import { UserRole } from '@prisma/client';

export interface UserProfile {
  id: number;
  role: UserRole;
}
