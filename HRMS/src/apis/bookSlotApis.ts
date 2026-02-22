import { api } from "./axios";

export enum SlotBookingStatuses {
  BOOKED = "BOOKED",
  WAITING = "WAITING",
  CANCELLED = "CANCELLED",
}

export interface BookSlotRequest {
  gameSlotId: number;
  playerIds: number[];
}

export interface BookSlotResponse {
  bookingId: number;
  gameSlotId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  bookedById: number;
  playerIds: number[];
  status: SlotBookingStatuses;
}
export const BookingApis = {
  bookSlot: async (request: BookSlotRequest): Promise<BookSlotResponse> => {
    const response = await api.post("/bookings/book-slots", request);
    return response.data;
  },

  cancelBooking: async (bookingId: number): Promise<string> => {
    const response = await api.put(`/bookings/cancel/${bookingId}`);
    return response.data;
  },

  getMyBookings: async (): Promise<BookSlotResponse[]> => {
    const response = await api.get("/bookings/my-bookings/today");
    return response.data;
  },
};
