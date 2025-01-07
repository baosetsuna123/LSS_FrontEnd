import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Chip, Modal, Button } from "@mui/material";
import { joinClassTeacher } from "@/data/api";
import toast from "react-hot-toast";

const ModalRegisterClass = ({ data, open, handleClose, fetchTimetable }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const isRowSelectable = (params) => {
    const newRowDateSlots = params.row.dateSlots;
    for (const selectedRowId of selectedRows) {
      if (selectedRowId === params.row.classId) {
        continue;
      }
      const selectedRow = data.find((item) => item.classId === selectedRowId);

      if (!selectedRow) {
        continue;
      }
      for (const { date, slotIds } of newRowDateSlots) {
        for (const slotId of slotIds) {
          const conflictExists = selectedRow.dateSlots.some(
            (slot) => slot.date === date && slot.slotIds.includes(slotId)
          );

          if (conflictExists) {
            return false; // Row is not selectable
          }
        }
      }
    }

    return true; // Row is selectable
  };

  const handleRowSelection = (newSelectedRowIds) => {
    // Filter new row IDs by checking if each is selectable
    const validRowIds = newSelectedRowIds.filter((rowId) => {
      const row = data.find((item) => item.classId === rowId);
      if (!row) {
        return false;
      }

      const selectable = isRowSelectable({ row });
      if (!selectable) {
        toast.error(`Cannot select row ${rowId} due to conflicts.`);
      }
      return selectable;
    });

    setSelectedRows(validRowIds); // Only update with valid rows
  };

  const handleCloseRegister = () => {
    handleClose();
    setSelectedRows([]); // Clear selected rows
  };

  const handleSave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (selectedRows.length === 0) {
        toast.error("please select at least one class");
        return;
      }
      setLoading(true);
      await Promise.all(
        selectedRows.map(async (row) => {
          const res = await joinClassTeacher(token, row);
          return res;
        })
      );
      toast.success("You have registered the class successfully!");
      handleCloseRegister();
      fetchTimetable();
    } catch {
      toast.error(
        "Teacher already has a class scheduled on the same date and slot."
      );
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      field: "classId",
      headerName: "Class ID",
      width: 100,
      headerAlign: "center", // Center-align header
      align: "center", // Center-align content
    },
    {
      field: "name",
      headerName: "Class Name",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "courseCode",
      headerName: "Course Code",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "description",
      headerName: "Description",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        // Truncate the description to 30 characters, adding "..." if it exceeds
        const truncatedDescription =
          params.value.length > 30
            ? `${params.value.slice(0, 30)}...`
            : params.value;
        return truncatedDescription;
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Chip
          label={params.value}
          style={{
            backgroundColor: params.value === "PENDING" ? "#f59e0b" : "#10b981",
            color: params.value === "PENDING" ? "#fef08a" : "white",
            fontWeight: "bold",
          }}
        />
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => `${params.value.toLocaleString()} VND`,
    },
    {
      field: "documents",
      headerName: "Documents",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        params.value && params.value.length > 0 ? (
          <div>
            {params.value.map((doc) => (
              <a
                key={doc.id}
                href={doc.filePath}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {doc.title}
              </a>
            ))}
          </div>
        ) : (
          "No documents"
        ),
    },
    {
      field: "dateSlots",
      headerName: "Dates & Slots (Date (Slots))",
      width: 450,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.value && params.value.length > 0) {
          const sortedSlots = params.value.sort((a, b) => {
            const dateComparison = new Date(a.date) - new Date(b.date);
            if (dateComparison !== 0) return dateComparison;
            return a.slotIds[0] - b.slotIds[0];
          });

          return (
            <div
              style={{
                display: "flex", // Use flexbox
                alignItems: "center", // Center content vertically
                justifyContent: "center", // Center content horizontally
                gap: "10px",
                overflowX: "auto",
              }}
            >
              {sortedSlots.map((slot, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "5px",
                    textAlign: "center", // Center-align individual slot content
                  }}
                >
                  {/* Format the date to dd/mm/yyyy */}
                  {new Date(slot.date).toLocaleDateString("en-GB")} (
                  {slot.slotIds.sort((a, b) => a - b).join(", ")})
                </div>
              ))}
            </div>
          );
        }
        return "No slots";
      },
    },
  ];

  return (
    <Modal
      open={open}
      onClose={handleCloseRegister}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        className="p-4 bg-gray-100 rounded-lg shadow"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          className="mb-4 text-lg font-semibold text-gray-700"
        >
          Class List
        </Typography>
        <Box
          className="bg-white rounded-lg shadow-md"
          sx={{
            height: 400,
            width: "100%",
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            checkboxSelection
            isRowSelectable={isRowSelectable}
            onRowSelectionModelChange={handleRowSelection}
            getRowId={(row) => row.classId}
            className="!text-sm *:cursor-pointer"
          />
        </Box>
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleCloseRegister}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            onClick={handleSave}
            sx={{ mt: 2 }}
          >
            {loading ? "Loading..." : "Register"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalRegisterClass;
