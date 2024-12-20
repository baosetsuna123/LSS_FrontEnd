import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { getSystemWalletTransactionHistory } from "@/data/api";
import { useEffect, useState } from "react";
import { Input } from "@mui/material";

export default function TransactionHistory() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
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

  const getSystemWalletTransactionHistorys = async () => {
    try {
      const res = await getSystemWalletTransactionHistory(token);
      const sortedData = res.sort(
        (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
      );
      setData(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSystemWalletTransactionHistorys();
  }, [token]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredData = data.filter((row) =>
    row.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const formatTransactionDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 7);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };
  return (
    <div className="col-span-2 min-h-[500px]">
      <div className="flex flex-col justify-center h-full items-center w-full bg-white shadow-lg py-2 rounded-lg px-8">
        <h1 className="font-semibold text-xl pb-4 tracking-wider text-center">
          Transaction History
        </h1>
        <Input
          label="Search by Username"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="search by username"
          className="my-4 w-full max-w-xs "
        />
        <div className="my-2">
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 750 }}
              aria-label="transaction history table"
            >
              <TableHead>
                <TableRow>
                  <TableCell>Transaction Amount</TableCell>
                  <TableCell>Transaction Date</TableCell>
                  <TableCell>Balance After Transaction</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {Math.abs(row.transactionAmount).toLocaleString()} VND
                    </TableCell>

                    <TableCell>
                      {formatTransactionDate(row.transactionDate)}
                    </TableCell>
                    <TableCell>
                      {row.balanceAfterTransaction.toLocaleString()} VND
                    </TableCell>
                    <TableCell>{row.username}</TableCell>
                    <TableCell>{row.note || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </div>
      </div>
    </div>
  );
}
