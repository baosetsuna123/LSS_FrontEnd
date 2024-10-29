import React, { useState, useEffect } from "react";

const getWeekDateRange = (weekNumber) => {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const daysOffset = (weekNumber - 1) * 7;
  const startOfWeek = new Date(startOfYear.setDate(startOfYear.getDate() + daysOffset));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const options = { day: "numeric", month: "numeric", year: "numeric" };
  return `${startOfWeek.toLocaleDateString(undefined, options)} - ${endOfWeek.toLocaleDateString(undefined, options)}`;
};

const getCurrentWeekNumber = () => {
  const startOfYear = new Date(new Date().getFullYear(), 0, 1);
  const today = new Date();
  const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  return Math.ceil(dayOfYear / 7);
};

const WeekSelector = ({ onWeekChange }) => {
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekNumber());

  useEffect(() => {
    const weekRange = getWeekDateRange(selectedWeek);
    onWeekChange(selectedWeek, weekRange);
  }, [selectedWeek]);

  const handleWeekChange = (e) => {
    setSelectedWeek(parseInt(e.target.value));
  };

  return (
    <div className="mb-4">
      <label className="text-gray-700">Chọn tuần:</label>
      <select
        value={selectedWeek}
        onChange={handleWeekChange}
        className="border p-2 ml-2 rounded border-gray-300"
      >
        {Array.from({ length: 52 }, (_, i) => (
          <option key={i} value={i + 1}>Tuần {i + 1}</option>
        ))}
      </select>

      <input
        type="text"
        value={getWeekDateRange(selectedWeek)}
        readOnly
        className="border p-2 ml-2 mt-2 rounded border-gray-300"
      />
    </div>
  );
};

export default WeekSelector;
