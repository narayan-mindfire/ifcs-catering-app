export interface User {
  id: string;
  username?: string;
  fmId: string;
  firstName: string;
  lastName: string;
  email: string;
  badgeNumber: string;
  organization: string;
  role: string;
  roles?: string[];
  station: string;
  type: string;
  raicNumber: string;
  picture: string;
  isActive: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserApiResponse {
  success: boolean;
  data: User;
}
