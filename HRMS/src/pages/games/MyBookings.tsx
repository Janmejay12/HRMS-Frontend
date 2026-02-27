import React, { useEffect, useState } from "react";
import {
  BookingApis,
  SlotBookingStatuses,
  type BookSlotResponse,
} from "../../apis/bookSlotApis";
import { toast } from "sonner";

const MyBookings = () => {
  const [bookings, setBookings] = useState<BookSlotResponse[]>([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const data = await BookingApis.getMyBookings();

    setBookings(data);
  };
 

  const [cancelLoading, setCancelLoading] = useState<number | null>(null);

  const handleCancel = async (bookingId: number) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmCancel) return;

    try {
      setCancelLoading(bookingId);

      await BookingApis.cancelBooking(bookingId);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (e: any) {
      toast.error("Cancel failed");
    } finally {
      setCancelLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "BOOKED":
        return "text-green-600";

      case "WAITING":
        return "text-yellow-600";

      case "CANCELLED":
        return "text-red-600";

      default:
        return "";
    }
  };
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 && <p>No bookings found</p>}

      <div className="grid md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking.bookingId}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg">
                Booking #{booking.bookingId}
              </h2>

              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                  booking.status,
                )}`}
              >
                {booking.status}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-gray-600">
              <p>Date: {booking.slotDate}</p>

              <p>
                Time:
                {booking.startTime} - {booking.endTime}
              </p>

              <p>
                Booked By:
                {booking.bookedById}
              </p>
            </div>

            {/* Cancel Button */}

            {booking.status !== SlotBookingStatuses.CANCELLED && (
              <button
                onClick={() => handleCancel(booking.bookingId)}
                disabled={cancelLoading === booking.bookingId}
                className="mt-4 w-full bg-red-600 text-gray py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
              >
                {cancelLoading === booking.bookingId
                  ? "Cancelling..."
                  : "Cancel Booking"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
