import type { UserType } from '@shared/types/entities';

export type UserWithToken = {
  access_token: string;
  user: UserType;
};
