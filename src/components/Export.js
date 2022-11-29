import React from 'react'
//import Button from '../shared/Button'
//import data from '../constants/sampleMovieData'
import DataTable from 'react-data-table-component'
import { CButton } from '@coreui/react'

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function convertArrayOfObjectsToCSV(array) {
  let result

  const columnDelimiter = ','
  const lineDelimiter = '\n'
  const keys = Object.keys(array[0])

  result = ''
  result += keys.join(columnDelimiter)
  result += lineDelimiter

  array.forEach((item) => {
    let ctr = 0
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter

      result += item[key]
      // eslint-disable-next-line no-plusplus
      ctr++
    })
    result += lineDelimiter
  })

  return result
}

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function downloadCSV(array) {
  const link = document.createElement('a')
  let csv = convertArrayOfObjectsToCSV(array)
  if (csv == null) return

  const filename = 'export.csv'

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`
  }

  link.setAttribute('href', encodeURI(csv))
  link.setAttribute('download', filename)
  link.click()
}

// eslint-disable-next-line react/prop-types
const Export = ({ onExport }) => <CButton onClick={(e) => onExport(e.target.value)}>Export</CButton>

// const columns = [
//   {
//     name: 'Title',
//     selector: (row) => row.title,
//     sortable: true,
//   },
//   {
//     name: 'Director',
//     selector: (row) => row.director,
//     sortable: true,
//   },
//   {
//     name: 'Year',
//     selector: (row) => row.year,
//     sortable: true,
//   },
// ]

// eslint-disable-next-line react/prop-types
export const ExportCSV = ({ datos, columns }) => {
  const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV(datos)} />, [])

  return <DataTable title="Movie List" columns={columns} data={datos} actions={actionsMemo} />
}

export default {
  title: 'Examples/Export CSV',
  component: ExportCSV,
}
