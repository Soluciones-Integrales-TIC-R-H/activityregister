import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'

import 'styled-components'

import TablaReporteExportar from '../../components/TablaReporteExportar'

import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilCommand, cilDelete, cilDescription, cilEqualizer, cilLineStyle } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { nanoid } from 'nanoid'
import { DatosAcount } from 'src/components/VerificarAcount'
import { sumarDiasTofecha, transformarFechaYMD } from 'src/utilities/utilidades'
import { eliminarLogicamente, visualizar } from 'src/services/AccionesCrud'
import { CONFIG_HEADER_AUTH } from 'src/utilities/config'
import { Page404 } from '../pages/page404/Page404'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'

const URL_API_EVENTOS_REPORTE = process.env.REACT_APP_API_EVENTOS_CONSULTA_AVANZADA
const URL_API_ELIMINAR_ITEM = process.env.REACT_APP_API_EVENTO_ELIMINAR
const URL_API_FUNCIONARIOS = process.env.REACT_APP_API_FUNCIONARIOS
const URL_API_CLIENTES = process.env.REACT_APP_API_CLIENTES

//==================================VISTA==================================
const Vista = () => {
  return (
    <>
      <AuthenticatedTemplate>
        <CRow>
          <CCol xs={12}>
            <CCard>
              <CCardHeader className="text-primaryy text-uppercase">
                <CIcon icon={cilDescription} size="xl" />
                <strong> Registro de actividad</strong>
              </CCardHeader>
              <CCardBody>
                <Formulario key={'FORM_EVENTO_LISTA_' + nanoid()} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Page404 />
      </UnauthenticatedTemplate>
    </>
  )
}

//==================================COLUMNAS DE TABLA REPORTE==================================
const Columnas = [
  {
    id: 'Codigo',
    name: 'Codigo',
    selector: (row) => row.CodEvento.toString().padStart(5, 0),
    omit: false,
  },
  {
    id: 'FechaCreacion',
    name: 'F. Creación',
    selector: (row) => row.FechaCreacion.slice(0, 10),
    center: true,
    omit: true,
  },
  {
    id: 'FechaEvento',
    name: 'Fecha evento',
    selector: (row) => row.FechaEvento.split('T')[0],
    sortable: true,
    direction: 'desc',
    center: true,
  },
  {
    id: 'Atraso',
    name: 'Atraso',
    selector: (row) => row.Atraso,
    sortable: false,
    center: true,
    omit: true,
  },
  //{ name: 'Fin', visible: false selector: row => row.title},
  {
    id: 'Responsable',
    name: 'Responsable',
    selector: (row) => row.Responsable,
    grow: 2,
    sortable: false,
    selected: true,
    wrap: true,
  },
  {
    id: 'Email',
    name: 'Email',
    selector: (row) => row.EmailResponsable,
    sortable: true,
    omit: true,
  },
  { id: 'CodArea', name: 'CodArea', selector: (row) => row.CodArea, omit: true },
  {
    id: 'Area',
    name: 'Area',
    selector: (row) => row.AreaRegistro,
    // grow: 2,
    sortable: false,
    wrap: false,
  },
  { id: 'CodCliente', name: 'CodCliente', selector: (row) => row.CodCliente, omit: true },
  {
    id: 'Cliente',
    name: 'Cliente',
    selector: (row) => row.Cliente,
    grow: 2,
    sortable: true,
    wrap: true,
  },
  { id: 'CodEtapa', name: 'CodEtapa', selector: (row) => row.CodEtapa, omit: true },
  {
    id: 'Etapa',
    name: 'Etapa',
    selector: (row) => row.Etapa,
    grow: 2,
    sortable: true,
    wrap: true,
  },
  { id: 'Actividades', name: 'CodeActividades', selector: (row) => row.Actividades, omit: true },
  {
    id: 'NombreActividades',
    name: 'Actividades',
    selector: (row) => row.NombreActividades,
    omit: true,
  },
  { id: 'Tiempo', name: 'Tiempo', selector: (row) => row.Tiempo, right: true },
  {
    id: 'Observaciones',
    name: 'Observaciones',
    selector: (row) => row.Observaciones,
    sortable: true,
    omit: true,
  },
  // {
  //   id: 'Seguimiento',
  //   name: 'Seguimiento',
  //   selector: (row) => row.Seguimiento,
  //   sortable: true,
  //   conditionalCellStyles: [
  //     {
  //       when: (row) => row.Seguimiento === 'Si',
  //       style: {
  //         backgroundColor: 'rgba(63, 195, 128, 0.9)',
  //         color: 'white',
  //       },
  //     },
  //   ],
  // },
  {
    id: 'Seguimiento',
    name: 'Seguimiento',
    selector: (row) => row.Seguimiento,
    cell: (row) => (
      <CBadge color={row.Seguimiento === 'Si' ? 'danger' : 'dark'} shape="rounded-pill">
        {row.Seguimiento}
      </CBadge>
    ),
    sortable: true,
    center: true,
  },
  // {
  //   name: '',
  //   button: true,
  //   cell: (row) => (
  //     <a href={row.posterUrl} target="_blank" rel="noopener noreferrer">
  //       Download
  //     </a>
  //   ),
  // },
  {
    name: '',
    button: true,
    cell: (row) =>
      row.Estado === 'Activo' && row.EmailResponsable === DatosAcount().email ? (
        <>
          <CButton
            variant="outline"
            onClick={() =>
              eliminarLogicamente(
                URL_API_ELIMINAR_ITEM,
                row.CodEvento,
                'Registro eliminado',
                'Registro no se pudo eliminar',
              )
            }
            className="btn btn-sm btn-outline-danger ms-2"
            title={'Eliminar evento'}
          >
            <CIcon className="text-whitee" icon={cilDelete} />
          </CButton>
          <CButton
            variant="outline"
            onClick={() => visualizar('/registro-actividad/vista-registro', row.CodEvento)}
            className="btn btn-sm btn-outline-primary ms-2"
            title={'Visualizar evento'}
          >
            <CIcon className="text-whitee" icon={cilLineStyle} />
          </CButton>
        </>
      ) : (
        <CButton
          variant="outline"
          onClick={() => visualizar('/registro-actividad/vista-registro', row.CodEvento)}
          className="btn btn-sm btn-outline-primary ms-2"
          title={'Visualizar evento'}
        >
          <CIcon className="text-whitee" icon={cilLineStyle} />
        </CButton>
      ),
  },
]
//==================================FORMULARIO==================================
const FormularioSchema = Yup.object({
  fechaInicial: Yup.date('Fecha incorrecta').required('Campo requerido'),
  fechaFinal: Yup.date('Fecha incorrecta').required('Campo requerido'),
  consulta: Yup.string(),
  responsable: Yup.string(),
  area: Yup.number().positive().integer(),
  etapa: Yup.string(),
  cliente: Yup.string(),
  seguimiento: Yup.boolean(),
})

