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
import {
  cilList,
  cilLineStyle,
  cilDelete,
  cilActionUndo,
  cilCheckCircle,
  cilBan,
} from '@coreui/icons'

const URL_API_CLIENTES = process.env.REACT_APP_API_CLIENTES
const URL_API_ELIMINAR_CLIENTE = process.env.REACT_APP_API_CLIENTE_ELIMINAR
const URL_API_RESTAURAR_CLIENTE = process.env.REACT_APP_API_CLIENTE_RESTAURAR

//==================================LISTADO==================================

const Tables = () => {
  const [clientesList, setClientesList] = useState([])

  useEffect(() => {
    Axios.get(URL_API_CLIENTES).then((data) => {
      setClientesList(data.data)
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
    Axios.get(URL_API_ELIMINAR_CLIENTE + '/' + codigo).then((data) => {
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
    Axios.get(URL_API_RESTAURAR_CLIENTE + '/' + codigo).then((data) => {
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
            <strong> Clientes</strong>
          </CCardHeader>
          <CCardBody>
            {/* <p className="text-medium-emphasis small">
              Use <code>hover</code> property to enable a hover state on table rows within a{' '}
              <code>&lt;CTableBody&gt;</code>.
            </p> */}
            {clientesList.length > 0 ? (
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Código</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Nit</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Nombre cliente</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Direccin</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Teléfono</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Contabilidad</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tributaria</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Revisoria</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Areas</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Estado</CTableHeaderCell>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {clientesList.map((cliente) => (
                    <CTableRow key={'CLIENTE_' + cliente.CodCliente}>
                      <CTableHeaderCell scope="row">{cliente.CodCliente}</CTableHeaderCell>
                      <CTableDataCell>{cliente.nit}</CTableDataCell>
                      <CTableDataCell>{cliente.NameCliente}</CTableDataCell>
                      <CTableDataCell>{cliente.Direccion}</CTableDataCell>
                      <CTableDataCell>
                        {cliente.Telefono !== 0 ? cliente.Telefono : ''}
                      </CTableDataCell>
                      <CTableDataCell>{cliente.Email}</CTableDataCell>
                      <CTableDataCell>
                        {cliente.ServicioContabilidad ? (
                          <CIcon className="text-success" icon={cilCheckCircle} size="xl" />
                        ) : (
                          <CIcon className="text-danger" icon={cilBan} size="xl" />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {cliente.ServicioTributaria ? (
                          <CIcon className="text-success" icon={cilCheckCircle} size="xl" />
                        ) : (
                          <CIcon className="text-danger" icon={cilBan} size="xl" />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        {cliente.ServicioRevisoria ? (
                          <CIcon className="text-success" icon={cilCheckCircle} size="xl" />
                        ) : (
                          <CIcon className="text-danger" icon={cilBan} size="xl" />
                        )}
                      </CTableDataCell>
                      <CTableDataCell>{cliente.AreasAsociadas}</CTableDataCell>
                      <CTableDataCell>
                        {' '}
                        {cliente.StatusCliente === 1 ? 'Activo' : 'Inactivo'}
                      </CTableDataCell>
                      <CTableDataCell>
                        <Link
                          to={`/clientes/vista-registro/${cliente.CodCliente}`}
                          className="btn btn-sm btn-outline-primary ms-2 "
                          title="Ver formulario"
                        >
                          <CIcon icon={cilLineStyle} />
                        </Link>
                        {cliente.StatusCliente === 1 ? (
                          <button
                            onClick={() => eliminarLogicamente(cliente.CodCliente)}
                            className="btn btn-sm btn-outline-danger ms-2"
                            title="Eliminar"
                          >
                            <CIcon className="text-whitee" icon={cilDelete} />
                          </button>
                        ) : (
                          <button
                            onClick={() => restaurarLogicamente(cliente.CodCliente)}
                            className="btn btn-sm btn-outline-warning ms-2 "
                            title="Restaurar"
                          >
                            <CIcon icon={cilActionUndo} />
                          </button>
                        )}
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
