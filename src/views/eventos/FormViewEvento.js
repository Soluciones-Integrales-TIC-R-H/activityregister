import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import {
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
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilDescription } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { Page404 } from '../pages/page404/Page404'
import { descifrar } from 'src/utilities/utilidades'
import { CONFIG_HEADER_AUTH } from 'src/utilities/config'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
//import { bloquearClickDerecho } from 'src/utilities/utilidades'

const URL_API_EVENTO = process.env.REACT_APP_API_EVENTO_POR_CODIGO
//ELIMINAR LUEGO, CAMBIAR ESTRATEGIA DE OBTENCION DE DATOS
const URL_API_ALL_CLIENTES = process.env.REACT_APP_API_CLIENTES
const URL_API_ALL_AREAS = process.env.REACT_APP_API_AREAS
const URL_API_ALL_ETAPAS = process.env.REACT_APP_API_ETAPAS
const URL_API_ALL_ACTIVIDADES = process.env.REACT_APP_API_ACTIVIDADES
//FIN ELIMINAR LUEGO, CAMBIAR ESTRATEGIA DE OBTENCION DE DATOS
const URL_API_FUNCIONARIOS = process.env.REACT_APP_API_FUNCIONARIOS_ACTIVOS
const URL_API_AREAS_ACTIVAS = process.env.REACT_APP_API_AREAS_ACTIVAS
const URL_API_CLIENTES = process.env.REACT_APP_API_CLIENTE_POR_AREA
const URL_API_ETAPAS = process.env.REACT_APP_API_ETAPA_POR_AREA
const URL_API_ACTIVIDADES = process.env.REACT_APP_API_ACTIVIDADES_POR_ETAPA
const URL_API_CREAR_EVENTO = process.env.REACT_APP_API_EVENTO_INSERTAR

