import React, { useEffect, useState } from "react";
import type { travelResponse } from "../../apis/travelApis";
import { Statuses } from "../../apis/enums";
import { adminApis } from "../../apis/AdminApis";

interface TravelCardProps {
  travel: travelResponse;
  onClick?: () => void;
}
const TravelCard: React.FC<TravelCardProps> = ({ travel, onClick }) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">
        {travel.travelTitle}
      </h3>

      <p className="text-gray-600 mb-1">📍 {travel.location}</p>

      <p className="text-gray-700 italic mb-2">{travel.purpose}</p>

      <div className="flex justify-between text-sm text-gray-500 mb-3">
        <span>
          {travel.startDate && new Date(travel.startDate).toDateString()}
        </span>
        <span>{travel.endDate && new Date(travel.endDate).toDateString()}</span>
      </div>

      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">
          Travellers:
        </h4>
        {travel.travellerNames.map((tr, index) => (
          <p
            key={index}
            className="bg-gray-100 px-3 py-1 rounded-md text-gray-800 text-sm mb-1"
          >
            {tr}
          </p>
        ))}
      </div>

      <p className="text-xs text-gray-500 mb-1">
        Created by: {travel.createdByName}
      </p>

      <p
        className={`text-sm font-semibold ${
          travel.status === Statuses.APPROVED
            ? "text-green-600"
            : travel.status === Statuses.PENDING
              ? "text-yellow-600"
              : "text-red-600"
        }`}
      >
        {travel.status}
      </p>
    </div>
  );
};

export default TravelCard;
