import apiClient from "../api/axiosClient";
import { AttendanceResponse } from "../types/attendance";

export const attendanceService = {
  startShift: async (): Promise<AttendanceResponse> => {
    const response =
      await apiClient.post<AttendanceResponse>("/attendance/start");
    return response.data;
  },

  endShift: async (): Promise<AttendanceResponse> => {
    const response =
      await apiClient.post<AttendanceResponse>("/attendance/end");
    return response.data;
  },

  startBreak: async (): Promise<AttendanceResponse> => {
    const response = await apiClient.post<AttendanceResponse>(
      "/attendance/break/start",
    );
    return response.data;
  },

  endBreak: async (): Promise<AttendanceResponse> => {
    const response = await apiClient.post<AttendanceResponse>(
      "/attendance/break/end",
    );
    return response.data;
  },

  getStatus: async (): Promise<AttendanceResponse> => {
    const response =
      await apiClient.get<AttendanceResponse>("/attendance/status");
    return response.data;
  },

  getHistory: async (date: string): Promise<AttendanceResponse> => {
    const response = await apiClient.get<AttendanceResponse>(
      "/attendance/history",
      {
        params: { date },
      },
    );
    return response.data;
  },
};
