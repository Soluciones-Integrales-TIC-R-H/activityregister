import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { nanoid } from 'nanoid'

import Axios from 'axios'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CPagination,
  CPaginationItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilActionUndo, cilDelete, cilFilterX, cilLineStyle, cilList } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function refreshPage() {
  setTimeout(() => {
    window.location.reload()
  }, 1000)
  console.log('page to reload')
}

const eliminarLogicamente = (url, codigo) => {
  console.log('Eliminando')
  if (url !== '' && codigo !== '') {
    Axios.get(url + '/' + codigo).then((data) => {
      if (data.status === 200) {
        toast.success('Registro inhabilitado')
      } else {
        toast.error('Registro no se pudo inhabilitar')
      }
    })
    refreshPage()
  }
}

const restaurarLogicamente = (url, codigo) => {
  console.log('Restaurando')
  if (url !== '' && codigo !== '') {
    Axios.get(url + '/' + codigo).then((data) => {
      if (data.status === 200) {
        toast.success('Registro habilitado')
      } else {
        toast.error('Registro no se pudo habilitar')
      }
    })
    refreshPage()
  }
}

const TablaReporte = ({
  // eslint-disable-next-line react/prop-types
  columnas = [{ titulo: '', type: '', visible: false }],
  // eslint-disable-next-line react/prop-types
  filas = [],
  // eslint-disable-next-line react/prop-types
  keyPrincipal = '',
  // eslint-disable-next-line react/prop-types
  keyStatus = '',
  // eslint-disable-next-line react/prop-types
  controlStatus = '',
  // eslint-disable-next-line react/prop-types
  nombreTabla = 'tbl',
  // eslint-disable-next-line react/prop-types
  tituloTabla = 'Listado',
  // eslint-disable-next-line react/prop-types
  botonVista = true,
  // eslint-disable-next-line react/prop-types
  urlVista = '',
  // eslint-disable-next-line react/prop-types
  botonEliminarRestaurar = true,
  // eslint-disable-next-line react/prop-types
  urlEliminar = '',
  // eslint-disable-next-line react/prop-types
  urlRestaurar = '',
}) => {
  return (
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
                <CRow className="mt-2 mb-3">
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
                </CRow>
                {/* responsive bordered */}
                <CTable className="table" small striped hover align="middle">
                  <CTableHead className="bg-dark text-white">
                    <CTableRow>
                      <CTableHeaderCell scope="col" hidden>
                        #
                      </CTableHeaderCell>
                      <>
                        {columnas.map((Columna) => (
                          <>
                            <CTableHeaderCell scope="col" hidden={!Columna.visible}>
                              {Columna.titulo}
                            </CTableHeaderCell>
                          </>
                        ))}
                        {botonVista && <CTableHeaderCell scope="col"></CTableHeaderCell>}
                        {botonEliminarRestaurar && (
                          <CTableHeaderCell scope="col"></CTableHeaderCell>
                        )}
                      </>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filas.map((datos, index) => (
                      <CTableRow key={nombreTabla + '_CELLS_' + nanoid()}>
                        <CTableHeaderCell scope="row" hidden>
                          {nanoid()}
                        </CTableHeaderCell>
                        <FilaReporte
                          row={datos}
                          column={columnas}
                          keyPrincipal={keyPrincipal}
                          keyStatus={keyStatus}
                          controlStatus={controlStatus}
                          botonVista={botonVista}
                          urlVista={urlVista}
                          botonEliminarRestaurar={botonEliminarRestaurar}
                          urlEliminar={urlEliminar}
                          urlRestaurar={urlRestaurar}
                          key={nanoid()}
                        />
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <CPagination aria-label="Page navigation example" className="border-dark">
                  <CPaginationItem aria-label="Previous" disabled>
                    <span aria-hidden="true">&laquo;</span>
                  </CPaginationItem>
                  <CPaginationItem active>1</CPaginationItem>
                  <CPaginationItem>2</CPaginationItem>
                  <CPaginationItem>3</CPaginationItem>
                  <CPaginationItem aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                  </CPaginationItem>
                </CPagination>
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
  )
}

const FilaReporte = ({
  // eslint-disable-next-line react/prop-types
  row = [''],
  // eslint-disable-next-line react/prop-types
  column = [''],
  // eslint-disable-next-line react/prop-types
  keyPrincipal,
  // eslint-disable-next-line react/prop-types
  keyStatus,
  // eslint-disable-next-line react/prop-types
  controlStatus,
  // eslint-disable-next-line react/prop-types
  botonVista,
  // eslint-disable-next-line react/prop-types
  urlVista,
  // eslint-disable-next-line react/prop-types
  botonEliminarRestaurar,
  // eslint-disable-next-line react/prop-types
  urlEliminar,
  // eslint-disable-next-line react/prop-types
  urlRestaurar,
}) => {
  const [codDato, setCodDato] = useState('')
  const [statusDato, setStatusDato] = useState('')

  useEffect(() => {
    Object.keys(row).forEach(function callback(value, index) {
      //console.log(`${index}: ${value} => ${row[value]}`)
      if (value === keyPrincipal) {
        //console.log('Soy la key', value)
        setCodDato(row[value])
      }
      if (value === keyStatus) {
        //console.log('Soy el estatus', value)
        setStatusDato(row[value])
      }
    })
  }, [keyPrincipal, keyStatus, row])

  function formaterColumnas(texto, formato) {
    let nuevoTexto = texto
    if (formato === 'item') {
      nuevoTexto = texto.padStart(6, 0)
    }
    if (formato === 'fecha') {
      nuevoTexto = texto.slice(0, 10)
    }
    console.log('formateando ', texto, '=>', formato, '=', nuevoTexto)
    return '' + nuevoTexto
  }

  return (
    <>
      {Object.keys(row).map((value, index, clave) => (
        <>
          <CTableDataCell border hidden={!column[index].visible}>
            {clave[index] === keyStatus ? (
              <CBadge
                color={row[value] === controlStatus ? 'success' : 'danger'}
                shape="rounded-pill"
              >
                {row[value]}
              </CBadge>
            ) : column['type'] === undefined ? (
              row[value]
            ) : (
              formaterColumnas(row[value], column[index].type)
            )}
          </CTableDataCell>
        </>
      ))}
      {botonVista && (
        <CTableDataCell width={'35px'} className="text-center">
          <Link
            to={`${urlVista}/${codDato}`}
            className="btn btn-sm btn-outline-primary ms-2 "
            title="Ver"
          >
            <CIcon className="text-whitee" icon={cilLineStyle} />
          </Link>
        </CTableDataCell>
      )}
      {botonEliminarRestaurar && (
        <>
          {controlStatus !== '' && (
            <CTableDataCell width={'35px'} className="text-center">
              {controlStatus === statusDato ? (
                <>
                  <CButton
                    variant="outline"
                    onClick={() => eliminarLogicamente(urlEliminar, codDato)}
                    className="btn btn-sm btn-outline-danger ms-2"
                    title={'Eliminar ' + urlEliminar + '/' + codDato}
                  >
                    <CIcon className="text-whitee" icon={cilDelete} />
                  </CButton>
                </>
              ) : (
                <CButton
                  variant="outline"
                  onClick={() => restaurarLogicamente(urlRestaurar, codDato)}
                  className="btn btn-sm btn-outline-warning ms-2 "
                  title={'Restaurar ' + urlRestaurar + '/' + codDato}
                >
                  <CIcon icon={cilActionUndo} />
                </CButton>
              )}
            </CTableDataCell>
          )}
        </>
      )}
    </>
  )
}

export default TablaReporte
