import React, { useState, useEffect } from 'react'
import { Await, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormSwitch,
  CRow,
  CFormSelect,
  CFormCheck,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilDescription, cilLockLocked, cilLockUnlocked, cilSend } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { refreshPage, descifrar, redireccionar } from 'src/utilities/utilidades'
import { visualizar } from 'src/services/AccionesCrud'
import { CONFIG_HEADER_AUTH } from 'src/utilities/config'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { Page404 } from '../pages/page404/Page404'

const Vista = () => {
  const { _id } = useParams()
  const [tituloModulo, setTituloModulo] = useState('Nuevo registro')
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4 border-dark">
          <CCardHeader className="bg-dark text-white text-uppercase">
            <CIcon icon={cilDescription} size="xl" />
            {tituloModulo}
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
  tipoCliente: Yup.string().required('Campo requerido'),
  tipoIdentificacion: Yup.string().required('Campo requerido'),
  identificacion: Yup.string().required('Campo requerido'),
  nombre: Yup.string().required('Campo requerido'),
  departamento: Yup.string(),
  municipio: Yup.string(),
  direccion: Yup.string(),
  telefono: Yup.string(),
  email: Yup.string(),
  serviAC: Yup.boolean(),
  serviRF: Yup.boolean(),
  serviAT: Yup.boolean(),
  //areas: Yup.array().required('Campo requerido').min(1, 'Campo requerido'),
  areas: Yup.array(),
  celulas: Yup.array(),
  estado: Yup.boolean(),
})

