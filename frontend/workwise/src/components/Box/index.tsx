import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

interface InputBoxProps {
    fetchData: () => Promise<void>;
}

export default function InputBox({ fetchData }: InputBoxProps) {
    const [numberOfSeats, setNumberOfSeats] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);

    const handleBookSeats = async () => {
        if (typeof numberOfSeats !== 'number' || numberOfSeats <= 0 || numberOfSeats > 7) {
            toast.warning("Enter a valid number of seats (1-7)");
            
            return;
        }

        setLoading(true);
        try {
            await axios.post("http://localhost:3000/api/v1/seat/book", {
                numOfSeats: numberOfSeats,
            },  {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                }

            });
            await fetchData(); // Ensure we wait for data refresh
            toast.success('Seats booked successfully!');
     
        } catch (error: any) {
            console.error('Error booking seats:', error);
            toast.error(error.response?.data?.message || 'Error booking seats');
        } finally {
            setLoading(false);
        }
    };

    const handleResetBooking = async () => {
        setLoading(true);
        try {
            await axios.post("http://localhost:3000/api/v1/seat/reset", {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                }
            });
            await fetchData(); // Ensure we wait for data refresh
            toast.success('Bookings reset successfully!');
            
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Error resetting bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 3000); // Fetch data every 3 seconds
        return () => clearInterval(interval);
    }, []);
    

    return (
        <div className="flex flex-col items-start gap-4 w-1/4">
            <div className="flex flex-col gap-2 w-full">
                <label className="font-semibold text-gray-900">Book Seats</label>
                <input
                    type="number"
                    value={numberOfSeats}
                    onChange={e => setNumberOfSeats(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2 border rounded-md text-gray-900"
                    placeholder="Enter number of seats"
                    disabled={loading}
                />
                <button
                    onClick={handleBookSeats}
                    className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? 'Booking...' : 'Book'}
                </button>
            </div>

            <button
                onClick={handleResetBooking}
                className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={loading}
            >
                {loading ? 'Resetting...' : 'Reset Booking'}
            </button>
            <ToastContainer />
        </div>
    );
}
