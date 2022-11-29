import React, { useState, useEffect } from 'react'
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
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilCommand, cilDescription, cilEqualizer } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TablaReporte from 'src/components/TablaReporte'
import { nanoid } from 'nanoid'

const URL_API_EVENTOS_REPORTE = process.env.REACT_APP_API_EVENTOS_REPORTE
const URL_API_ELIMINAR_ITEM = process.env.REACT_APP_API_EVENTO_ELIMINAR
const URL_API_RESTAURAR_ITEM = process.env.REACT_APP_API_EVENTO_RESTAURAR

const URL_API_AREAS = process.env.REACT_APP_API_AREAS_ACTIVAS
const URL_API_CLIENTES = process.env.REACT_APP_API_CLIENTE_POR_AREA
const URL_API_ETAPAS = process.env.REACT_APP_API_ETAPA_POR_AREA

//==================================VISTA==================================

const Vista = () => {
  return (
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
  )
}

//==================================COLUMNAS DE TABLA REPORTE==================================

const Columnas = [
  { titulo: 'Codigo', type: 'item', visible: false },
  { titulo: 'Fecha registro', type: 'fecha', visible: false },
  { titulo: 'Fecha evento', type: 'fecha', visible: true },
  //{ titulo: 'Fin', visible: false },
  { titulo: 'Responsable', visible: true },
  { titulo: 'Email', visible: false },
  { titulo: 'CodArea', visible: false },
  { titulo: 'Area', visible: true },
  { titulo: 'CodCliente', visible: false },
  { titulo: 'Cliente', visible: true },
  { titulo: 'CodEtapa', visible: false },
  { titulo: 'Etapa', visible: true },
  { titulo: 'Actividades', visible: true },
  { titulo: 'Tiempo', visible: true },
  { titulo: 'Observaciones', visible: false },
  { titulo: 'Seguimiento', visible: true },
]

//==================================FORMULARIO==================================
const FormularioSchema = Yup.object({
  fechaInicial: Yup.date('Fecha incorrecta').required('Campo requerido'),
  fechaFinal: Yup.date('Fecha incorrecta').required('Campo requerido'),
  responsable: Yup.string(),
  area: Yup.number().positive().integer(),
  etapa: Yup.string(),
  cliente: Yup.string(),
  seguimiento: Yup.boolean(),
})

