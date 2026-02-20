import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  GameApis,
  SlotStatuses,
  type GameSlotResponse,
} from "../../apis/GameApis";

const GameSlots = () => {
  const { gameId } = useParams();
  const [slots, setSlots] = useState<GameSlotResponse[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => {
    fetchSlots();
  }, [gameId]);

  const fetchSlots = async () => {
    const data = await GameApis.getAllSlots(Number(gameId));
    setSlots(data);
  };

  const handleBook = () => {
    if (selectedSlot) {
      //bookslot call here
    }
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Book Slots</h1>
      <div className="space-y-3">
        {slots.map((slot) => (
          <button
            key={slot.SlotId}
            disabled={!SlotStatuses.AVAILABLE}
            onClick={() => setSelectedSlot(slot.SlotId)}
            className={`w-full p-4 rounded-lg border ${selectedSlot === slot.SlotId ? "bg-blue-100 border-blue-500" : "bg-white"} ${!(slot.status === SlotStatuses.AVAILABLE)} && "opacity-50"}`}
          >
            {slot.startTime} -{" "}
            {slot.status === SlotStatuses.AVAILABLE ? "Available" : "Booked"}
          </button>
        ))}
      </div>
      <button
        onClick={handleBook}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Confirm Booking
      </button>
    </div>
  );
};

export default GameSlots;