const Vista = () => {
  // eslint-disable-next-line react/prop-types
  const { _id } = useParams()
  const [tituloModulo, setTituloModulo] = useState('Vista registro')
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 border-dark">
          <CCardHeader className="bg-dark text-white text-uppercase">
            <CIcon icon={cilDescription} size="xl" />
            <strong> {tituloModulo}</strong>
          </CCardHeader>
          <CCardBody>
            <AuthenticatedTemplate>
              <Formulario _id={_id} setTituloModulo={setTituloModulo} tituloModulo={tituloModulo} />
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
  fechaRegistro: Yup.date('Fecha incorrecta').required('Campo requerido'),
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

// eslint-disable-next-line react/prop-types
const Formulario = ({ _id = undefined, setTituloModulo = '', tituloModulo = '' }) => {
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

  //const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)

  const [initialValues, setInitialValues] = useState({
    codigo: '',
    fechaRegistro: '',
    fechaInicial: '',
    fechaFinal: '',
    email: '', //datosFuncionario.email,
    nombre: '', //datosFuncionario.nombre.toUpperCase(),
    area: '',
    cliente: '',
    etapa: '',
    actividades: [],
    tiempo: '',
    notas: '',
    seguimiento: '',
  })

  //const [datosEvento, setDatosEvento] = useState([])
  const [datosEvento, setDatosEvento] = useState([initialValues])

  const changeDatosEvento = (datos) => {
    setDatosEvento(
      ...datosEvento,
      (datosEvento[0].codigo = datos.CodEvento ? datos.CodEvento : datosEvento[0].codigo),
      (datosEvento[0].fechaRegistro = datos.FechaCreacion
        ? datos.FechaCreacion
        : datosEvento[0].fechaRegistro),
      (datosEvento[0].fechaInicial = datos.FechaEvento
        ? datos.FechaEvento
        : datosEvento[0].fechaInicial),
      (datosEvento[0].fechaFinal = datos.FechaEvento
        ? datos.FechaEvento
        : datosEvento[0].fechaFinal),
      (datosEvento[0].email = datos.EmailResponsable
        ? datos.EmailResponsable
        : datosEvento[0].EmailResponsable), //datosFuncionario.email,
      (datosEvento[0].nombre = datos.Responsable ? datos.Responsable : datosEvento[0].nombre), //datosFuncionario.nombre.toUpperCase(),
      (datosEvento[0].area = datos.CodArea ? datos.CodArea : datosEvento[0].area),
      (datosEvento[0].cliente = datos.CodCliente ? datos.CodCliente : datosEvento[0].cliente),
      (datosEvento[0].etapa = datos.CodEtapa ? datos.CodEtapa : datosEvento[0].etapa),
      (datosEvento[0].actividades = datos.Actividades
        ? JSON.parse(datos.Actividades)
        : datosEvento[0].actividades),
      (datosEvento[0].tiempo = datos.Tiempo ? datos.Tiempo : datosEvento[0].tiempo),
      (datosEvento[0].notas = datos.Observaciones
        ? datos.Observaciones
        : datosEvento[0].Observaciones),
      (datosEvento[0].seguimiento = datos.Seguimiento
        ? datos.Seguimiento
        : datosEvento[0].seguimiento),
    )
  }

  const cargarDatosEvento = async () => {
    let datos
    if (_id !== undefined) {
      const textoDescifrado = descifrar(_id)
      try {
        await Axios.get(`${URL_API_EVENTO}/${textoDescifrado}`, CONFIG_HEADER_AUTH).then((data) => {
          //console.log('Carga datos original', data.data)
          if (data.data.result) {
            datos = data.data.result
            //console.log(datos.Seguimiento)
            if (datos.Seguimiento === 'Si') {
              datos.Seguimiento = true
            } else {
              datos.Seguimiento = false
            }
            changeDatosEvento(datos)
            //setDatosEvento(datos)
          }
        })
      } catch (error) {
        console.log('Error', error)
      }
    }
    //console.log('Carga datos', datos)
  }

  const cargarTodasLasAreas = async () => {
    //Activas
    await Axios.get(URL_API_AREAS_ACTIVAS, CONFIG_HEADER_AUTH).then((data) => {
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

  useEffect(() => {
    //setDatosEvento(initialValues)
    setLoading(true)
    cargarDatosEvento()
    cargarTodasLasAreas()
    cargarFuncionarios()
    cargarTodasLasEtapas()
    cargarTodosLosClientes()
    cargarTodasLasActividades()
    // initialValues: datosEvento[0]
    setLoading(false)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setInitialValues(datosEvento[0])
    console.log(initialValues)
    if (formik.values.etapa !== '') {
      // console.log('Estoy en la etapa')
      //   if (stateEtapaControl !== formik.values.etapa) {
      //     console.log('Cambio la etapa')
      //     formik.values.actividades = []
      //   }
      Axios.get(URL_API_ACTIVIDADES + '/' + formik.values.etapa, CONFIG_HEADER_AUTH).then(
        (data) => {
          //console.log(data.data)
          //setListaActividades(data.data.result)
          setListaActividades(data.data.result.filter((actividad) => actividad.Estado === 'Activa'))
        },
      )
    } else {
      setListaActividades([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datosEvento])

  const formik = useFormik({
    initialValues,
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      //alert(JSON.stringify(values, null, 2))
      //sendData(values)
      console.log('Values', values)
      //sendData(values)
      //formik.resetForm()
    },
  })

  useEffect(() => {
    console.log('Cambio', formik.values)
    setStateAreaControl(formik.values.area)
    setStateEtapaControl(formik.values.etapa)

    if (formik.values.area !== '') {
      //   console.log('Estoy en el area')
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
        setListaClientes(datos.data.result)
        //setListaClientes(datos.data.result.filter((etapa) => etapa.Estado === 'Activo'))
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
      console.log('Estoy en la etapa')
      if (stateEtapaControl !== formik.values.etapa) {
        console.log('Cambio la etapa')
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

    //cambiar cuando se active la funcionalidad multifecha
    if (formik.values.fechaInicial !== '') {
      formik.values.fechaFinal = formik.values.fechaInicial
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values])

  const sendData = async (dataForm) => {
    //console.log(dataForm)
    Axios.post(URL_API_CREAR_EVENTO, dataForm, CONFIG_HEADER_AUTH).then((data) => {
      console.log(data)
      if (data.data.result) {
        toast.success('Registro insertado') && (
          <Navigate to="/#/registro-actividad" replace={true} />
        )
        formik.resetForm()
      } else {
        toast.error('Registro no se pudo insertar')
      }
    })
  }

  return (
    <>
      <fieldset disabled={true}>
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
              {formik.errors.codigo ? (
                <span className="text-danger">{formik.errors.codigo} </span>
              ) : null}
            </CCol>
          </CRow>
          <CRow className="mt-2">
            {/* Fechas */}
            <CCol md={4} className="mt-2">
              <label className="text-uppercase">
                <strong>Fecha registro</strong>
              </label>
              <CFormInput
                type="date"
                id="fechaRegistro"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fechaRegistro}
                className={formik.errors.fechaRegistro && 'form-control border-danger'}
                disabled={true}
              />
              {formik.errors.fechaRegistro ? (
                <span className="text-danger">{formik.errors.fechaRegistro} </span>
              ) : null}
            </CCol>
            <CCol md={4} className="mt-2">
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
            <CCol md={4} className="mt-2">
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
            {/* Area */}
            <CCol md={5} className="mt-2">
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
                {listaTodasLasAreas.map((area) => (
                  <option key={'area_' + area.Codigo} value={area.Codigo}>
                    {area.Nombre}
                  </option>
                ))}
              </CFormSelect>
              {formik.errors.area ? (
                <span className="text-danger">{formik.errors.area} </span>
              ) : null}
            </CCol>
            {/* Etapa */}
            <CCol md={7} className="mt-2">
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
                {listaTodasLasEtapas.map((etapa) => (
                  <option key={'etapa_' + etapa.Codigo} value={etapa.Codigo}>
                    {etapa.Nombre}
                  </option>
                ))}
              </CFormSelect>
              {formik.errors.etapa ? (
                <span className="text-danger">{formik.errors.etapa} </span>
              ) : null}
            </CCol>
            {/* Empresa cliente */}
            <CCol md={12} className="mt-2">
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
                {listaTodosLosClientes.map((cliente) => (
                  <option key={'cliente_' + cliente.Codigo} value={cliente.Codigo}>
                    {cliente.Nombre}
                  </option>
                ))}
              </CFormSelect>
              {formik.errors.cliente ? (
                <span className="text-danger">{formik.errors.cliente} </span>
              ) : null}
            </CCol>
            {/* Actividades */}
            <CCol md={12} className={`mt-2 ${formik.errors.actividades && 'border border-danger'}`}>
              <label className="text-uppercase">
                <strong>Actividades</strong>
              </label>
              {/* { let datosActividades = datosEvento[0].actividades } */}
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
                    defaultChecked={formik.values.actividades.includes(actividad.Codigo)}
                    className={
                      formik.values.actividades.includes(actividad.Codigo) ? 'text-success' : ''
                    }
                    //value={formik.values.actividades}
                  />
                ))
              ) : (
                <p>Esperando respuesta</p>
              )}
              {formik.errors.actividades ? (
                <span className="text-danger">{formik.errors.actividades} </span>
              ) : null}
            </CCol>
            {/* Tiempo */}
            <CCol md={4} className="mt-2">
              <label className="text-uppercase">
                <strong>Tiempo dedicado</strong>
              </label>
              <CFormSelect
                id="tiempo"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tiempo}
                className={formik.errors.tiempo && 'form-control border-danger'}
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
            {/* Observaciones */}
            <CCol md={12} className="mt-2">
              <label className="text-uppercase">
                <strong>Observaciones</strong>
              </label>
              <CFormTextarea
                as="textarea"
                name="notas"
                rows="5"
                feedback="Por favor, selecciona una opción de la lista"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.notas}
                className={formik.errors.notas && 'form-control border-danger'}
                placeholder="Escribe tus observaciones"
                aria-describedby="basic-addon5"
              ></CFormTextarea>
            </CCol>
            {/* Seguimiento */}
            <CCol md={12} className="mt-2">
              <CFormSwitch
                label="¿Es necesario hacer seguimiento al registro?"
                id="seguimiento"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                checked={formik.values.seguimiento}
                value={formik.values.seguimiento}
              />
            </CCol>
          </CRow>
          <ToastContainer position="bottom-center" autoClose={1000} />
        </CForm>
      </fieldset>
    </>
  )
}

export default Vista
