import React from "react";
import type { travelResponse } from "../../apis/travelApis";
import TravelCard from "./TravelCard";

interface TravelListProps {
  travels: travelResponse[];
  onSelect: (travel: travelResponse) => void;
}
const TravelList: React.FC<TravelListProps> = ({ travels, onSelect }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {travels.map((trip) => (
          <div
            key={trip.travelId}
            onClick={() => onSelect(trip)}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <TravelCard travel={trip} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelList;