const Formulario = () => {
  const [datosEventos, setDatosEventos] = useState([])
  const [loading, setLoading] = useState(false)

  const [areaList, setAreaList] = useState([])
  const [clienteList, setClienteList] = useState([])
  const [funcionarioList, setFuncionarioList] = useState([])
  const [etapaList, setEtapaList] = useState([])

  const [stateAreaControl, setStateAreaControl] = useState('')
  const [stateEtapaControl, setStateEtapaControl] = useState('')

  useEffect(() => {
    const loadData = async () => {
      await Axios.get(URL_API_AREAS).then((data) => {
        console.log('Soy el data', data)
        setAreaList(data.data)
      })

      await Axios.get(
        URL_API_EVENTOS_REPORTE +
          '/area/' +
          (formik.initialValues.area > 0 ? formik.initialValues.area : 'all') +
          '/etapa/' +
          (formik.initialValues.etapa > 0 ? formik.initialValues.etapa : 'all') +
          '/cliente/' +
          (formik.initialValues.cliente > 0 ? formik.initialValues.cliente : 'all') +
          '/responsable/' +
          (formik.initialValues.responsable !== '' ? formik.initialValues.responsable : 'all') +
          '/inicio/' +
          formik.initialValues.fechaInicial +
          '/hasta/' +
          formik.initialValues.fechaFinal,
      ).then((data) => {
        if (data.data) {
          //toast.success('Listado generado')
          setDatosEventos(data.data)
          //formik.resetForm()
        } else {
          toast.error('No se pudo generar el listado')
        }
        setLoading(false)
      })
    }
    setLoading(true)
    loadData()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fecha = new Date()
  const hoy =
    fecha.getFullYear() + '-' + fecha.getMonth() + '-' + fecha.getDate().toString().padStart(2, 0)
  const hoy2 =
    fecha.getFullYear() +
    '-' +
    (fecha.getMonth() + 1) +
    '-' +
    fecha.getDate().toString().padStart(2, 0)

  const formik = useFormik({
    initialValues: {
      fechaInicial: hoy.toString(),
      fechaFinal: hoy2.toString(),
      responsable: '',
      area: '',
      etapa: '',
      cliente: '',
    },
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2))
      sendData(values)
      //formik.resetForm()
    },
  })

  useEffect(() => {
    console.log('Cambio', formik.values)
    setStateAreaControl(formik.values.area)
    setStateEtapaControl(formik.values.etapa)

    if (formik.values.area !== '') {
      if (stateAreaControl !== formik.values.area) {
        //console.log('Cambio el area')
        formik.values.cliente = ''
        formik.values.etapa = ''
      }
      Axios.get(URL_API_ETAPAS + '/' + formik.values.area).then((data) => {
        //console.log(data.data)
        setEtapaList(data.data)
      })
      Axios.get(URL_API_CLIENTES + '/' + formik.values.area).then((datos) => {
        //console.log(datos.data)
        setClienteList(datos.data)
      })
    } else {
      setClienteList([])
      setEtapaList([])
      formik.values.area = ''
      formik.values.cliente = ''
      formik.values.etapa = ''
    }

    if (formik.values.etapa !== '') {
      if (stateEtapaControl !== formik.values.etapa) {
        console.log('Cambio la etapa')
        //formik.values.actividades = []
      }
    } else {
      setClienteList([])
      setEtapaList([])
    }
  }, [formik.values, stateAreaControl, stateEtapaControl])

  const sendData = async (dataForm) => {
    await Axios.get(
      URL_API_EVENTOS_REPORTE +
        '/area/' +
        (dataForm.area > 0 ? dataForm.area : 'all') +
        '/etapa/' +
        (dataForm.etapa > 0 ? dataForm.etapa : 'all') +
        '/cliente/' +
        (dataForm.cliente > 0 ? dataForm.cliente : 'all') +
        '/responsable/' +
        (dataForm.responsable !== '' ? dataForm.responsable : 'all') +
        '/inicio/' +
        dataForm.fechaInicial +
        '/hasta/' +
        dataForm.fechaFinal,
    ).then((data) => {
      console.log('datos ', dataForm)
      if (data.data) {
        toast.success('Listado generado')
        setDatosEventos(data.data)
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
                  max={hoy2.toString()}
                  className={formik.errors.fechaFinal && 'form-control border-danger'}
                />
                {formik.errors.fechaFinal ? (
                  <span className="text-danger">{formik.errors.fechaFinal} </span>
                ) : null}
              </CCol>
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
                >
                  <option key="funcionario_0" value="">
                    TODOS LOS REGISTROS
                  </option>
                  {funcionarioList.map((funcionario) => (
                    <option
                      key={'funcionario_' + funcionario.CodFuncionario}
                      value={funcionario.CodFuncionario}
                    >
                      {funcionario.NameFuncionario}
                    </option>
                  ))}
                </CFormSelect>
                {formik.errors.responsable ? (
                  <span className="text-danger">{formik.errors.responsable} </span>
                ) : null}
              </CCol>
            </CRow>
            <CRow className="mt-2">
              <CCol md={3}>
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
                    TODAS LAS AREAS
                  </option>
                  {areaList.map((area) => (
                    <option key={'area_' + area.Codigo} value={area.Codigo}>
                      {area.Nombre}
                    </option>
                  ))}
                </CFormSelect>
                {formik.errors.area ? (
                  <span className="text-danger">{formik.errors.area} </span>
                ) : null}
              </CCol>
              <CCol md={4}>
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
                    TODAS LAS ETAPAS
                  </option>
                  {etapaList.map((etapa) => (
                    <option key={'etapa_' + etapa.Codigo} value={etapa.Codigo}>
                      {etapa.Nombre}
                    </option>
                  ))}
                </CFormSelect>
                {formik.errors.etapa ? (
                  <span className="text-danger">{formik.errors.etapa} </span>
                ) : null}
              </CCol>
              <CCol md={5}>
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
          <TablaReporte
            columnas={Columnas}
            filas={datosEventos}
            tituloTabla="Eventos"
            nombreTabla="eventos"
            keyPrincipal="CodEvento"
            botonVista={false}
            urlVista="/eventos/vista-registro"
            botonEliminarRestaurar={false}
            urlEliminar={URL_API_ELIMINAR_ITEM}
            urlRestaurar={URL_API_RESTAURAR_ITEM}
            key={'LISTADO_EVENTOS_' + nanoid()}
          />
        </>
      )}
    </>
  )
}

export default Vista
