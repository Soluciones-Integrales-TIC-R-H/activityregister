/* eslint-disable no-unreachable */
import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { nanoid } from 'nanoid'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CFormSwitch,
  CFormTextarea,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilDelete, cilDescription, cilList, cilPlus, cilSend } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DatosAcount } from 'src/components/VerificarAcount'
import { Page404 } from '../pages/page404/Page404'
import { CONFIG_HEADER_AUTH } from 'src/utilities/config'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'

//ELIMINAR LUEGO, CAMBIAR ESTRATEGIA DE OBTENCION DE DATOS
const URL_API_ALL_CLIENTES = process.env.REACT_APP_API_CLIENTES
const URL_API_ALL_AREAS = process.env.REACT_APP_API_AREAS
const URL_API_ALL_ETAPAS = process.env.REACT_APP_API_ETAPAS
const URL_API_ALL_ACTIVIDADES = process.env.REACT_APP_API_ACTIVIDADES
//FIN ELIMINAR LUEGO, CAMBIAR ESTRATEGIA DE OBTENCION DE DATOS
const URL_API_FUNCIONARIOS = process.env.REACT_APP_API_FUNCIONARIOS_ACTIVOS
const URL_API_AREAS = process.env.REACT_APP_API_AREAS_ACTIVAS
const URL_API_CLIENTES = process.env.REACT_APP_API_CLIENTE_POR_AREA
const URL_API_ETAPAS = process.env.REACT_APP_API_ETAPA_POR_AREA
const URL_API_ACTIVIDADES = process.env.REACT_APP_API_ACTIVIDADES_POR_ETAPA
const URL_API_CREAR_EVENTO = process.env.REACT_APP_API_EVENTO_INSERTAR

const Vista = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="text-primaryy text-uppercase">
            <CIcon icon={cilDescription} size="xl" />
            <strong> Registro de actividad</strong>
          </CCardHeader>
          <CCardBody>
            <AuthenticatedTemplate>
              <Formulario />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
              <Page404 />
            </UnauthenticatedTemplate>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

const FormularioSchema = Yup.object({
  codigo: Yup.string().required('Campo requerido'),
  email: Yup.string()
    .email('Dirección de correo electrónico no válida')
    .required('Campo requerido'),
  nombre: Yup.string().required('Campo requerido'),
  fechaInicial: Yup.date('Fecha incorrecta').required('Campo requerido'),
  fechaFinal: Yup.date('Fecha incorrecta').required('Campo requerido'),
  area: Yup.number().required('Campo requerido').positive().integer(),
  cliente: Yup.string().required('Campo requerido'),
  etapa: Yup.string().required('Campo requerido'),
  actividades: Yup.array().required('Campo requerido').min(1, 'Campo requerido'),
  tiempo: Yup.number().required('Campo requerido'),
  notas: Yup.string(),
  seguimiento: Yup.boolean(),
})

