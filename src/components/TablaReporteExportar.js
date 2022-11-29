import React from 'react'
import DataTable from 'react-data-table-component'
//import { nanoid } from 'nanoid'
import Axios from 'axios'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilFilterX, cilList } from '@coreui/icons'

import PropTypes from 'prop-types'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

Text.PropTypes = {
  columns: PropTypes.node.isRequired,
  filas: PropTypes.node.isRequired,
}

let data = []
let dataExpansionInterna = []

//ESTILOS Y CONFIGURACIONES GLOBALES
// eslint-disable-next-line react/prop-types
const ExpandedComponent = ({ data }) => <pre>{JSON.stringify(dataExpansionInterna, null, 2)}</pre>

const paginacionOpciones = {
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
  selectAllRowsItemText: 'Todos',
}

//BOTON DESCARGA
function convertArrayOfObjectsToCSV(array) {
  let result

  const columnDelimiter = ';'
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

      result += item[key]
      // eslint-disable-next-line no-plusplus
      ctr++
    })
    result += lineDelimiter
  })

  return result
}

function downloadCSV(array, tituloReporte) {
  const link = document.createElement('a')
  let csv = convertArrayOfObjectsToCSV(array)
  if (csv == null) return

  const filename = 'Export ' + tituloReporte + '.csv'

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`
  }

  link.setAttribute('href', encodeURI(csv))
  link.setAttribute('download', filename)
  link.click()
}

// eslint-disable-next-line react/prop-types
const Export = ({ onExport }) => (
  <CButton color="dark" onClick={(e) => onExport(e.target.value)}>
    <CIcon icon={cilCloudDownload} /> Exportar
  </CButton>
)

// eslint-disable-next-line react/prop-types
const TablaReporteExportar = ({
  // eslint-disable-next-line react/prop-types
  tituloTabla = 'Listado',
  // eslint-disable-next-line react/prop-types
  columns = [],
  // eslint-disable-next-line react/prop-types
  filas = [],
  // eslint-disable-next-line react/prop-types
  expandible = false,
  // eslint-disable-next-line react/prop-types
  dataExpansion = [],
  // eslint-disable-next-line react/prop-types
  botonReporte = false,
}) => {
  const actionsMemo = React.useMemo(
    () => <Export onExport={() => downloadCSV(filas, tituloTabla)} />,
    [],
  )

  data = filas
  dataExpansionInterna = dataExpansion
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mt-1">
            <CCardHeader className="text-primaryy text-uppercase">
              <CIcon icon={cilList} size="xl" />
              <small hidden>Listado</small>
              <strong> {tituloTabla}</strong>
            </CCardHeader>
            <CCardBody>
              {filas.length > 0 ? (
                <>
                  {/* <CRow className="mt-2 mb-3">
                    <CFormLabel className="col col-form-label fw-bold text-uppercase">
                      Item por página
                    </CFormLabel>
                    <CCol md={2}>
                      <CFormSelect id="itemTabla" className={'form-control border-dark'} disabled>
                        <option key="servicio_0" value={10}>
                          10 Registros
                        </option>
                        <option key="servicio_100" value={15}>
                          15 Registros
                        </option>
                        <option key="servicio_101" value={20}>
                          20 Registros
                        </option>
                      </CFormSelect>
                    </CCol>
                    <CFormLabel
                      htmlFor="inputEmail3"
                      className="col-1 col-form-label fw-bold text-uppercase"
                    >
                      Filtro
                    </CFormLabel>
                    <CCol md={5}>
                      <CFormInput
                        type="text"
                        id="textSearch"
                        className="form-control border-dark"
                        disabled
                      />
                    </CCol>
                    <CCol>
                      <CButton color="warning" variant="ghost" className="m-0" disabled>
                        <CIcon className="text-dark fw-bold" icon={cilFilterX} />
                      </CButton>
                    </CCol>
                  </CRow> */}
                  {/* responsive bordered */}
                  <DataTable
                    title=""
                    columns={columns}
                    data={filas}
                    pagination
                    // paginationResetDefaultPage={resetPaginationToggle}
                    responsive
                    striped={true}
                    pointerOnHover={true}
                    noDataComponent={'No hay información para visualizar'}
                    paginationComponentOptions={paginacionOpciones}
                    expandableRows={expandible}
                    expandableRowsComponent={ExpandedComponent}
                    // subHeader
                    // subHeaderComponent={subHeaderComponentMemo}
                    actions={botonReporte ? actionsMemo : ''}
                  />
                </>
              ) : (
                <CAlert color="secondary" height="450px">
                  Sin información para visualizar
                </CAlert>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <ToastContainer position="bottom-center" autoClose={1000} />
      </CRow>
    </>
  )
}

export default TablaReporteExportar

// export default {
//   title: 'Examples/Export CSV',
//   component: TablaReporteExportar,
// }
