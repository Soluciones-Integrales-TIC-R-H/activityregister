import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Axios from 'axios'
import {
  CAlert,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import CIcon from '@coreui/icons-react'
import { cilList, cilLineStyle } from '@coreui/icons'

const URL_API_EVENTOS = process.env.REACT_APP_API_EVENTOS
const URL_API_ELIMINAR_EVENTO = process.env.REACT_APP_API_EVENTO_ELIMINAR
const URL_API_RESTAURAR_EVENTO = process.env.REACT_APP_API_EVENTO_RESTAURAR

//==================================LISTADO==================================

const Tables = () => {
  const [eventosList, setEventosList] = useState([])

  useEffect(() => {
    Axios.get(URL_API_EVENTOS).then((data) => {
      setEventosList(data.data)
      //console.log(data.data)
    })
  }, [])

  function refreshPage() {
    setTimeout(() => {
      window.location.reload()
    }, 1000)
    console.log('page to reload')
  }

  const eliminarLogicamente = (codigo) => {
    Axios.get(URL_API_ELIMINAR_EVENTO + '/' + codigo).then((data) => {
      console.log(data)
      if (data.status === 200) {
        toast.success('Registro inhabilitado')
      } else {
        toast.error('Registro no se pudo inhabilitar')
      }
    })
    refreshPage()
  }

  const restaurarLogicamente = (codigo) => {
    console.log('Restaurando')
    Axios.get(URL_API_RESTAURAR_EVENTO + '/' + codigo).then((data) => {
      console.log(data)
      if (data.status === 200) {
        toast.success('Registro habilitado')
      } else {
        toast.error('Registro no se pudo habilitar')
      }
    })
    refreshPage()
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="text-primaryy text-uppercase">
            <CIcon icon={cilList} size="xl" />
            <small>Listado </small>
            <strong> Eventos</strong>
          </CCardHeader>
          <CCardBody>
            {/* <p className="text-medium-emphasis small">
              Use <code>hover</code> property to enable a hover state on table rows within a{' '}
              <code>&lt;CTableBody&gt;</code>.
            </p> */}
            {eventosList.length > 0 ? (
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Item</CTableHeaderCell>
                    <CTableHeaderCell scope="col" hidden>
                      Fecha creacion
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Responsable</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Fecha</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Area</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Cliente</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Etapa</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actividades</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tiempo</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Observaciones</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Seguimiento</CTableHeaderCell>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {eventosList.map((actividad) => (
                    <CTableRow key={'EVENTO_' + actividad.CodEvento}>
                      <CTableHeaderCell scope="row">{actividad.CodEvento}</CTableHeaderCell>
                      <CTableDataCell hidden>{actividad.FechaCreacion.slice(0, 10)}</CTableDataCell>
                      <CTableDataCell>{actividad.NameResponsable}</CTableDataCell>
                      <CTableDataCell>{actividad.FechaInicio.slice(0, 10)}</CTableDataCell>
                      <CTableDataCell>{actividad.IdArea}</CTableDataCell>
                      <CTableDataCell>{actividad.IdCliente}</CTableDataCell>
                      <CTableDataCell>{actividad.IdEtapa}</CTableDataCell>
                      <CTableDataCell>{actividad.Actividades}</CTableDataCell>
                      <CTableDataCell>{actividad.Tiempo + ' Horas'}</CTableDataCell>
                      <CTableDataCell>{actividad.Observaciones}</CTableDataCell>
                      <CTableDataCell> {actividad.Seguimiento === 1 ? 'Si' : 'No'}</CTableDataCell>
                      <CTableDataCell>
                        <Link
                          to={`/eventos/vista-registro/${actividad.CodEvento}`}
                          className="btn btn-sm btn-outline-primary ms-2 "
                          title="Ver formulario"
                        >
                          <CIcon className="text-whitee" icon={cilLineStyle} />
                        </Link>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
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

export default Tables
