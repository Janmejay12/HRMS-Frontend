import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GameApis,
  SlotStatuses,
  type GameSlotResponse,
} from "../../apis/GameApis";
import { adminApis, type EmployeeResponse } from "../../apis/AdminApis";
import { BookingApis } from "../../apis/bookSlotApis";
import { toast } from "sonner";

const GameSlots = () => {
  const { gameId } = useParams();
  const [slots, setSlots] = useState<GameSlotResponse[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [bookingLoading, setBookingLoading] = useState<number | null>(null);
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);

  useEffect(() => {
    fetchSlots();
    fetchEmployees();
  }, [gameId]);

  const fetchSlots = async () => {
    const data = await GameApis.getAllSlots(Number(gameId));
    setSlots(data);
  };

  const fetchEmployees = async () => {
    const data = await adminApis.getAllEmployees();
    setEmployees(data);
  };

  const handlePlayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);

    const values = options.map((o) => Number(o.value));

    setSelectedPlayers(values);
  };

  const handleBook = async (slotId: number) => {
    try {
      setBookingLoading(slotId);

      await BookingApis.bookSlot({
        gameSlotId: slotId,
        playerIds: selectedPlayers,
      });
      fetchSlots();
      toast.success("Slot booked successfully");
    } catch (e: any) {
      toast.error(e.response?.data || "Booking failed");
    } finally {
      setBookingLoading(null);
    }
  };
  const getStatusBadge = (status: SlotStatuses) => {
    if (status === SlotStatuses.AVAILABLE) return "bg-green-100 text-green-700";

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Available Slots</h1>

      {/* Player selection */}

      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Players</label>

        <select
          multiple
          onChange={handlePlayerChange}
          className="w-full border rounded-lg p-3"
        >
          {employees.map((emp) => (
            <option key={emp.employeeId} value={emp.employeeId}>
              {emp.employeeName}
            </option>
          ))}
        </select>
      </div>

      {/* Slots Grid */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {slots.map((slot) => (
          <div
            key={slot.gameSlotId}
            className="bg-white p-5 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Slot #{slot.slotNumber}</span>

              <span
                className={`px-3 py-1 rounded-full text-sm ${getStatusBadge(slot.status)}`}
              >
                {slot.status}
              </span>
            </div>

            <p className="text-gray-600">Date: {slot.slotDate}</p>

            <p className="text-gray-600">
              Time: {slot.startTime} - {slot.endTime}
            </p>

            <button
              onClick={() => handleBook(slot.gameSlotId)}
              className="mt-4 w-full bg-blue-600 text-gray py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {bookingLoading === slot.gameSlotId ? "Booking..." : "Book Slot"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameSlots;
