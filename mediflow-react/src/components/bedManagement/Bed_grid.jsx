import React from "react";

const bedTypeIcons = {
  Ventilator: "fas fa-lungs",
  "Non-Invasive Ventilator": "fas fa-wind",
  Standard: "fas fa-bed",
};

const statusColors = {
  available: "bg-green-600",
  occupied: "bg-red-600",
  maintenance: "bg-amber-500",
  reserved: "bg-blue-500",
};

const BedGrid = ({ beds, onSelect, roomType }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {beds.map((bed) => (
      <div
        key={bed.bedId}
        className={`rounded-lg shadow-md p-4 flex flex-col items-center cursor-pointer border-2 ${statusColors[bed.status] || "bg-gray-600"} border-opacity-50`}
        onClick={() => onSelect(bed)}
      >
        <div className="text-xl font-bold mb-1 flex items-center gap-2">
          <i className={`${bedTypeIcons[bed.bedType] || "fas fa-bed"} mr-1`}></i>
          {bed.label}
        </div>
        <div className="mb-1 text-xs text-gray-300">{bed.bedType}</div>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[bed.status] || "bg-gray-600"} text-white`}>
          {bed.status.charAt(0).toUpperCase() + bed.status.slice(1)}
        </span>
        {bed.patientName && (
          <div className="mt-2 text-xs text-white bg-gray-800 rounded px-2 py-1">
            <i className="fas fa-user-injured mr-1"></i>
            {bed.patientName}
          </div>
        )}
      </div>
    ))}
  </div>
);

export default BedGrid;
