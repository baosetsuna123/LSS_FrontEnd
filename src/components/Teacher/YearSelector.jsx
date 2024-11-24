import { useState, useEffect } from "react";

const getCurrentYear = () => new Date().getFullYear();

const formatDateToYMD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const formatDateToMD = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}`;
};

function resetTimeToStartOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const getWeeksInYear = (year) => {
  const weeks = [];
  let startOfWeek = new Date(year, 0, 1);

  while (startOfWeek.getDay() !== 1) {
    startOfWeek.setDate(startOfWeek.getDate() + 1);
  }

  let weekNumber = 1;
  while (startOfWeek.getFullYear() === year) {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    weeks.push({
      weekNumber,
      start: resetTimeToStartOfDay(startOfWeek),
      end: resetTimeToStartOfDay(endOfWeek),
    });

    startOfWeek.setDate(startOfWeek.getDate() + 7);
    weekNumber++;
  }

  return weeks;
};

const YearWeekSelector = ({ onWeekChange }) => {
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [weeks, setWeeks] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(null);
  useEffect(() => {
    const weeksInYear = getWeeksInYear(selectedYear);
    setWeeks(weeksInYear);

    const currentDate = resetTimeToStartOfDay(new Date());
    const currentWeek = weeksInYear.find(
      (week) => currentDate >= week.start && currentDate <= week.end
    );
    if (!weeksInYear.length) return;
    setSelectedWeek(currentWeek || weeksInYear[0]);
  }, [selectedYear]);

  useEffect(() => {
    if (selectedWeek) {
      const weekRange = `${formatDateToYMD(
        selectedWeek.start
      )} To ${formatDateToYMD(selectedWeek.end)}`;
      onWeekChange(selectedWeek.weekNumber, weekRange);
    }
  }, [selectedWeek]);

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
    setSelectedWeek(null);
  };

  const handleWeekChange = (e) => {
    const week = weeks.find((w) => w.weekNumber === parseInt(e.target.value));
    setSelectedWeek(week);
  };

  return (
    <div className="mb-4">
      <label className="text-gray-700 dark:text-gray-200">Choose year:</label>
      <select
        value={selectedYear}
        onChange={handleYearChange}
        className="border p-2 ml-2 rounded border-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
      >
        {Array.from({ length: 10 }, (_, i) => {
          const year = getCurrentYear() - 3 + i;
          return (
            <option key={year} value={year}>
              {year}
            </option>
          );
        })}
      </select>

      <label className="text-gray-700 ml-4 dark:text-gray-200">
        Choose week:
      </label>
      <select
        value={selectedWeek?.weekNumber || ""}
        onChange={handleWeekChange}
        className="border p-2 ml-2 rounded border-gray-300 px-3 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
      >
        {weeks.map((week) => (
          <option key={week.weekNumber} value={week.weekNumber}>
            {formatDateToMD(week.start)} To {formatDateToMD(week.end)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearWeekSelector;
