import apiClient from "../api/axiosClient";
import { User, UserApiResponse } from "../types/user";

export const userService = {
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<UserApiResponse>(`/users/${id}`, {
      headers: {
        "x-user-id": id,
      },
    });

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error("Failed to fetch user details");
  },
};
