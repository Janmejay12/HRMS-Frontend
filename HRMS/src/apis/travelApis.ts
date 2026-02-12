import { api } from "./axios";
import type { Statuses } from "./enums";

export interface createTravelRequest{
    travelTitle: string;
    location: string;
    purpose: string;
    startDate: Date; 
    employeeIds: number[];
    endDate: Date; 
    statusId: number;
}
export interface travelResponse{
    travelId: number;          
    travelTitle: string;
    location: string;
    purpose: string;
    startDate: Date;           
    travelCreatedBy: number;    
    endDate: Date;
    travellers: number[];      
    status: Statuses; 
}

export const travelApis = {
    createTravel : async  (request : createTravelRequest) : Promise<travelResponse> => {
        const response = await api.post<travelResponse>('/travels', request)
                return response.data;
    },

    getAllTravels : async  () : Promise<travelResponse[]> => {
        const response = await api.get<travelResponse[]>('/travels')
                return response.data;
    },
    
    getTravelById : async (id : number) : Promise<travelResponse> => {
        const response = await api.get<travelResponse>(`/travels/${id}`)
                return response.data;
    },
    changeTravelStatus : async (id : number, status : Statuses) : Promise<travelResponse> => {
        const response = await api.put<travelResponse>(`/travels/${id}/status`, status)
                return response.data;
    }
}