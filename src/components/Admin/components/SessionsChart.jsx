import { getClassesByStatusAndMonth } from "@/data/api";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState, useMemo } from "react";

const getCurrentYear = () => new Date().getFullYear();

// const optionsStatus = ["completed", "cancelled", "active", "ongoing"];

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

  const convertResToPieChartData = (res) => {
    const statusMapping = {
      COMPLETED: { label: "Completed", color: "#4caf50" }, // Green
      ACTIVE: { label: "Active", color: "#2196f3" }, // Blue
      CANCELED: { label: "Cancelled", color: "#f44336" }, // Red
      ONGOING: { label: "Ongoing", color: "#9c27b0" }, // Purple
      PENDING: { label: "Pending", color: "#ffc107" }, // Yellow
    };

    return Object.keys(res).map((status, index) => {
      const totalValue = Object.values(res[status]).reduce(
        (sum, value) => sum + value,
        0
      );
      const { label, color } = statusMapping[status] || {
        label: "Unknown",
        color: "#757575", // Grey for unexpected statuses
      };

      return {
        id: index,
        value: totalValue,
        label: label,
        color: color,
      };
    });
  };

  const getActiveClasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getClassesByStatusAndMonth(selectedYear, token);
      console.log(res);
      const pieChartData = convertResToPieChartData(res);
      setDataClasses(pieChartData);
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
  }, [token, selectedYear]);

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
        {/* <FormControl size="small">
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
        </FormControl> */}
      </Box>
      <Box sx={useStyles.chartContainer}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <PieChart
            series={[
              {
                data: [...dataClasses],
              },
            ]}
            width={400}
            height={200}
            sx={{
              "& .MuiPieChart-sector": {
                color: (datum) => datum.color, // Use the color from the data
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}
