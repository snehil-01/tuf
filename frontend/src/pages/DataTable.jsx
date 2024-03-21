import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";

// const rows = [
//     { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
//     { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
//     { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
//     { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
//     { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
//     { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
//     { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
//     { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
//     { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
//   ];

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "username", headerName: "USERNAME", width: 130 },
  { field: "code_language", headerName: "CODE LANG", width: 130 },
  {
    field: "stdin",
    headerName: "INPUT",
    width: 90,
  },
  {
    field: "source_code",
    headerName: "SRC CODE",
    width: 160,
    // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
  {
    field: "timestamp",
    headerName: "TIMESTAMPS",
    width: 160,
    // valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];



export default function DataTable() {
    const [rows,setRows] = useState([])

  useEffect(() => {
    axios
      .get(`http://localhost:5050/all?page=8&limit=5`)
      .then((res) => {
        console.log(res.data)
        setRows(res.data)
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 1, pageSize: 5 },
          },
        }}
      />
    </div>
  );
}
