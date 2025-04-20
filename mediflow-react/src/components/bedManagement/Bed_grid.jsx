import React from "react";

const BedGrid = ({ beds, onBedSelect }) => {
  // Group beds by room
  const bedsByRoom = beds.reduce((acc, bed) => {
    const room = bed.location.room;
    if (!acc[room]) {
      acc[room] = [];
    }
    acc[room].push(bed);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 border-green-500";
      case "Occupied":
        return "bg-red-100 border-red-500";
      case "Maintenance":
        return "bg-yellow-100 border-yellow-500";
      case "Reserved":
        return "bg-blue-100 border-blue-500";
      default:
        return "bg-gray-100 border-gray-500";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {Object.entries(bedsByRoom).map(([room, roomBeds]) => (
        <div key={room} className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-3">{room}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roomBeds.map((bed) => (
              <div
                key={bed._id}
                className={`border-2 rounded p-3 cursor-pointer ${getStatusColor(bed.status)}`}
                onClick={() => onBedSelect(bed)}
              >
                <div className="font-bold">{bed.bedId}</div>
                <div className="text-sm">{bed.status}</div>
                {bed.patientId && (
                  <div className="text-xs mt-1">Patient assigned</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BedGrid;
