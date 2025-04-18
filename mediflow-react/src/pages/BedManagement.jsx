import React, { useState } from "react";
import BedGrid from "../components/bedManagement/Bed_grid";
import BedDetails from "../components/bedManagement/Bed_Details";
import { bedData } from "../data/bedData";

const BedManagement = () => {
  const [selectedBed, setSelectedBed] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(bedData[0].floor);

  // Filter rooms by selected floor
  const floorData = bedData.find((f) => f.floor === selectedFloor);

  return (
    <div>
      <div className="mb-4 flex space-x-2">
        {bedData.map((floor) => (
          <button
            key={floor.floor}
            className={`px-4 py-2 rounded ${selectedFloor === floor.floor ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
            onClick={() => setSelectedFloor(floor.floor)}
          >
            Floor {floor.floor}
          </button>
        ))}
      </div>
      {floorData.rooms.map((room) => (
        <div key={room.roomNumber} className="mb-6">
          <h3 className="text-lg font-semibold mb-2">
            Room {room.roomNumber} ({room.roomType})
          </h3>
          <BedGrid
            beds={room.beds}
            onSelect={setSelectedBed}
            roomType={room.roomType}
          />
        </div>
      ))}
      <div className="mt-8">
        <BedDetails bed={selectedBed} onClose={() => setSelectedBed(null)} onUpdateStatus={() => {}} />
      </div>
    </div>
  );
};

export default BedManagement;
