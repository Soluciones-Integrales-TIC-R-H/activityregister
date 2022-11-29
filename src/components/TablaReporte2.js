import React from 'react'
//import data from '../constants/sampleMovieData'
import DataTable from 'react-data-table-component'
import styled from 'styled-components'

import { CButton, CFormInput } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilFilterX } from '@coreui/icons'

import PropTypes from 'prop-types'

Text.PropTypes = {
  columns: PropTypes.node.isRequired,
  filas: PropTypes.node.isRequired,
}

let data = []

// eslint-disable-next-line react/prop-types
const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(data, null, 2)}</pre>

const conditionalRowStyles = [
  {
    when: (row) => row.calories < 300,
    style: {
      backgroundColor: 'green',
      color: 'white',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  // You can also pass a callback to style for additional customization
  {
    when: (row) => row.CodEvento < 400,
    style: (row) => ({ backgroundColor: row.isSpecial ? 'pink' : 'inerit' }),
  },
]

const paginacionOpciones = {
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
  selectAllRowsItemText: 'Todos',
}

//filtro
// eslint-disable-next-line react/prop-types
const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <CFormInput
      id="search"
      type="text"
      placeholder="Filter By Name"
      aria-label="Search Input"
      value={filterText}
      onChange={onFilter}
    />
    <CButton color="warning" variant="ghost" className="m-0" disabled onClick={onClear}>
      <CIcon className="text-dark fw-bold" icon={cilFilterX} />
    </CButton>
  </>
)

// eslint-disable-next-line react-hooks/rules-of-hooks
const [filterText, setFilterText] = React.useState('')
// eslint-disable-next-line react-hooks/rules-of-hooks
const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
const filteredItems = data.filter(
  (item) => item.name && item.name.toLowerCase().includes(filterText.toLowerCase()),
)

// eslint-disable-next-line react-hooks/rules-of-hooks
const subHeaderComponentMemo = React.useMemo(() => {
  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle)
      setFilterText('')
    }
  }

  return (
    <FilterComponent
      onFilter={(e) => setFilterText(e.target.value)}
      onClear={handleClear}
      filterText={filterText}
    />
  )
}, [filterText, resetPaginationToggle])

//Exportar a Excel
// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function convertArrayOfObjectsToCSV(array) {
  let result

  const columnDelimiter = ','
  const lineDelimiter = '\n'
  // eslint-disable-next-line no-undef
  const keys = Object.keys(data[0])

  result = ''
  result += keys.join(columnDelimiter)
  result += lineDelimiter

  array.forEach((item) => {
    let ctr = 0
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter

      result += '' + item[key]
      // eslint-disable-next-line no-plusplus
      ctr++
    })
    result += lineDelimiter
  })

  return result
}

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function downloadCSV2(array) {
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
const Export = ({ onExport }) => (
  <CButton onClick={(e) => onExport(e.target.value)}>
    <CIcon icon={cilCloudDownload} /> Exportar
  </CButton>
)

// eslint-disable-next-line react/prop-types
const ExportCSV2 = ({ columns, filas, botonReporte = false }) => {
  const actionsMemo = React.useMemo(() => <Export onExport={() => downloadCSV2(filas)} />, [])

  data = filas

  return (
    <DataTable
      title=""
      columns={columns}
      data={filas}
      pagination
      paginationResetDefaultPage={resetPaginationToggle}
      responsive
      striped={true}
      pointerOnHover={true}
      noDataComponent={'No hay información para visualizar'}
      paginationComponentOptions={paginacionOpciones}
      expandableRows
      expandableRowsComponent={ExpandedComponent}
      conditionalRowStyles={conditionalRowStyles}
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
      actions={botonReporte ? actionsMemo : ''}
    />
  )
}

export default ExportCSV2

// export default {
//   title: 'Examples/Export CSV',
//   component: ExportCSV,
// }
