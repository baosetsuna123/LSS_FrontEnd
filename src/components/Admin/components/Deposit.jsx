import { getDepositsByMonth } from "@/data/api";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";

const xLabels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getCurrentYear = () => new Date().getFullYear();

export default function Deposit() {
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [chartData, setChartData] = useState({
    totalBalance: [],
    totalExpenses: [],
    totalIncome: [],
    totalOrders: [], // New bar data for Total Orders
  });

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

  const getTotal = async () => {
    try {
      const datas = await getDepositsByMonth(selectedYear, token);
      console.log(datas);
      const completeData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        totalBalance: 0,
        totalExpenses: 0,
        totalIncome: 0,
        totalOrders: 0, // Default value for Total Orders
      }));

      datas.forEach((item) => {
        const monthIndex = item.month - 1;
        completeData[monthIndex] = {
          ...completeData[monthIndex],
          ...item,
        };
      });
      const totalBalanceData = completeData.map((item) => item.totalBalance);
      const totalExpensesData = completeData.map((item) => item.totalExpenses);
      const totalIncomeData = completeData.map((item) => item.totalIncome);
      const totalOrdersData = completeData.map((item) => item.totalOrders); // Extract Total Orders

      setChartData({
        totalBalance: totalBalanceData,
        totalExpenses: totalExpensesData,
        totalIncome: totalIncomeData,
        totalOrders: totalOrdersData, // Set Total Orders data
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedYear]);

  const handleChangeYear = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <div className="col-span-2 min-h-[500px]">
      <div className="flex flex-col justify-center h-full items-center w-full bg-white shadow-lg py-2 rounded-lg ">
        <h1 className="font-semibold text-xl pb-4 tracking-wider text-center">
          Review Deposit Chart
        </h1>
        <div>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Year</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              label="Year"
              onChange={handleChangeYear}
              value={selectedYear}
              className="bg-white"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = getCurrentYear() - 3 + i;
                return (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <BarChart
          width={1000}
          height={500}
          series={[
            {
              data: chartData.totalBalance,
              label: "Total Balance",
              id: "totalBalanceId",
            },
            {
              data: chartData.totalExpenses,
              label: "Total Refunded",
              id: "totalExpensesId",
            },
            {
              data: chartData.totalIncome,
              label: "Total Deposit",
              id: "totalIncomeId",
            },
            {
              data: chartData.totalOrders,
              label: "Total Orders",
              id: "totalOrdersId",
            },
          ]}
          xAxis={[{ data: xLabels, scaleType: "band" }]}
        />
      </div>
    </div>
  );
}
