export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  city: string;
  strategy: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked' | 'suspended';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export type LevelId =
  | 'LEVEL_A1'
  | 'LEVEL_A2'
  | 'LEVEL_B1'
  | 'LEVEL_B2'
  | 'LEVEL_C1'
  | 'LEVEL_C2';

export type Certification = {
  id: string;
  user_id: string;
  certificateId: string;
  level_name: LevelId;
  createdAt: string;
};
