import React from 'react'
import DataTable, { createTheme } from 'react-data-table-component'
import { CAlert, CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilList } from '@coreui/icons'

import PropTypes, { object } from 'prop-types'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ExportButtonExcel } from './ButtonExcel'
import {
  destroyArray,
  removerCamelCase,
  replaceCharacters,
  upperLetter,
} from 'src/utilities/utilidades'

Text.PropTypes = {
  columns: PropTypes.node.isRequired,
  filas: PropTypes.node.isRequired,
}

let data = []
let dataExpansionInterna = []

//ESTILOS Y CONFIGURACIONES GLOBALES
// data proporcionan acceso a los datos de su fila
// eslint-disable-next-line react/prop-types
const ExpandedComponent2 = ({ data }) => (
  <>
    {console.log(data)}
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </>
)

// eslint-disable-next-line react/prop-types
const ExpandedComponent = ({ data }) => {
  function Saltos(valor) {
    let salida = String(valor)
    if (salida.includes('[')) {
      salida = replaceCharacters(destroyArray(salida), ',', '<br />')
    }
    return salida
  }

  function Table(data) {
    let datos = '<table width="98%">'
    for (const property in data) {
      datos =
        datos +
        '<tr>' +
        '<td class="bg-light text-black p-2 border border-light fw-bold">' +
        upperLetter(removerCamelCase(property)) +
        '</td><td class="bg-white text-black p-2 border border-light w-75">' +
        Saltos(data[property]) +
        '</td></tr>'
    }
    return datos + '</table>'
  }

  return (
    <>
      <div
        className="m-0 row justify-content-center"
        dangerouslySetInnerHTML={{ __html: Table(data) }}
      />
    </>
  )
}

const paginacionOpciones = {
  rowsPerPageText: 'Filas por página',
  rangeSeparatorText: 'de',
  selectAllRowsItem: true,
  selectAllRowsItemText: 'Todos',
}

const customStyles = {
  rows: {
    style: {
      minHeight: '40px', // override the row height
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
    },
  },
}

// createTheme crea un nuevo tema llamado solarized que anula el tema construido en oscuro
createTheme(
  'solarized',
  {
    text: {
      primary: 'black', //#268bd2
      secondary: '#4F5D73',
    },
    background: {
      default: 'white', //#4F5D73
    },
    context: {
      background: '#cb4b16',
      text: '#FFFFFF',
    },
    divider: {
      default: '#FAFAFA', // #DCDCDC
    },
    action: {
      button: 'rgba(0,0,0,.54)',
      hover: 'rgba(42,161,152) !important',
      disabled: 'rgba(0,0,0,.12)',
    },
  },
  'light',
)

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
    csv = `data:text/csv;charset=UTF-8,${csv}`
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
  // eslint-disable-next-line react/prop-types
  defaultSortAsc = true,
  // eslint-disable-next-line react/prop-types
  defaultSortFieldId = 1,
}) => {
  // const actionsMemo = React.useMemo(
  //   () => <Export onExport={() => downloadCSV(filas, tituloTabla)} />,
  //   [filas, tituloTabla],
  // )

  data = filas
  dataExpansionInterna = dataExpansion
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mt-1 border-0">
            <CCardHeader className="bg-primary text-white text-uppercase">
              <CIcon icon={cilList} size="xl" />
              <small hidden>Listado</small>
              <strong> {tituloTabla}</strong>
            </CCardHeader>
            <CCardBody>
              {filas.length > 0 ? (
                <>
                  {/* <button>Hoila</button> */}
                  {/* responsive bordered */}
                  {filas.length > 0 && botonReporte && (
                    <div className="float-right">
                      <ExportButtonExcel data={filas} titleBook={tituloTabla} />
                    </div>
                  )}
                  <DataTable
                    title=""
                    columns={columns}
                    data={filas}
                    pagination
                    // paginationResetDefaultPage={resetPaginationToggle}
                    responsive
                    striped={true}
                    pointerOnHover={true}
                    highlightOnHover={true}
                    noDataComponent={'No hay información para visualizar'}
                    paginationComponentOptions={paginacionOpciones}
                    expandableRows={expandible}
                    expandableRowsComponent={ExpandedComponent}
                    // customStyles={customStyles}
                    theme="solarized"
                    defaultSortAsc={defaultSortAsc}
                    defaultSortFieldId={defaultSortFieldId}
                    // subHeader
                    // subHeaderComponent={subHeaderComponentMemo}
                    // actions={botonReporte ? actionsMemo : ''}
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
