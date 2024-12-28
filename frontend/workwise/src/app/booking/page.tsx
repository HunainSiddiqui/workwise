"use client";
import React, { useEffect, useState } from 'react';
import Compartment from '../../components/Ticket';
import InputBox from '../../components/Box';
import axios from 'axios';


function Booking() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch seat data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://workwise-backend-hunain.onrender.com/api/v1/seat/seats",{
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });
      setData(response.data.data); // Use the correct path based on your API response
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-around items-center h-screen bg-gray-100">
      <Compartment data={data} loading={loading} />
      <InputBox fetchData={fetchData} />
    </div>
  );
}

export default Booking;
