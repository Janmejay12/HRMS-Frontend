import { api } from "./axios";
import type { DocumentTypes, OwnerTypes } from "./enums";

export interface TravelDocumentRequest {
  fileName: string;
  documentType: DocumentTypes;
  ownerType: OwnerTypes;
}

export interface TravelDocumentResponse {
  travelId: number;
  uploadedBy: number;
  fileName: string;
  documentType: DocumentTypes;
  ownerType: OwnerTypes;
  storageUrl: string;
}

export const travelDocumentApis = {
  getdocuments: async (travelId: number): Promise<TravelDocumentResponse[]> => {
    const response = await api.get<TravelDocumentResponse[]>(
      `/travels/${travelId}/documents`,
    );
    return response.data;
  },

  getdocumentById: async (
    travelId: number,
    documentId: number,
  ): Promise<TravelDocumentResponse> => {
    const response = await api.get<TravelDocumentResponse>(
      `/travels/${travelId}/documents/${documentId}`,
    );
    return response.data;
  },

  uploadDocument: async (
    travelId: number,
    request: FormData,
    file :File
  ): Promise<TravelDocumentResponse> => {
    const formData = new FormData();
    formData.append("data", new Blob ([JSON.stringify(request)],{
        type : "application/json"
    }))
    formData.append("file",file)

    const response = await api.post<TravelDocumentResponse>(`/travels/${travelId}/documents`,
        formData,{
            headers : {
                "Content-Type" : "multipart/form-data"
            }
        }
    )
    
    return response.data;
  },
};
