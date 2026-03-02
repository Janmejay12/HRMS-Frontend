import { api } from "./axios";
import type { ExpenseCategory, ExpenseStatus, Statuses } from "./enums";

export interface CreateExpenseRequest {
  currency: string;
  amount: number;
  expenseDate: string;
  expenseCategory: ExpenseCategory;
  expenseStatus: ExpenseStatus;
}
export interface UpdateExpenseRequest {
  currency: string;
  amount: number;
  expenseDate: string;
  expenseCategory: ExpenseCategory;
}

export interface ExpenseResponse {
  expenseId: number;
  employeeId: number;
  travelId: number;
  currency: string;
  amount: number;
  expenseDate: string;
  expenseCategory: ExpenseCategory;
  expenseStatus: ExpenseStatus;
}

export const expenseApis = {
  createExpense: async (
    travelId: number,
    request: CreateExpenseRequest,
  ): Promise<ExpenseResponse> => {
    const response = await api.post<ExpenseResponse>(
      `/travels/${travelId}/expenses`,
      request,
    );
    return response.data;
  },

  updateExpense: async (
    travelId: number,
    expenseId: number,
    request: UpdateExpenseRequest,
  ): Promise<ExpenseResponse> => {
    const response = await api.put<ExpenseResponse>(
      `/travels/${travelId}/expenses/${expenseId}`,
      request,
    );
    return response.data;
  },

  deleteExpense: async (
    travelId: number,
    expenseId: number,
  ): Promise<string> => {
    const response = await api.delete<string>(
      `/travels/${travelId}/expenses/${expenseId}`,
    );
    return response.data;
  },

  getAllExpensesByTravelId: async (
    travelId: number,
  ): Promise<ExpenseResponse[]> => {
    const response = await api.get<ExpenseResponse[]>(
      `/travels/${travelId}/expenses`,
    );
    return response.data;
  },

  getMyExpenses: async (travelId: number): Promise<ExpenseResponse[]> => {
    const response = await api.get<ExpenseResponse[]>(
      `/travels/${travelId}/expenses/my`,
    );
    return response.data;
  },

  getExpenseById: async (
    travelId: number,
    id: number,
  ): Promise<ExpenseResponse> => {
    const response = await api.get<ExpenseResponse>(
      `/travels/${travelId}/expenses/${id}`,
    );
    return response.data;
  },

  changeExpenseStatus: async (
    travelId: number,
    id: number,
    status: ExpenseStatus,
  ): Promise<ExpenseResponse> => {
    const response = await api.put<ExpenseResponse>(
      `/travels/${travelId}/expenses/${id}/status`,
      {
        status: status,
      },
    );
    return response.data;
  },
};
