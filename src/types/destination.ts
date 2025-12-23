export interface Destination {
  id: string;
  fmId: string;
  code: string;
  city: string;
  country: string;
  name: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface DestinationApiResponse {
  success: boolean;
  message: string;
  data: Destination[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
