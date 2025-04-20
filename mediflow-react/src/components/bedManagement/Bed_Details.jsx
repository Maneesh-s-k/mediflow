import React from "react";
import Button from "../common/Button";

const BedDetails = ({ bed, onStatusChange, onClose }) => {
  const handleStatusChange = (newStatus) => {
    onStatusChange(bed._id, newStatus);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">{bed.bedId}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              bed.status === "Available"
                ? "bg-green-100 text-green-800"
                : bed.status === "Occupied"
                ? "bg-red-100 text-red-800"
                : bed.status === "Maintenance"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {bed.status}
          </span>
        </div>

        <div>
          <span className="font-semibold">Location:</span>
          <div className="ml-2 text-sm">
            <div>Ward: {bed.location.ward}</div>
            <div>Floor: {bed.location.floor}</div>
            <div>Room: {bed.location.room}</div>
            <div>Description: {bed.location.description}</div>
          </div>
        </div>

        {bed.patientId && (
          <div>
            <span className="font-semibold">Patient:</span>
            <div className="ml-2 text-sm">
              <div>ID: {bed.patientId}</div>
              {/* Add more patient details if available */}
            </div>
          </div>
        )}

        <div>
          <span className="font-semibold">Last Cleaned:</span>{" "}
          {bed.lastCleaned
            ? new Date(bed.lastCleaned).toLocaleString()
            : "Not recorded"}
        </div>

        <div className="pt-3 border-t">
          <div className="font-semibold mb-2">Change Status:</div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={bed.status === "Available" ? "primary" : "outline"}
              onClick={() => handleStatusChange("Available")}
              disabled={bed.status === "Available"}
            >
              Available
            </Button>
            <Button
              size="sm"
              variant={bed.status === "Maintenance" ? "primary" : "outline"}
              onClick={() => handleStatusChange("Maintenance")}
              disabled={bed.status === "Maintenance"}
            >
              Maintenance
            </Button>
            <Button
              size="sm"
              variant={bed.status === "Reserved" ? "primary" : "outline"}
              onClick={() => handleStatusChange("Reserved")}
              disabled={bed.status === "Reserved"}
            >
              Reserved
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedDetails;
