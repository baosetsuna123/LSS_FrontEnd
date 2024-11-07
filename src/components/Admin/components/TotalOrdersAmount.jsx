import { getTotalOrdersAndAmount } from '@/data/api';
import { useEffect, useState } from 'react';

export default function TotalOrdersAmount() {
  const [dateMin, setDateMin] = useState(null);
  const [dateMax, setDateMax] = useState(null);
  const [amount, setAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  
  const result = localStorage.getItem("result");
  let token;
  if (result) {
    try {
      const parsedResult = JSON.parse(result);
      token = parsedResult.token;
    } catch (error) {
      console.error("Error parsing result from localStorage:", error);
    }
  }

  useEffect(() => {
    const currentDate = new Date();
    const maxDate = currentDate.toISOString().split('T')[0];
    const minDate = new Date(currentDate);
    minDate.setDate(currentDate.getDate() - 3);
    const formattedMinDate = minDate.toISOString().split('T')[0];
    setDateMin(formattedMinDate);
    setDateMax(maxDate);
  }, []);

  const convertDateToDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T00:00:00`;
  };

  const getTotalOrdersAmount = async () => {
    try {
      if (!dateMin || !dateMax || !token) return; 

      const dateStart = convertDateToDateTime(dateMin);
      const dateEnd = convertDateToDateTime(dateMax);
      
      const res = await getTotalOrdersAndAmount(dateStart, dateEnd, token);
      
      setAmount(res.amount || 0);
      setTotalPrice(res.totalPrice || 0);
    } catch (error) {
      console.error("Failed to fetch total orders and amount:", error);
    }
  };

  useEffect(() => {
    getTotalOrdersAmount();
  }, [token, dateMin, dateMax]);

  const handleDateChangeMin = (e) => setDateMin(e.target.value);
  const handleDateChangeMax = (e) => setDateMax(e.target.value);

  return (
    <div className="flex flex-col justify-center items-center w-full bg-white shadow-lg py-10 rounded-lg px-4">
      <h1 className="font-semibold text-xl pb-4 tracking-wider uppercase text-center">Total Orders And Amount</h1>
      <div className="flex items-center gap-2 py-3">
        <input
          type="date"
          value={dateMin || ''}
          onChange={handleDateChangeMin}
          required
          className="border p-2 rounded w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
        <span className="font-semibold text-base uppercase text-center">to</span>
        <input
          type="date"
          value={dateMax || ''}
          onChange={handleDateChangeMax}
          required
          className="border p-2 rounded w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />
      </div>
      <div className="flex flex-col items-center  *:text-blue-800 gap-6 text-2xl">
        <div>
          <span className="font-semibold">Amount: </span>
          <span>{amount}</span>
        </div>
        <div>
          <span className="font-semibold">Total price: </span>
          <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)} VNĐ</span>
        </div>
      </div>
    </div>
  );
}
