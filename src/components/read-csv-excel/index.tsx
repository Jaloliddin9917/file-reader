import React, { useState } from 'react';
import MaterialTable from 'material-table'
import XLSX from 'xlsx'

const EXTENSIONS = ['xlsx', 'xls', 'csv']
function ExcelReader() {
  const [colDefs, setColDefs] = useState<any>()
  const [data, setData] = useState<any>()

  const getExention = (file: any) => {
    const parts = file.name.split('.')
    const extension = parts[parts.length - 1]
    return EXTENSIONS.includes(extension) // return boolean
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
      //parse data

      const bstr = event.target.result
      const workBook = XLSX.read(bstr, { type: "binary" })

      //get first sheet
      const workSheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[workSheetName]
      //convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })
      // console.log(fileData)
      const headers: any = fileData[0]
      const heads = headers.map((head: any) => ({ title: head, field: head }))
      setColDefs(heads)

      //removing header
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
      <input type="file" onChange={importExcel} />
      <div style={{width: "80%"}}>
        <MaterialTable title=" Data" data={data} columns={colDefs} />
      </div>
    </div>
  );
}

export default ExcelReader;