const Formulario = () => {
  const datosFuncionario = DatosAcount()
  const [datosEventos, setDatosEventos] = useState([])
  const [loading, setLoading] = useState(false)

  const [clienteList, setClienteList] = useState([])
  const [funcionarioList, setFuncionarioList] = useState([])

  //QUEMADO POR AHORA
  const ListaReporterosTodos = [
    'drenteria',
    'johanna.torres',
    'lucia.arias',
    'francysierra',
    'linacorrea',
    'jaimea',
    'johnh',
  ]
  const ListaReporterosColaboradores = ['drenteria', 'jaimea', 'johnh']

  const loadClientes = async (filtro = '') => {
    setClienteList([])
    if (filtro === '') {
      await Axios.get(URL_API_CLIENTES, CONFIG_HEADER_AUTH).then((data) => {
        setClienteList(data.data.result)
      })
    } else {
      await Axios.get(URL_API_CLIENTES, CONFIG_HEADER_AUTH).then((data) => {
        const clientes = data.data.result.filter((cliente) => cliente.Celula === filtro)
        setClienteList(clientes)
      })
    }
  }

  const loadFuncionarios = async (filtro = '') => {
    //setFuncionarioList([])
    if (filtro === '') {
      await Axios.get(URL_API_FUNCIONARIOS, CONFIG_HEADER_AUTH).then((data) => {
        setFuncionarioList(data.data.result)
      })
    } else {
      await Axios.get(URL_API_FUNCIONARIOS, CONFIG_HEADER_AUTH).then((data) => {
        const funcionarios = data.data.result.filter((funcionario) => funcionario.Email === filtro)
        setFuncionarioList(funcionarios)
      })
    }
  }

  const loadCelulas = async (filtro = '') => {
    setFuncionarioList([])
    if (filtro === '') {
      await Axios.get(URL_API_FUNCIONARIOS, CONFIG_HEADER_AUTH).then((data) => {
        setFuncionarioList(data.data.result)
      })
    } else {
      await Axios.get(URL_API_FUNCIONARIOS, CONFIG_HEADER_AUTH).then((data) => {
        const funcionarios = data.data.result.filter((funcionario) => funcionario.Email === filtro)
        setFuncionarioList(funcionarios)
      })
    }
  }

  useEffect(() => {
    const loadData = async () => {
      await Axios.post(URL_API_EVENTOS_REPORTE, formik.initialValues, CONFIG_HEADER_AUTH).then(
        (data) => {
          //console.log('Datos eventos', data)
          if (data.data) {
            //toast.success('Listado generado')
            setDatosEventos(data.data.result)
            //formik.resetForm()
          } else {
            toast.error('No se pudo generar el listado')
          }
          setLoading(false)
        },
      )
    }
    setLoading(true)
    loadFuncionarios(datosFuncionario.email)
    loadClientes()
    loadData()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fechaActual = new Date()
  const fechaRestrasada = sumarDiasTofecha(new Date(), -7)

  const fechaInicial = transformarFechaYMD(fechaRestrasada)
  const fechaFinal = transformarFechaYMD(fechaActual)

  const formik = useFormik({
    initialValues: {
      fechaInicial: fechaInicial.toString(),
      fechaFinal: fechaFinal.toString(),
      consulta: '1',
      responsable: datosFuncionario.email,
      area: '',
      etapa: '',
      cliente: '',
    },
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2))
      if (values.consulta === '2') {
        values.responsable = datosFuncionario.email
      }
      sendData(values)
      //formik.resetForm()
    },
  })

  useEffect(() => {
    console.log('Cambio', formik.values)
    //formik.values.responsable = ''
    if (formik.values.consulta === '') {
      formik.values.responsable = ''
      setFuncionarioList([{ Email: '', Nombre: 'TODOS LOS COLABORADORES' }])
    } else {
      //Nombre propio
      if (formik.values.consulta === '1') {
        loadFuncionarios(datosFuncionario.email)
        formik.values.responsable = datosFuncionario.email
      }
      //Celulas
      if (formik.values.consulta === '2') {
        formik.values.responsable = ''
        setFuncionarioList([{ Email: '', Nombre: 'TODOS MIS EQUIPOS DE TRABAJO' }])
        // loadCelulas(datosFuncionario.email)
        // funcionarioList.filter((funcionario) => funcionario.Email === datosFuncionario.email)
        // formik.values.responsable = datosFuncionario.email
      }
      //Por colaborador
      if (formik.values.consulta === '3') {
        //formik.values.responsable = ''
        loadFuncionarios()
      }
    }
  }, [datosFuncionario.email, formik.values])

  const sendData = async (dataForm) => {
    Axios.post(URL_API_EVENTOS_REPORTE, dataForm, CONFIG_HEADER_AUTH).then((data) => {
      console.log('datos ', dataForm)
      if (data.data) {
        toast.success('Listado generado')
        setDatosEventos(data.data.result)
        //formik.resetForm()
      } else {
        toast.error('No se pudo generar el listado')
      }
    })
  }

  return (
    <>
      {loading ? (
        <div className="text-center">
          <CSpinner color="dark" variant="border" style={{ width: '200px', height: '200px' }} />
        </div>
      ) : (
        <>
          <CForm className="g-3" onSubmit={formik.handleSubmit}>
            <CRow>
              <CCol md={3}>
                <label className="text-uppercase">
                  <strong>Fecha inicio</strong>
                </label>
                <CFormInput
                  type="date"
                  id="fechaInicial"
                  feedback="Por favor, selecciona la fecha de inicio"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fechaInicial}
                  max={fechaFinal.toString()}
                  className={formik.errors.fechaInicial && 'form-control border-danger'}
                />
                {formik.errors.fechaInicial ? (
                  <span className="text-danger">{formik.errors.fechaInicial} </span>
                ) : null}
              </CCol>
              <CCol md={3}>
                <label className="text-uppercase">
                  <strong>Fecha final</strong>
                </label>
                <CFormInput
                  type="date"
                  id="fechaFinal"
                  feedback="Por favor, selecciona la fecha de finalización"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fechaFinal}
                  min={formik.values.fechaInicial}
                  max={fechaRestrasada.toString()}
                  className={formik.errors.fechaFinal && 'form-control border-danger'}
                />
                {formik.errors.fechaFinal ? (
                  <span className="text-danger">{formik.errors.fechaFinal} </span>
                ) : null}
              </CCol>
              <CCol md={6}>
                <label className="text-uppercase">
                  <strong>Tipo de Consulta</strong>
                </label>
                <CFormSelect
                  id="consulta"
                  aria-label="Default select responsable"
                  feedback="Por favor, selecciona una opción de la lista"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.consulta}
                  className={formik.errors.consulta && 'form-control border-danger'}
                >
                  {ListaReporterosTodos.includes(String(datosFuncionario.email).split('@')[0]) ? (
                    <option key="consulta_0" value="">
                      TODOS LOS REGISTROS
                    </option>
                  ) : (
                    ''
                  )}
                  <option key="consulta_1" value="1" selected>
                    A NOMBRE PROPIO
                  </option>
                  <option key="consulta_2" value="2">
                    POR CELULA DE TRABAJO
                  </option>
                  {ListaReporterosColaboradores.includes(
                    String(datosFuncionario.email).split('@')[0],
                  ) ? (
                    <option key="consulta_3" value="3">
                      POR COLABORADOR
                    </option>
                  ) : (
                    ''
                  )}
                </CFormSelect>
                {formik.errors.consulta ? (
                  <span className="text-danger">{formik.errors.consulta} </span>
                ) : null}
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <CCol md={6}>
                <label className="text-uppercase">
                  <strong>Responsable</strong>
                </label>
                <CFormSelect
                  id="responsable"
                  aria-label="Default select responsable"
                  feedback="Por favor, selecciona una opción de la lista"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.responsable}
                  className={formik.errors.responsable && 'form-control border-danger'}
                  // disabled
                >
                  {formik.values.consulta === '3' ? (
                    <option key="funcionario_0" value="" disabled={true}>
                      TODOS LOS RESPONSABLES
                    </option>
                  ) : (
                    ''
                  )}
                  {funcionarioList.map((funcionario) => (
                    <option key={'funcionario_' + funcionario.Codigo} value={funcionario.Email}>
                      {funcionario.Nombre}
                    </option>
                  ))}
                </CFormSelect>
                {formik.errors.responsable ? (
                  <span className="text-danger">{formik.errors.responsable} </span>
                ) : null}
              </CCol>
              <CCol md={6}>
                <label className="text-uppercase">
                  <strong>Empresa cliente</strong>
                </label>
                <CFormSelect
                  id="cliente"
                  aria-label="Default select cliente"
                  feedback="Por favor, selecciona una opción de la lista"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cliente}
                  className={formik.errors.cliente && 'form-control border-danger'}
                >
                  <option key="cliente_0" value="">
                    TODOS LOS REGISTROS
                  </option>
                  {clienteList.map((cliente) => (
                    <option key={'cliente_' + cliente.Codigo} value={cliente.Codigo}>
                      {cliente.Nombre}
                    </option>
                  ))}
                </CFormSelect>
                {formik.errors.cliente ? (
                  <span className="text-danger">{formik.errors.cliente} </span>
                ) : null}
              </CCol>
            </CRow>
            <CRow className="mb-2 mt-2">
              <CCol xs={12}>
                <CButton color="primary" type="submit" title="Enviar formulario">
                  <CIcon icon={cilCommand} /> Generar
                </CButton>
                <CButton
                  className="ms-2"
                  color="secondary"
                  type="reset"
                  title="Restablecer formulario"
                >
                  <CIcon icon={cilEqualizer} /> Restablecer
                </CButton>
              </CCol>
            </CRow>
            <ToastContainer position="bottom-center" autoClose={1000} />
          </CForm>
          <hr className="border-bottom border-primary" />
          <TablaReporteExportar
            columns={Columnas}
            filas={datosEventos}
            botonReporte={true}
            expandible={true}
            tituloTabla={'reporte eventos'}
            defaultSortFieldId={'FechaEvento'}
            defaultSortAsc={false}
          />
        </>
      )}
    </>
  )
}

export default Vista
