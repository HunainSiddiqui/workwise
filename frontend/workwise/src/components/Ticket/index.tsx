import React from 'react';
import Seat from '../Seat';

interface SeatData {
    id: number;
    seat_number: number;
    isavailable: boolean;
    row: number;
    userId: number;
}

interface CompartmentProps {
    loading: boolean;
    data: SeatData[];
}

export default function Compartment({ loading, data }: CompartmentProps) {
    const booked = data.filter((item: SeatData) => !item.isavailable).length;
    const available = data.filter((item: SeatData) => item.isavailable).length;

    return (
        <div className="flex flex-col items-center gap-4 w-3/5">
            {loading ? (
                <h2 className="text-lg font-semibold text-center">Please Wait...</h2>
            ) : (
                <h2 className="text-lg font-semibold text-center">Ticket Booking</h2>
            )}

            <div className="grid grid-cols-7 gap-2 bg-white p-4 rounded-lg shadow-md">
                {data.map((item: SeatData,index) => (
                    <Seat
                        key={item.id}
                        seatNumber={index + 1} 
                        isBooked={!item.isavailable}
                    />
                ))}
            </div>

            <div className="flex justify-between w-full text-gray-700 font-bold">
                <div className="w-1/2 text-center bg-yellow-300 p-2 rounded-md">
                    Booked Seats = {booked}
                </div>
                <div className="w-1/2 text-center bg-green-500 p-2 rounded-md">
                    Available Seats = {available}
                </div>
            </div>
        </div>
    );
}
