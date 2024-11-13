import {  getTotalOrdersAndAmount } from '@/data/api';
import { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import { ChevronRight } from 'lucide-react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};



const TotalOrdersAmountDetails = () => {
  const [open, setOpen] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dateMin, dateMax]);

  const handleDateChangeMin = (e) => setDateMin(e.target.value);
  const handleDateChangeMax = (e) => setDateMax(e.target.value);
  const handleClose = () => setOpen(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className='w-full flex items-center justify-between'>
        view details
        <ChevronRight />
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateMin || ''}
              onChange={handleDateChangeMin}
              required
              className="border px-2 py-1 rounded w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
            <span className="font-semibold text-base uppercase text-center">to</span>
            <input
              type="date"
              value={dateMax || ''}
              onChange={handleDateChangeMax}
              required
              className="border px-2 py-1 rounded w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div>

          </div>
          <div className="*:text-blue-800 text-xl pt-2 ">
            <div>
              <span className="font-semibold">Amount: </span>
              <span>{amount}</span>
            </div>
            <div>
              <span className="font-semibold">Total price: </span>
              <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)} VNĐ</span>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  )
}




export default function TotalOrdersAmount() {
  return (
    <div className=" h-full w-full bg-blue-600 *:text-white shadow-lg py-2 rounded-lg px-4">
      <h1 className="font-semibold text-xl pb-4 tracking-wider h-[75%]">Total Orders And Amount</h1>
      <TotalOrdersAmountDetails />
    </div>
  );
}
