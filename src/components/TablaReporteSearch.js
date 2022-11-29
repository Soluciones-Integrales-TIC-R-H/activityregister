import React from 'react'
//import data from '../constants/sampleMovieData'
import DataTable from 'react-data-table-component'

import { CButton, CFormInput } from '@coreui/react'

import CIcon from '@coreui/icons-react'

import PropTypes from 'prop-types'
import { cilFilterX } from '@coreui/icons'

Text.PropTypes = {
  columns: PropTypes.node.isRequired,
  filas: PropTypes.node.isRequired,
}

let data = []

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
    <CButton onClick={onClear}>
      <CIcon className="text-dark fw-bold" icon={cilFilterX} />
    </CButton>
  </>
)

// eslint-disable-next-line react/prop-types
export const Filtering = ({ columns, filas }) => {
  const [filterText, setFilterText] = React.useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false)
  const filteredItems = data.filter(
    (item) => item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase()),
  )

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
  data = filas
  return (
    <DataTable
      title=""
      columns={columns}
      data={filteredItems}
      pagination
      paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
      subHeader
      subHeaderComponent={subHeaderComponentMemo}
      selectableRows
      persistTableHead
    />
  )
}

export default {
  title: 'Examples/Filtering',
  component: Filtering,
}