// eslint-disable-next-line react/prop-types
const Formulario = ({ _id = undefined, setTituloModulo = '', tituloModulo = '' }) => {
  const URL_API_DEPARTAMENTOS = process.env.REACT_APP_API_DEPARTAMENTOS
  const URL_API_MUNICIPIOS_POR_DEPARTAMENTO = process.env.REACT_APP_API_MUNICIPIOS_POR_DEPARTAMENTO
  const URL_API_MUNICIPIOS = process.env.REACT_APP_API_MUNICIPIOS
  const URL_API_TIPOS_IDENTIFICACIONES = _id
    ? process.env.REACT_APP_API_TIPOS_IDENTIFICACIONES
    : process.env.REACT_APP_API_TIPOS_IDENTIFICACIONES_ACTIVAS
  const URL_API_AREAS = _id
    ? process.env.REACT_APP_API_AREAS
    : process.env.REACT_APP_API_AREAS_ACTIVAS
  const URL_API_CELULAS = _id
    ? process.env.REACT_APP_API_CELULAS_SIMPLE
    : process.env.REACT_APP_API_CELULAS_ACTIVAS
  const URL_API_CLIENTE = process.env.REACT_APP_API_CLIENTE_POR_CODIGO
  const URL_API_CREAR_CLIENTE = process.env.REACT_APP_API_CLIENTE_INSERTAR
  const URL_API_ACTUALIZAR_CLIENTE = process.env.REACT_APP_API_CLIENTE_ACTUALIZAR

  const [listaDepartamentos, setListaDepartamentos] = useState([])
  const [listaMunicipios, setListaMunicipios] = useState([])
  const [listaTiposIdentificaciones, setListaTiposIdentificaciones] = useState([])
  const [listaAreas, setListaAreas] = useState([])
  const [listaCelulas, setListaCelulas] = useState([])
  const [edicionFormulario, setEdicionFormulario] = useState(false)
  const [initialValues, setInitialValues] = useState({
    codigo: 'D0',
    tipoCliente: '',
    tipoIdentificacion: '',
    identificacion: '',
    nombre: '',
    departamento: '',
    municipio: '',
    direccion: '',
    telefono: '',
    email: '',
    serviAC: '',
    serviRF: '',
    serviAT: '',
    areas: [],
    celulas: [],
    estado: true,
  })

  const [datosCliente, setDatosCliente] = useState([initialValues])

  const cargarCelulasPorCliente = async (cliente) => {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_CELULAS_CONSULTA_SIMPLE_POR_CLIENTE}/${cliente}`,
        CONFIG_HEADER_AUTH,
      )
      if (response.data) {
        let vectorCelula = []
        const data = response.data.result
        // eslint-disable-next-line array-callback-return
        data.map((celu, index) => {
          if (celu.CodCelula !== null && celu.CodCelula !== '') {
            vectorCelula.push(parseInt(celu.CodCelula))
          }
        })
        const resultUnicos = new Set(vectorCelula)
        return [...resultUnicos]
      } else {
        return ['']
      }
    } catch (error) {
      return ['']
    }
  }

  const cargarDatos = async () => {
    setDatosCliente(
      (datosCliente[0]['codigo'] = 'D0'),
      (datosCliente[0]['tipoCliente'] = ''),
      (datosCliente[0]['tipoIdentificacion'] = ''),
      (datosCliente[0]['identificacion'] = ''),
      (datosCliente[0]['nombre'] = ''),
      (datosCliente[0]['departamento'] = ''),
      (datosCliente[0]['municipio'] = ''),
      (datosCliente[0]['direccion'] = ''),
      (datosCliente[0]['telefono'] = ''),
      (datosCliente[0]['email'] = ''),
      (datosCliente[0]['serviAC'] = ''),
      (datosCliente[0]['serviRF'] = ''),
      (datosCliente[0]['serviAT'] = ''),
      (datosCliente[0]['areas'] = []),
      (datosCliente[0]['celulas'] = []),
      (datosCliente[0]['estado'] = true),
    )
    if (_id !== undefined) {
      const textoDescifrado = descifrar(_id)
      let datos
      try {
        await Axios.get(`${URL_API_CLIENTE}/${textoDescifrado}`, CONFIG_HEADER_AUTH).then(
          async (data) => {
            console.log('Carga datos', data.data)
            if (data.data.result) {
              datos = data.data.result
              datos.Estado = datos.Estado === 'Activo' ? true : false
              datos.ServicioContabilidad = datos.ServicioContabilidad === 'Si' ? true : false
              datos.ServicioRevisoria = datos.ServicioRevisoria === 'Si' ? true : false
              datos.ServicioTributaria = datos.ServicioTributaria === 'Si' ? true : false
              setDatosCliente(
                ...datosCliente,
                (datosCliente[0]['codigo'] = datos.Codigo),
                (datosCliente[0]['tipoCliente'] = datos.TipoCliente),
                (datosCliente[0]['tipoIdentificacion'] = datos.CodTipoIdentificacion),
                (datosCliente[0]['identificacion'] = datos.Nit),
                (datosCliente[0]['nombre'] = datos.Nombre),
                (datosCliente[0]['departamento'] = datos.CodDepartamento),
                (datosCliente[0]['municipio'] = datos.CodMunicipio),
                (datosCliente[0]['direccion'] = datos.Direccion),
                (datosCliente[0]['telefono'] = datos.Telefono),
                (datosCliente[0]['email'] = datos.Email),
                (datosCliente[0]['serviAC'] = datos.ServicioContabilidad),
                (datosCliente[0]['serviRF'] = datos.ServicioRevisoria),
                (datosCliente[0]['serviAT'] = datos.ServicioTributaria),
                (datosCliente[0]['areas'] = JSON.parse(datos.AreasAsociadas)),
                (datosCliente[0]['celulas'] = await cargarCelulasPorCliente(datos.Codigo)),
                (datosCliente[0]['estado'] = datos.Estado),
              )
            }
          },
        )
      } catch (error) {
        console.log('Error', error)
      }
    }
  }

  useEffect(() => {
    //console.log('datosCliente', JSON.stringify(datosCliente[0]))
    formik.resetForm()
    setInitialValues(datosCliente[0])
    formik.initialValues = initialValues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datosCliente, setDatosCliente])

  const cargarAreas = async () => {
    await Axios.get(URL_API_AREAS, CONFIG_HEADER_AUTH).then((data) => {
      setListaAreas(data.data.result)
    })
  }

  const cargarCelulas = async () => {
    await Axios.get(URL_API_CELULAS, CONFIG_HEADER_AUTH).then((data) => {
      console.log('celulas', data.data.result)
      setListaCelulas(data.data.result)
    })
  }

  const cargarInformacionGeografica = async () => {
    await Axios.get(URL_API_DEPARTAMENTOS).then((data) => {
      setListaDepartamentos(data.data.result)
    })

    await Axios.get(URL_API_MUNICIPIOS).then((data) => {
      setListaMunicipios(data.data.result)
    })
  }

  const cargarTiposIdentificaciones = async () => {
    await Axios.get(URL_API_TIPOS_IDENTIFICACIONES).then((data) => {
      setListaTiposIdentificaciones(data.data.result)
    })
  }

  useEffect(() => {
    setEdicionFormulario(false)
    formik.resetForm()
    cargarAreas()
    cargarCelulas()
    cargarInformacionGeografica()
    cargarTiposIdentificaciones()
    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (_id !== undefined) {
      if (edicionFormulario === true) {
        setTituloModulo('Editar registro')
      } else {
        setTituloModulo('Vista registro')
      }
    } else {
      setTituloModulo('Nuevo registro')
    }
  }, [_id, edicionFormulario, setTituloModulo])

  const desbloquearFormulario = () => {
    setEdicionFormulario(!edicionFormulario)
    cargarDatos()
  }

  const cancelarAccion = () => {
    console.log('soy cancelar', JSON.stringify(datosCliente[0]))
    cargarDatos()
    setEdicionFormulario(false)
    refreshPage()
  }

  const formik = useFormik({
    initialValues,
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      sendData(values)
      //formik.values.areas = []
      //formik.resetForm()
    },
  })

  // useEffect(() => {
  //   console.log('Cambio en formulario', formik.values, '\n', initialValues)
  // }, [formik.values, initialValues, setInitialValues])

  useEffect(() => {
    console.log('Cambio datos formulario', formik.values)
  }, [formik])

  const sendData = async (dataForm) => {
    console.log('Edicion Formulario: ', edicionFormulario)
    console.log('Titulo Formulario: ', tituloModulo)
    if (edicionFormulario && tituloModulo !== '') {
      switch (tituloModulo.toUpperCase()) {
        case 'EDITAR REGISTRO':
          console.log('SOY FUNCION EDITAR')
          Axios.put(URL_API_ACTUALIZAR_CLIENTE, dataForm, CONFIG_HEADER_AUTH).then((data) => {
            console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro actualizado')
                formik.resetForm()
                setEdicionFormulario(false)
                //window.location.href = '#/clientes'
                redireccionar(1200, '#/clientes')
              } else {
                toast.info(data.data.detail)
              }
            } else {
              toast.error('Registro no se pudo actualizar')
            }
          })
          break
        case 'NUEVO REGISTRO':
          console.log('SOY FUNCION NUEVO')
          Axios.post(URL_API_CREAR_CLIENTE, dataForm, CONFIG_HEADER_AUTH).then((data) => {
            console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro insertado')
                formik.resetForm()
                setEdicionFormulario(false)
                visualizar('/clientes/vista-registro', data.data.result.insertId)
              } else {
                toast.info(data.data.detail)
              }
            } else {
              toast.error('Registro no se pudo insertar')
            }
          })
          break
        default:
          console.log('FUNCION NO DEFINIDA, NO HAGO NADA')
      }
    } else {
      toast.error('Accion no permitida')
    }
  }

  return (
    <>
      <CForm className="g-3" onSubmit={formik.handleSubmit}>
        <CRow className="mt-2 mb-2">
          <CCol md={2}>
            <CFormInput
              type="text"
              id="codigo"
              name="codigo"
              disabled
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.codigo}
              className="text-center"
            />
            {/* {formik.errors.codigo ? (
              <span className="text-danger">{formik.errors.codigo} </span>
            ) : null} */}
          </CCol>
        </CRow>
        <CRow className="mb-2">
          <CCol>
            <CAccordion alwaysOpen flush activeItemKey={1}>
              {/* DATOS BASICOS */}
              <CAccordionItem className={'mt-2 border'} itemKey={1}>
                <CAccordionHeader>DATOS BASICOS</CAccordionHeader>
                <CAccordionBody>
                  <fieldset disabled={!edicionFormulario}>
                    <CRow className="mb-2">
                      <CCol md={4} className="mt-2">
                        <label className="text-uppercase">Tipo de cliente</label>
                        <CFormSelect
                          id="tipoCliente"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.tipoCliente}
                          className={formik.errors.tipoCliente && 'form-control border-danger'}
                        >
                          <option key="tipoCliente_0" value="">
                            -- TIPO CLIENTE --
                          </option>
                          <option key="tipoCliente_1" value="P">
                            Persona
                          </option>
                          <option key="tipoCliente_2" value="E">
                            Empresa
                          </option>
                        </CFormSelect>
                        {formik.errors.tipoCliente ? (
                          <span className="text-danger">{formik.errors.tipoCliente} </span>
                        ) : null}
                      </CCol>
                      <CCol md={4} className="mt-2">
                        <label className="text-uppercase">Tipo de identificación</label>
                        <CFormSelect
                          id="tipoIdentificacion"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.tipoIdentificacion}
                          className={
                            formik.errors.tipoIdentificacion && 'form-control border-danger'
                          }
                        >
                          <option key="tipoIdentificacion_0" value="">
                            -- TIPO IDENTIFICACION --
                          </option>
                          {listaTiposIdentificaciones.map((tipoIdentificacion) => (
                            <option
                              key={'tipoIdentificacion_' + tipoIdentificacion.Codigo}
                              value={tipoIdentificacion.Codigo}
                            >
                              {tipoIdentificacion.Nombre}
                            </option>
                          ))}
                        </CFormSelect>
                        {formik.errors.tipoIdentificacion ? (
                          <span className="text-danger">{formik.errors.tipoIdentificacion} </span>
                        ) : null}
                      </CCol>
                      <CCol md={4} className="mt-2">
                        <label className="text-uppercase">Identificación</label>
                        <CFormInput
                          type="text"
                          id="identificacion"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.identificacion}
                          placeholder="IDENTIFICACIÓN"
                          className={formik.errors.identificacion && 'form-control border-danger'}
                        />
                        {formik.errors.identificacion ? (
                          <span className="text-danger">{formik.errors.identificacion} </span>
                        ) : null}
                      </CCol>
                    </CRow>
                    <CRow className="mb-2">
                      <CCol md={12} className="mt-2">
                        <label className="text-uppercase">Nombre cliente</label>
                        <CFormInput
                          type="text"
                          id="nombre"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.nombre}
                          placeholder="NOMBRE O RAZÓN SOCIAL"
                          className={formik.errors.nombre && 'form-control border-danger'}
                        />
                        {formik.errors.nombre ? (
                          <span className="text-danger">{formik.errors.nombre} </span>
                        ) : null}
                      </CCol>
                    </CRow>
                    <CRow className="mb-2">
                      <CCol md={3} className="mt-2">
                        <label className="text-uppercase">Dirección</label>
                        <CFormSelect
                          id="departamento"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.departamento}
                          className={formik.errors.departamento && 'form-control border-danger'}
                        >
                          <option key="departamento_0" value="">
                            -- DEPARTAMENTO --
                          </option>
                          {listaDepartamentos.map((departamento) => (
                            <option
                              key={'departamento_' + departamento.Codigo}
                              value={departamento.Codigo}
                            >
                              {departamento.Nombre}
                            </option>
                          ))}
                        </CFormSelect>
                        {formik.errors.departamento ? (
                          <span className="text-danger">{formik.errors.departamento} </span>
                        ) : null}
                      </CCol>
                      <CCol md={3} className="mt-2">
                        <label className="text-uppercase"></label>
                        <CFormSelect
                          id="municipio"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.municipio}
                          className={formik.errors.municipio && 'form-control border-danger'}
                        >
                          <option key="municipio_0" value="">
                            -- MUNICIPIO --
                          </option>
                          {listaMunicipios.map((municipio) => (
                            <option key={'municipio_' + municipio.Codigo} value={municipio.Codigo}>
                              {municipio.Municipio}
                            </option>
                          ))}
                        </CFormSelect>
                        {formik.errors.municipio ? (
                          <span className="text-danger">{formik.errors.municipio} </span>
                        ) : null}
                      </CCol>
                      <CCol md={6} className="mt-2">
                        <label className="text-uppercase"></label>
                        <CFormInput
                          type="text"
                          id="direccion"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.direccion}
                          className={formik.errors.direccion && 'form-control border-danger'}
                          placeholder="DIRECCIÓN"
                        />
                        {formik.errors.direccion ? (
                          <span className="text-danger">{formik.errors.direccion} </span>
                        ) : null}
                      </CCol>
                    </CRow>
                    <CRow className="mb-2">
                      <CCol md={3} className={'mt-2'}>
                        <label className="text-uppercase">Teléfono</label>
                        <CFormInput
                          type="text"
                          id="telefono"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.telefono}
                          placeholder="TELÉFONO(S)"
                          className={formik.errors.telefono && 'form-control border-danger'}
                        />
                        {formik.errors.telefono ? (
                          <span className="text-danger">{formik.errors.telefono} </span>
                        ) : null}
                      </CCol>
                      <CCol md={9} className={'mt-2'}>
                        <label className="text-uppercase">Email contacto</label>
                        <CFormInput
                          type="text"
                          id="email"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.email}
                          placeholder="CORREO(S) ELECTRÓNICO(S)"
                          className={formik.errors.email && 'form-control border-danger'}
                        />
                        {formik.errors.email ? (
                          <span className="text-danger">{formik.errors.email} </span>
                        ) : null}
                      </CCol>
                    </CRow>
                  </fieldset>
                </CAccordionBody>
              </CAccordionItem>
              {/* SERVICIOS Y CARGABILIDAD */}
              <CAccordionItem className={'mt-3 border'} itemKey={2}>
                <CAccordionHeader>SERVICIOS Y CARGABILIDAD</CAccordionHeader>
                <CAccordionBody>
                  <fieldset disabled={!edicionFormulario}>
                    <CRow className="mb-22">
                      <CCol md={6} className="mt-2">
                        <label className="text-uppercase">SERVICIOS ACCESIBLES</label>
                        <CFormCheck
                          id="serviAC"
                          label="Servicio de contabilidad"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.serviAC}
                          checked={formik.values.serviAC}
                          className={formik.values.serviAC ? 'text-success' : ''}
                        />
                        <CFormCheck
                          id="serviRF"
                          label="Servicio de revisoría fiscal"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.serviRF}
                          checked={formik.values.serviRF}
                          className={formik.values.serviRF ? 'text-success' : ''}
                        />
                        <CFormCheck
                          id="serviAT"
                          label="Servicio de tributaria"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.serviAT}
                          checked={formik.values.serviAT}
                          className={formik.values.serviAT ? 'text-success' : ''}
                        />
                      </CCol>
                      <CCol md={6} className="mt-2">
                        <label name="lblArea" id="lblArea" className="text-uppercase">
                          AREAS ACCESIBLES
                        </label>
                        {listaAreas.length > 0 ? (
                          listaAreas.map((area) => (
                            <CFormCheck
                              key={'AREAS_' + area.Codigo}
                              id={'AREAS_' + area.Codigo}
                              name="areas"
                              value={area.Codigo}
                              label={`
                      ${area.Estado === 'Activa' ? ' + ' : ' - '} ${area.Nombre} `}
                              onChange={(e) => {
                                //console.log('Areas ', JSON.stringify(formik.values.areas))
                                const areasForm = formik.values.areas
                                let ntf = areasForm
                                if (e.target.checked) {
                                  if (!ntf.includes(parseInt(e.target.value))) {
                                    ntf.push(parseInt(e.target.value))
                                  }
                                } else {
                                  formik.values.areas = areasForm.filter(
                                    (item) => item !== parseInt(e.target.value),
                                  )
                                }
                                formik.handleBlur(e)
                              }}
                              //onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              checked={formik.initialValues.areas.includes(area.Codigo)}
                              className={
                                formik.initialValues.areas.includes(area.Codigo)
                                  ? 'text-success'
                                  : ''
                              }
                              // value={formik.values.areas}
                            />
                          ))
                        ) : (
                          <p>Esperando respuesta</p>
                        )}
                        {formik.errors.areas ? (
                          <span className="text-danger">{formik.errors.areas} </span>
                        ) : null}
                      </CCol>
                      <CCol md={12} className="mt-2">
                        <label name="lblCelulas" id="lblCelulas" className="text-uppercase">
                          ASIGNACIONES
                        </label>
                        {listaCelulas.length > 0 ? (
                          listaCelulas.map((celula) => (
                            <CFormCheck
                              key={'CELULA_' + celula.Codigo}
                              id={'CELULA_' + celula.Codigo}
                              name="celulas"
                              value={celula.Codigo}
                              label={`
                                ${celula.Estado === 'Activa' ? ' + ' : ' - '} ${celula.Nombre} `}
                              onChange={(e) => {
                                //console.log('Areas ', JSON.stringify(formik.values.celulas))
                                const celulasForm = formik.values.celulas
                                let ntf = celulasForm
                                if (e.target.checked) {
                                  if (!ntf.includes(parseInt(e.target.value))) {
                                    ntf.push(parseInt(e.target.value))
                                  }
                                } else {
                                  formik.values.celulas = celulasForm.filter(
                                    (item) => item !== parseInt(e.target.value),
                                  )
                                }
                                formik.handleBlur(e)
                              }}
                              //onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              checked={formik.initialValues.celulas.includes(celula.Codigo)}
                              className={
                                formik.initialValues.celulas.includes(celula.Codigo)
                                  ? 'text-success'
                                  : ''
                              }
                              // value={formik.values.celulas}
                            />
                          ))
                        ) : (
                          <p>Esperando respuesta</p>
                        )}
                        {formik.errors.celulas ? (
                          <span className="text-danger">{formik.errors.celulas} </span>
                        ) : null}
                      </CCol>
                    </CRow>
                  </fieldset>
                </CAccordionBody>
              </CAccordionItem>
            </CAccordion>
          </CCol>
        </CRow>
        <fieldset disabled={!edicionFormulario}>
          <CRow className="mb-2">
            <CCol>
              <label>ESTADO</label>
              <CFormSwitch
                label="Activo"
                id="estado"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.estado}
                checked={formik.values.estado}
              />
            </CCol>
          </CRow>
        </fieldset>
        <CRow>
          <CCol>
            {edicionFormulario && (
              <>
                <CButton color="primary" type="submit">
                  <CIcon icon={cilSend} /> Guardar
                </CButton>
                <CButton className="ms-2" color="secondary" onClick={cancelarAccion}>
                  <CIcon icon={cilLockLocked} /> Cancelar
                </CButton>
              </>
            )}
          </CCol>
        </CRow>
        <ToastContainer position="bottom-center" autoClose={1000} />
      </CForm>
      {!edicionFormulario && (
        <CButton color="primary" onClick={desbloquearFormulario}>
          <CIcon icon={cilLockUnlocked} /> {_id ? 'Editar' : 'Nuevo'}
        </CButton>
      )}
    </>
  )
}

export default Vista
