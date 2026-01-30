import type { LevelId } from '@shared/types/entities';

export type Certification = {
  id: string;
  user_id: string;
  certificateId: string;
  level_name: LevelId;
  createdAt: string;
};

export type PaymentParams = {
  level_name: LevelId;
  phone_number: string;
  city: string;
  country: string;
};

export type LevelType = {
  id: string;
  level_name: LevelId;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  isAvailable: boolean;
};
