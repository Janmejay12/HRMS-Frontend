import { api } from "./axios";
import type { Statuses } from "./enums";

export interface createTravelRequest {
  travelTitle: string;
  location: string;
  purpose: string;
  startDate: string;
  maxPerDayAllowance: number;
  employeeIds: number[];
  endDate: string;
  statusId: number;
}
export interface updateTravelRequest {
  travelTitle: string;
  location: string;
  purpose: string;
  startDate: string;
  maxPerDayAllowance: number;
  employeeIds: number[];
  endDate: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface travelResponse {
  travelId: number;
  travelTitle: string;
  location: string;
  purpose: string;
  startDate: string;
  maxPerDayAllowance: number;
  travelCreatedBy: number;
  endDate: string;
  travellers: number[];
  status: Statuses;
  createdByName: string;
  travellerNames: string[];
}

export const travelApis = {
  createTravel: async (
    request: createTravelRequest,
  ): Promise<travelResponse> => {
    const response = await api.post<travelResponse>("/travels", request);
    return response.data;
  },
  updateTravel: async (
    request: updateTravelRequest,
    travelId: number,
  ): Promise<travelResponse> => {
    const response = await api.put<travelResponse>(
      `/travels/${travelId}`,
      request,
    );
    return response.data;
  },

  getAllTravels: async (
    page: number,
    size: number,
  ): Promise<PageResponse<travelResponse>> => {
    const response = await api.get<PageResponse<travelResponse>>("/travels", {
      params: { page, size },
    });
    return response.data;
  },

  getMyTravels: async (
    page: number,
    size: number,
  ): Promise<PageResponse<travelResponse>> => {
    const response = await api.get<PageResponse<travelResponse>>(
      "/travels/my-travels",
      {
        params: { page, size },
      },
    );
    return response.data;
  },

  getTravelById: async (id: number): Promise<travelResponse> => {
    const response = await api.get<travelResponse>(`/travels/${id}`);
    return response.data;
  },
  deleteTravel: async (id: number): Promise<string> => {
    const response = await api.delete<string>(`/travels/${id}`);
    return response.data;
  },

  changeTravelStatus: async (
    id: number,
    status: Statuses,
  ): Promise<travelResponse> => {
    const response = await api.put<travelResponse>(`/travels/${id}/status`, {
      status: status,
    });
    return response.data;
  },
};
