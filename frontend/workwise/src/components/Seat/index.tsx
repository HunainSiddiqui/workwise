import React from 'react';




interface SeatProps {
    seatNumber: number;
    isBooked: boolean;
}


export default function Seat({ seatNumber, isBooked }: SeatProps) {
  return (
    <div
      className={`flex justify-center items-center w-12 h-12 rounded-lg font-bold text-gray-700 ${
        isBooked ? 'bg-yellow-300' : 'bg-green-500'
      }`}
    >
      {seatNumber}
    </div>
  );
}

