// Example: bedData.js
export const bedData = [
    {
      floor: 1,
      rooms: [
        {
          roomNumber: "101",
          roomType: "ICU", // or "General", "Isolation", "HDU", etc.
          beds: [
            {
              bedId: "ICU-101-1",
              label: "Bed 1",
              bedType: "Ventilator", // or "Standard", "Non-Invasive Ventilator"
              status: "available", // or "occupied", "maintenance", "reserved"
              patientName: null,
              lastCleaned: "2025-04-18 10:00",
            },
            {
              bedId: "ICU-101-2",
              label: "Bed 2",
              bedType: "Standard",
              status: "occupied",
              patientName: "John Doe",
              lastCleaned: "2025-04-18 09:00",
            },
            // more beds...
          ],
        },
        // more rooms...
      ],
    },
    // more floors...
  ];
  