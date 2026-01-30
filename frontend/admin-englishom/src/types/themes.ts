export interface Theme {
  _id: string;
  name: string;
  startDate: string; // Date string
  endDate: string; // Date string
  isActive: boolean;
  assets: {
    backgroundImage?: string;
    logo?: string;
  };
  styles: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateThemeDto {
  name: string;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
  assets?: {
    backgroundImage?: string;
    logo?: string;
  };
  styles?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export type UpdateThemeDto = Partial<CreateThemeDto>;
