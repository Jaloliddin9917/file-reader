import React, { useState } from 'react';
import MaterialTable from 'material-table';

// import IconButton from '@mui/material/IconButton';
// import PhotoCamera from '@mui/icons-material/PhotoCamera';
// import Stack from '@mui/material/Stack';
import XLSX from 'xlsx'
import { Button, IconButton } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';

const EXTENSIONS = ['xlsx', 'xls', 'csv']
function ExcelReader() {
  const [colDefs, setColDefs] = useState<any>()
  const [data, setData] = useState<any>()

  const getExention = (file: any) => {
    const parts = file.name.split('.')
    const extension = parts[parts.length - 1]
    return EXTENSIONS.includes(extension)
  }

  const convertToJson = (headers: any, data: any) => {
    const rows: any = []
    data.forEach((row: any) => {
      let rowData: any = {}
      row.forEach((element: any, index: any) => {
        rowData[headers[index]] = element
      })
      rows.push(rowData)

    });
    return rows
  }

  const importExcel = (e: any) => {
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.onload = (event: any) => {

      const bstr = event.target.result
      const workBook = XLSX.read(bstr, { type: "binary" })

      const workSheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[workSheetName]

      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })

      const headers: any = fileData[0]
      const heads = headers.map((head: any) => ({ title: head, field: head }))
      setColDefs(heads)

      fileData.splice(0, 1)


      setData(convertToJson(headers, fileData))
    }

    if (file) {
      if (getExention(file)) {
        reader.readAsBinaryString(file)
      }
      else {
        alert("Invalid file input, Select Excel, CSV file")
      }
    } else {
      setData([])
      setColDefs([])
    }
  }

  return (
    <div className="App">
      <h1>React-App</h1>
      <h4>Import Data from Excel, CSV in Table</h4>
      {/* <input type="file" onChange={importExcel} /> */}

      <Button variant="contained" component="label">
        Upload
        <input hidden  multiple type="file" onChange={importExcel}/>
      </Button>
      <IconButton color="primary" aria-label="upload picture" component="label">
        <input hidden  type="file" onChange={importExcel}/>
        <PhotoCamera />
      </IconButton>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <MaterialTable style={{ width: "80%" }} title=" Data" data={data} columns={colDefs} />
      </div>
    </div>
  );
}

export default ExcelReader;
