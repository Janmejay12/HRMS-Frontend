import { api } from "./axios";

export interface GameResponse {
  gameId: number | null;
  gameName: string;
  slotMinutes: number;
  operatingStartHours: string;
  operatingEndHours: string;
}

export interface GameSlotResponse {
  SlotId: number;
  slotNumber: number;
  startTime: string;
  endTime: string;
  slotDate: string;
  gameId: number;
  status: SlotStatuses;
}
export enum SlotStatuses {
  AVAILABLE = "EMPTY",
  BOOKED = "BOOKED",
}

export const GameApis = {
  getAllGames: async (): Promise<GameResponse[]> => {
    const response = await api.get<GameResponse[]>("/games");
    return response.data;
  },
  getAllSlots: async (id: number): Promise<GameSlotResponse[]> => {
    const response = await api.get<GameSlotResponse[]>(
      `/games/${id}/game-slots`,
    );
    return response.data;
  },
};
