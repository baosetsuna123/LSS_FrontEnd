import {
  getActiveClassesByMonth,
  getCancelClassesByMonth,
  getCompletedClassesByMonth,
  getOngoingClassesByMonth,
} from "@/data/api";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState, useMemo } from "react";

const getCurrentYear = () => new Date().getFullYear();

const optionsStatus = ["completed", "cancelled", "active", "ongoing"];

const useStyles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "500px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
    borderRadius: "0.5rem",
    padding: "1rem",
    transition: "all 0.3s ease",
  },
  title: {
    fontWeight: 600,
    fontSize: "1.5rem",
    paddingBottom: "1rem",
    letterSpacing: "0.05em",
    textAlign: "center",
    color: "#333",
  },
  formContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "1rem",
  },
  select: {
    minWidth: "120px",
    backgroundColor: "white",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e0e0e0",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#b0b0b0",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3f51b5",
    },
  },
  chartContainer: {
    width: "100%",
    height: "320px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default function SessionsChart() {
  const [dataClasses, setDataClasses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(optionsStatus[0]);
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = useMemo(() => {
    const result = localStorage.getItem("result");
    if (result) {
      try {
        const parsedResult = JSON.parse(result);
        return parsedResult.token;
      } catch (error) {
        console.error("Error parsing result from localStorage:", error);
        return null;
      }
    }
    return null;
  }, []);

  const convertDataWithDefault = (input) => {
    const result = [];

    const monthNames = [
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

    for (let month = 1; month <= 12; month++) {
      const monthKey = `${selectedYear}-${month.toString().padStart(2, "0")}`;
      result.push({
        month: monthNames[month - 1],
        value: input[monthKey] || 0,
      });
    }

    return result;
  };

  const getActiveClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      switch (selectedStatus) {
        case "active":
          res = await getActiveClassesByMonth(selectedYear, token);
          break;
        case "ongoing":
          res = await getOngoingClassesByMonth(selectedYear, token);
          break;
        case "completed":
          res = await getCompletedClassesByMonth(selectedYear, token);
          break;
        case "cancelled":
          res = await getCancelClassesByMonth(selectedYear, token);
          break;
      }
      setDataClasses(convertDataWithDefault(res));
    } catch (error) {
      console.error(error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getActiveClasses();
    }
  }, [token, selectedStatus, selectedYear]);

  const handleChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleChangeYear = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <Box sx={useStyles.container}>
      <Typography variant="h2" sx={useStyles.title}>
        Review Sessions Chart
      </Typography>
      <Box sx={useStyles.formContainer}>
        <FormControl size="small">
          <InputLabel id="year-select-label">Year</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            label="Year"
            onChange={handleChangeYear}
            value={selectedYear}
            sx={useStyles.select}
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
        <FormControl size="small">
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            label="Status"
            onChange={handleChange}
            value={selectedStatus}
            sx={useStyles.select}
          >
            {optionsStatus.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={useStyles.chartContainer}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <LineChart
            xAxis={[
              {
                scaleType: "point",
                data: [...dataClasses.map((item) => item.month)],
              },
            ]}
            series={[
              {
                data: [...dataClasses.map((item) => item.value)],
                label: "Number of review sessions",
                area: true,
                curve: "natural",
              },
            ]}
            width={750}
            height={320}
            sx={{
              ".MuiLineElement-root": {
                stroke: "#3f51b5",
                strokeWidth: 3,
              },
              ".MuiAreaElement-root": {
                fill: "url(#gradient)",
              },
            }}
          >
            <defs>
              <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#3f51b5" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3f51b5" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </LineChart>
        )}
      </Box>
    </Box>
  );
}
