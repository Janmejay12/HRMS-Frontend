import { api } from "./axios";

export interface expenseDocumentResponse {
  expenseId: number;
  storageUrl: string;
}

export const expenseDocumentApis = {
  uploadExpenseDocument: async (
    expenseId: number,
    file: File,
  ): Promise<expenseDocumentResponse> => {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify({ expenseId })], {
        type: "application/json",
      }),
    );
    formData.append("file", file);

    const response = await api.post<expenseDocumentResponse>(
      `/expenses/${expenseId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  getAllExpenseDocumentsByExpenseId: async (
    expenseId: number,
  ): Promise<expenseDocumentResponse[]> => {
    const response = await api.get(`/expenses/${expenseId}/document`);
    return response.data;
  },

  getDocumentById: async (
    documentId: number,
  ): Promise<expenseDocumentResponse> => {
    const reponse = await api.get(`expenses/documents/${documentId}`);
    return reponse.data;
  },
};