const Formulario = () => {
  //ELIMINAR LOS ALL O BUSCAR OTRA ESTRATEGIA
  const [listaTodasLasAreas, setListaTodasLasAreas] = useState([])
  const [listaAreasActivas, setListaAreasActivas] = useState([])
  const [listaTodosLosClientes, setListaTodosLosClientes] = useState([])
  const [listaFuncionarios, setListaFuncionarios] = useState([])
  const [listaClientes, setListaClientes] = useState([])
  const [listaTodasLasEtapas, setListaTodasLasEtapas] = useState([])
  const [listaEtapas, setListaEtapas] = useState([])
  const [listaTodasLasActividades, setListaTodasLasActividades] = useState([])
  const [listaActividades, setListaActividades] = useState([])
  //ELIMINAR LOS ALL O BUSCAR OTRA ESTRATEGIA
  const [stateAreaControl, setStateAreaControl] = useState('')
  const [stateEtapaControl, setStateEtapaControl] = useState('')
  const [datosEvento, setDatosEvento] = useState([])
  const [listaDetalles, setListaDetalles] = useState([])
  //const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activarEnvio, setActivarEnvio] = useState(false)
  const [mostrarDetalles, setMostrarDetalles] = useState(false)

  const datosFuncionario = DatosAcount()

  useEffect(() => {
    const cargarTodasLasAreas = async () => {
      //Activas
      await Axios.get(URL_API_AREAS, CONFIG_HEADER_AUTH).then((data) => {
        if (data.data) {
          setListaAreasActivas(data.data.result)
        } else {
          toast.error('No se cargaron las areas disponibles')
        }
      })
      //Todas las areas
      await Axios.get(URL_API_ALL_AREAS, CONFIG_HEADER_AUTH).then((data) => {
        if (data.data) {
          setListaTodasLasAreas(data.data.result)
        } else {
          toast.error('No se cargaron las areas')
        }
      })
    }

    const cargarFuncionarios = async () => {
      await Axios.get(URL_API_FUNCIONARIOS, CONFIG_HEADER_AUTH).then((data) => {
        if (data.data) {
          setListaFuncionarios(data.data.result)
        } else {
          toast.error('No se cargaron los funcionarios')
        }
      })
    }

    const cargarTodasLasEtapas = async () => {
      await Axios.get(URL_API_ALL_ETAPAS, CONFIG_HEADER_AUTH).then((data) => {
        if (data.data) {
          setListaTodasLasEtapas(data.data.result)
        } else {
          toast.error('No se cargaron las etapas')
        }
      })
    }
    const cargarTodasLasActividades = async () => {
      await Axios.get(URL_API_ALL_ACTIVIDADES, CONFIG_HEADER_AUTH).then((data) => {
        if (data.data) {
          setListaTodasLasActividades(data.data.result)
        } else {
          toast.error('No se cargaron las actividades')
        }
      })
    }
    const cargarTodosLosClientes = async () => {
      await Axios.get(URL_API_ALL_CLIENTES, CONFIG_HEADER_AUTH).then((data) => {
        if (data.data) {
          setListaTodosLosClientes(data.data.result)
        } else {
          toast.error('No se cargaron los clientes')
        }
      })
    }
    setLoading(true)
    cargarTodasLasAreas()
    cargarFuncionarios()
    cargarTodasLasEtapas()
    cargarTodasLasActividades()
    cargarTodosLosClientes()
    setLoading(false)
    //eslint-disable-next-line react-hooks/exhaustive-deps
    //bloquearClickDerecho()
  }, [])

  const fecha = new Date()
  const hoy =
    fecha.getFullYear() +
    '-' +
    (fecha.getMonth() + 1).toString().padStart(2, 0) +
    '-' +
    fecha.getDate().toString().padStart(2, 0)
  const hoy2 =
    fecha.getDate() +
    '/' +
    (fecha.getMonth() + 1).toString().padStart(2, 0) +
    '/' +
    fecha.getFullYear()

  const formik = useFormik({
    initialValues: {
      fechaRegistro: new Date().toISOString(),
      codigo: 'D0',
      email: datosFuncionario.email,
      nombre: datosFuncionario.nombre.toUpperCase(),
      fechaInicial: hoy.toString(),
      fechaFinal: hoy.toString(),
      area: '',
      cliente: '',
      etapa: '',
      actividades: '[]',
      tiempo: '',
      notas: '',
      seguimiento: false,
    },
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      //sendData(values)
      //console.log('Values formik', values)
      sendData(listaDetalles)
      //formik.resetForm()
    },
  })

  useEffect(() => {
    //console.log('Cambio', formik.values)
    setStateAreaControl(formik.values.area)
    setStateEtapaControl(formik.values.etapa)

    if (formik.values.area !== '') {
      if (stateAreaControl !== formik.values.area) {
        //console.log('Cambio el area')
        formik.values.cliente = ''
        formik.values.etapa = ''
        formik.values.actividades = []
      }
      Axios.get(URL_API_ETAPAS + '/' + formik.values.area, CONFIG_HEADER_AUTH).then((data) => {
        //console.log(data.data)
        //setListaEtapas(data.data.result)
        setListaEtapas(data.data.result.filter((etapa) => etapa.Estado === 'Activa'))
      })
      Axios.get(URL_API_CLIENTES + '/' + formik.values.area, CONFIG_HEADER_AUTH).then((datos) => {
        //console.log(datos.data)
        //setListaClientes(datos.data.result)
        setListaClientes(datos.data.result.filter((cliente) => cliente.Estado === 'Activo'))
      })
    } else {
      setListaClientes([])
      setListaEtapas([])
      setListaActividades([])
      formik.values.area = ''
      formik.values.cliente = ''
      formik.values.etapa = ''
      formik.values.actividades = []
    }

    if (formik.values.etapa !== '') {
      if (stateEtapaControl !== formik.values.etapa) {
        //console.log('Cambio la etapa')
        formik.values.actividades = []
      }
      Axios.get(URL_API_ACTIVIDADES + '/' + formik.values.etapa, CONFIG_HEADER_AUTH).then(
        (data) => {
          //console.log(data.data)
          //setListaActividades(data.data.result)
          setListaActividades(data.data.result.filter((actividad) => actividad.Estado === 'Activa'))
        },
      )
    } else {
      setListaClientes([])
      setListaEtapas([])
      setListaActividades([])
      formik.values.actividades = []
    }

    if (listaDetalles.length > 1) {
      setMostrarDetalles(true)
      setActivarEnvio(true)
    }

    //cambiar cuando se active la funcionalidad multifecha
    if (formik.values.fechaInicial !== '') {
      formik.values.fechaFinal = formik.values.fechaInicial
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values])

  const buscarNombrePorCodigo = (codigo, origen) => {
    let nombre = 'Origen no definido'
    if (origen === 'CLIENTES') {
      if (listaTodosLosClientes.find((element) => element.Codigo === parseInt(codigo))) {
        nombre = listaTodosLosClientes.find((element) => element.Codigo === parseInt(codigo)).Nombre
      }
    }
    if (origen === 'AREAS') {
      if (listaTodasLasAreas.find((element) => element.Codigo === parseInt(codigo))) {
        nombre = listaTodasLasAreas.find((element) => element.Codigo === parseInt(codigo)).Nombre
      }
    }
    if (origen === 'ETAPAS') {
      if (listaTodasLasEtapas.find((element) => element.Codigo === parseInt(codigo))) {
        nombre = listaTodasLasEtapas.find((element) => element.Codigo === parseInt(codigo)).Nombre
      }
    }
    if (origen === 'ACTIVIDADES') {
      if (listaTodasLasActividades.find((element) => element.Codigo === parseInt(codigo))) {
        nombre = listaTodasLasActividades.find(
          (element) => element.Codigo === parseInt(codigo),
        ).Nombre
      }
    }
    return nombre
  }

  const sendData = async (dataForm) => {
    //console.log(dataForm)
    Axios.post(URL_API_CREAR_EVENTO, dataForm, CONFIG_HEADER_AUTH).then((data) => {
      //console.log(data)
      if (data.data.result) {
        toast.success('Registro insertado') && (
          <Navigate to="/#/registro-actividad" replace={true} />
        )
        formik.resetForm()
        listaDetalles.length = 0
      } else {
        toast.error('Registro no se pudo insertar')
      }
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const eliminarDetalle = async (index) => {
    //console.log('Eliminando detalles del formulario', index)
    //alert(JSON.stringify(listaDetalles[index]))
    if (listaDetalles[index] !== undefined) {
      var detalles = listaDetalles
      const removed = detalles.splice(index, 1)
      setListaDetalles(detalles)
      const validando = await formik.validateForm()
      // console.log('¿Validado?', formik.isValid)
      // console.log('Errores', formik.errors)
      toast.success('Detalle eliminado de la lista')
      formik.resetForm()
    } else {
      toast.error('Detalle no se pudo eliminar')
    }
  }

  const agregarDetalle = async () => {
    //console.log('Enviando validación formulario para detalles')
    const validando = await formik.validateForm()
    //console.log('¿Validado?', formik.isValid)
    //console.log('Errores', formik.errors)
    if (
      Object.entries(validando).length === 0 &&
      Object.entries(formik.errors).length === 0 &&
      formik.isValid
    ) {
      //console.log('Agregar detalles', formik.values)
      ///setListaDetalles(formik.values)
      formik.values.email = datosFuncionario.email
      formik.values.nombre = datosFuncionario.nombre
      listaDetalles.push(formik.values)
      toast.success('Datalle agregado a la lista')
      //console.log('tamaño', listaDetalles.length)
      formik.resetForm()
    } else {
      toast.error('Detalle no se pudo agregar')
    }
  }

  useEffect(() => {
    //console.log('Detalles', listaDetalles)
    if (listaDetalles.length > 0) {
      setActivarEnvio(true)
    } else {
      setActivarEnvio(false)
    }
  }, [listaDetalles, setListaDetalles, eliminarDetalle])

  return (
    <CForm className="g-3" onSubmit={formik.handleSubmit}>
      <CRow className="d-flexx flex-row-reversee">
        <CCol md={2}>
          <CFormInput
            type="text"
            id="codigo"
            name="codigo"
            disabled
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.codigo}
            className="mt-3 form-control text-center"
          />
          {/* {formik.errors.codigo ? (
            <span className="text-danger">{formik.errors.codigo} </span>
          ) : null} */}
        </CCol>
      </CRow>
      <CRow>
        <CCol md={6}>
          <label className="text-uppercase">
            <strong>Nombre del responsable</strong>
          </label>
          <CFormInput
            type="text"
            id="nombre"
            name="nombre"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nombre}
            className={formik.errors.nombre && 'form-control border-danger'}
            disabled={true}
          />
          {formik.errors.nombre ? (
            <span className="text-danger">{formik.errors.nombre} </span>
          ) : null}
        </CCol>
        <CCol md={6}>
          <label className="text-uppercase">
            <strong>Email del responsable</strong>
          </label>
          <CFormInput
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className={formik.errors.email && 'form-control border-danger'}
            disabled={true}
          />
          {formik.errors.email ? <span className="text-danger">{formik.errors.email} </span> : null}
        </CCol>
      </CRow>
      <hr />
      <CRow>
        <CCol md={6} className="border-end border-primary">
          <CRow>
            <CCol md={6}>
              <label className="text-uppercase">
                <strong>Fecha inicio</strong>
              </label>
              <CFormInput
                type="date"
                id="fechaInicial"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fechaInicial}
                className={formik.errors.fechaInicial && 'form-control border-danger'}
              />
              {formik.errors.fechaInicial ? (
                <span className="text-danger">{formik.errors.fechaInicial} </span>
              ) : null}
            </CCol>
            <CCol md={6}>
              <label className="text-uppercase">
                <strong>Fecha final</strong>
              </label>
              <CFormInput
                type="date"
                id="fechaFinal"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fechaFinal}
                min={formik.values.fechaInicial}
                className={formik.errors.fechaFinal && 'form-control border-danger'}
                disabled={true}
              />
              {formik.errors.fechaFinal ? (
                <span className="text-danger">{formik.errors.fechaFinal} </span>
              ) : null}
            </CCol>
          </CRow>
          <CRow>
            <CCol md={5}>
              <label className="text-uppercase">
                <strong>Area</strong>
              </label>
              <CFormSelect
                id="area"
                aria-label="Default select area"
                feedback="Por favor, selecciona una opción de la lista"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.area}
                className={formik.errors.area && 'form-control border-danger'}
              >
                <option key="area_0" value="">
                  -- SELECCION AREA --
                </option>
                {listaAreasActivas.map((area) => (
                  <option key={'area_' + area.Codigo} value={area.Codigo}>
                    {area.Nombre}
                  </option>
                ))}
              </CFormSelect>
              {formik.errors.area ? (
                <span className="text-danger">{formik.errors.area} </span>
              ) : null}
            </CCol>
            <CCol md={7}>
              <label className="text-uppercase">
                <strong>Etapa</strong>
              </label>
              <CFormSelect
                id="etapa"
                aria-label="Default select example"
                feedback="Por favor, selecciona una opción de la lista"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.etapa}
                className={formik.errors.etapa && 'form-control border-danger'}
              >
                <option key="etapa_0" value="">
                  -- SELECCION ETAPA --
                </option>
                {listaEtapas.map((etapa) => (
                  <option key={'etapa_' + etapa.Codigo} value={etapa.Codigo}>
                    {etapa.Nombre}
                  </option>
                ))}
              </CFormSelect>
              {formik.errors.etapa ? (
                <span className="text-danger">{formik.errors.etapa} </span>
              ) : null}
            </CCol>
          </CRow>
          <CCol md={12}>
            <label className="text-uppercase">
              <strong>Empresa cliente</strong>
            </label>
            <CFormSelect
              id="cliente"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.cliente}
              className={formik.errors.cliente && 'form-control border-danger'}
            >
              <option key="cliente_0" value="">
                -- SELECCION CLIENTE --
              </option>
              {listaClientes.map((cliente) => (
                <option key={'cliente_' + cliente.Codigo} value={cliente.Codigo}>
                  {cliente.Nombre}
                </option>
              ))}
            </CFormSelect>
            {formik.errors.cliente ? (
              <span className="text-danger">{formik.errors.cliente} </span>
            ) : null}
          </CCol>
          <CCol md={12} className={formik.errors.actividades && 'border border-danger'}>
            <label className="text-uppercase">
              <strong>Actividades</strong>
            </label>
            {listaActividades.length > 0 ? (
              listaActividades.map((actividad) => (
                <CFormCheck
                  key={'ACTIVIDAD_' + actividad.Codigo}
                  id={'ACTIVIDAD_' + actividad.Codigo}
                  name="actividades"
                  value={actividad.Codigo}
                  label={actividad.Nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // value={formik.values.actividades}
                />
              ))
            ) : (
              <p>Esperando respuesta</p>
            )}
            {formik.errors.actividades ? (
              <span className="text-danger">{formik.errors.actividades} </span>
            ) : null}
          </CCol>
          <CCol md={4}>
            <label className="text-uppercase">
              <strong>Tiempo dedicado</strong>
            </label>
            <CFormSelect
              id="tiempo"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.tiempo}
              className={formik.errors.tiempo && 'mb-3 form-control border-danger'}
            >
              <option key="tiempo0" value="">
                -- TIEMPO --
              </option>
              <option key="tiempo0_5" value="0.5">
                1/2 Hora
              </option>
              <option key="tiempo1_0" value="1">
                1 Hora
              </option>
              <option key="tiempo1_5" value="1.5">
                1.5 Horas
              </option>
              <option key="tiempo2_0" value="2">
                2 Horas
              </option>
              <option key="tiempo2_5" value="2.5">
                2.5 Horas
              </option>
              <option key="tiempo3_0" value="3">
                3 Horas
              </option>
              <option key="tiempo3_5" value="3.5">
                3.5 Horas
              </option>
              <option key="tiempo4_0" value="4">
                4 Horas
              </option>
              <option key="tiempo4_5" value="4.5">
                4.5 Horas
              </option>
              <option key="tiempo5_0" value="5">
                5 Horas
              </option>
              <option key="tiempo5_5" value="5.5">
                5.5 Horas
              </option>
              <option key="tiempo6_0" value="6">
                6 Horas
              </option>
              <option key="tiempo6_5" value="6.5">
                6.5 Horas
              </option>
              <option key="tiempo7_0" value="7">
                7 Horas
              </option>
              <option key="tiempo7_5" value="7.5">
                7.5 Horas
              </option>
              <option key="tiempo8_0" value="8">
                8 Horas
              </option>
              <option key="tiempo8_5" value="8.5">
                8.5 Horas
              </option>
              <option key="tiempo9_0" value="9">
                9 Horas
              </option>
              <option key="tiempo9_5" value="9.5">
                9.5 Horas
              </option>
              <option key="tiempo10_0" value="10">
                10 Horas
              </option>
              <option key="tiempo10_5" value="10.5">
                10.5 Horas
              </option>
              <option key="tiempo11_0" value="11">
                11 Horas
              </option>
              <option key="tiempo11_5" value="11.5">
                11.5 Horas
              </option>
            </CFormSelect>
            {formik.errors.tiempo ? (
              <span className="text-danger">{formik.errors.tiempo} </span>
            ) : null}
          </CCol>
          <CCol md={12}>
            <label className="text-uppercase">
              <strong>Observaciones</strong>
            </label>
            <CFormTextarea
              as="textarea"
              name="notas"
              rows="3"
              feedback="Por favor, selecciona una opción de la lista"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.notas}
              className={formik.errors.notas && 'form-control border-danger'}
              placeholder="Escribe tus observaciones"
              aria-describedby="basic-addon5"
            ></CFormTextarea>
          </CCol>
          <CCol md={12}>
            <CFormSwitch
              label="¿Es necesario hacer seguimiento al registro?"
              id="seguimiento"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.seguimiento}
            />
          </CCol>
          <CCol xs={12}>
            <CButton
              className="me-2"
              color="primary"
              title="Agregar"
              onClick={() => agregarDetalle()}
            >
              <CIcon icon={cilPlus} /> Agregar detalle
            </CButton>
            {listaDetalles.length > 0 ? (
              <CButton
                className="me-2"
                color="primary"
                // type="submit"
                title="Enviar formulario"
                // disabled={listaDetalles > 0 ? false : true}
                onClick={() => sendData(listaDetalles)}
              >
                <CIcon icon={cilSend} /> Registrar
              </CButton>
            ) : (
              ''
            )}
          </CCol>
        </CCol>
        {/* DERECHA */}
        <CCol md={6}>
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader className="text-primaryy text-uppercase">
                  <CIcon icon={cilList} size="xl" />
                  <strong> Detalles</strong>
                </CCardHeader>
                <CCardBody>
                  {/* <p className="text-medium-emphasis small">
                    Use <code>hover</code> property to enable a hover state on table rows within a{' '}
                    <code>&lt;CTableBody&gt;</code>.
                  </p> */}
                  {listaDetalles.length === 0 ? (
                    <CAlert color="secondary" height="450px">
                      Sin información para visualizar
                    </CAlert>
                  ) : (
                    listaDetalles.map((evento, index) => (
                      <>
                        <CAccordion className="w-100">
                          <CButton
                            color="dark"
                            size="sm"
                            className="text-right mb-1"
                            onClick={() => eliminarDetalle(index)}
                          >
                            Eliminar item {index + 1 + ' '}
                            <CIcon icon={cilDelete} size="xl" />
                          </CButton>
                          <CAccordionItem itemKey={index + 1} className="mb-2">
                            <CAccordionHeader>Item {index + 1}</CAccordionHeader>
                            <CAccordionBody>
                              <CForm className="row g-3">
                                <CCol md={4}>
                                  <CFormInput
                                    type="date"
                                    id={'inicio_fila' + (index + 1)}
                                    label="INICIO"
                                    value={evento.fechaInicial}
                                    className="text-center"
                                    disabled
                                  />
                                </CCol>
                                <CCol md={4}>
                                  <CFormInput
                                    type="date"
                                    id={'fin_fila_' + (index + 1)}
                                    label="FIN"
                                    value={evento.fechaFinal}
                                    className="text-center"
                                    disabled
                                  />
                                </CCol>
                                <CCol md={4}>
                                  <CFormInput
                                    id={'tiempo_fila_' + (index + 1)}
                                    label="DEDICACIÓN"
                                    value={
                                      parseFloat(evento.tiempo) > 1.0
                                        ? evento.tiempo + ' horas '
                                        : parseFloat(evento.tiempo) === 1.0
                                        ? '1 hora '
                                        : '30 minutos'
                                    }
                                    className="text-center"
                                    disabled
                                  />
                                </CCol>
                                <CCol xs={12}>
                                  <CFormSelect
                                    id={'cliente_fila_' + (index + 1)}
                                    label="EMPRESA CLIENTE"
                                    value={evento.cliente}
                                    disabled
                                  >
                                    <option key={'cliente_detalle_0_fila_' + (index + 1)} value="">
                                      -- CLIENTE --
                                    </option>
                                    {listaTodosLosClientes.map((cliente) => (
                                      <option
                                        key={
                                          'cliente_detalle_' +
                                          cliente.Codigo +
                                          '_fila_' +
                                          (index + 1)
                                        }
                                        value={cliente.Codigo}
                                      >
                                        {cliente.Nombre}
                                      </option>
                                    ))}
                                  </CFormSelect>
                                </CCol>
                                <CCol md={5}>
                                  <CFormSelect
                                    id={'area_fila_' + (index + 1)}
                                    label="AREA"
                                    value={evento.area}
                                    disabled
                                  >
                                    <option key={'area_detalle_0_fila_' + (index + 1)} value="">
                                      -- AREA --
                                    </option>
                                    {listaTodasLasAreas.map((area) => (
                                      <option
                                        key={'area_detalle_' + area.Codigo + '_fila_' + (index + 1)}
                                        value={area.Codigo}
                                      >
                                        {area.Nombre}
                                      </option>
                                    ))}
                                  </CFormSelect>
                                </CCol>
                                <CCol md={7}>
                                  <CFormSelect
                                    id={'etapa_' + index + 1}
                                    label="ETAPA"
                                    value={evento.etapa}
                                    disabled
                                  >
                                    <option key={'etapa_detalle_0_fila_' + (index + 1)} value="">
                                      -- ETAPA --
                                    </option>
                                    {listaTodasLasEtapas.map((etapa) => (
                                      <option
                                        key={
                                          'etapa_detalle_' + etapa.Codigo + '_fila_' + (index + 1)
                                        }
                                        value={etapa.Codigo}
                                      >
                                        {etapa.Nombre}
                                      </option>
                                    ))}
                                  </CFormSelect>
                                </CCol>
                                <CCol xs={12}>
                                  <CTable striped hover bordered className="mb-0">
                                    <CTableHead className="bg-dark text-white">
                                      <CTableRow>
                                        <CTableHeaderCell scope="col" style={{ width: '30px' }}>
                                          #
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col">ACTIVIDAD</CTableHeaderCell>
                                      </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                      {evento.actividades.map((actividad, num) => (
                                        <>
                                          <CTableRow key={'DETA_' + nanoid()}>
                                            <CTableHeaderCell scope="row">
                                              {num + 1}
                                            </CTableHeaderCell>
                                            <CTableDataCell key={nanoid()}>
                                              {buscarNombrePorCodigo(actividad, 'ACTIVIDADES')}
                                            </CTableDataCell>
                                          </CTableRow>
                                        </>
                                      ))}
                                    </CTableBody>
                                  </CTable>
                                </CCol>
                                <CCol xs={12}>
                                  <CFormTextarea
                                    id={'notas_' + (index + 1)}
                                    label="OBSERVACIONES"
                                    disabled
                                    rows={4}
                                    value={evento.notas}
                                  ></CFormTextarea>
                                </CCol>
                                <CCol XS={12}>
                                  <CFormSwitch
                                    label={
                                      evento.seguimiento
                                        ? 'Se requiere seguimiento al registro.'
                                        : 'Registro no requiere seguimiento.'
                                    }
                                    id={'seguimiento_' + (index + 1)}
                                    defaultChecked={evento.seguimiento}
                                    disabled
                                  />
                                </CCol>
                              </CForm>
                            </CAccordionBody>
                          </CAccordionItem>
                          <CRow>
                            <CCol></CCol>
                          </CRow>
                        </CAccordion>
                      </>
                    ))
                  )}
                </CCardBody>
              </CCard>
            </CCol>
            <ToastContainer position="bottom-center" autoClose={1000} />
          </CRow>
        </CCol>
      </CRow>
      <ToastContainer position="bottom-center" autoClose={1000} />
    </CForm>
  )
}

export default Vista
