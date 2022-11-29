import React, { useState, useEffect } from 'react'
//import AlertSwal from '../../components/AppAlert'
import { useFormik, Formik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CFormSwitch,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { DocsExample } from 'src/components'

const URL_API_AREAS = process.env.REACT_APP_API_AREAS
const URL_API_CLIENTES = process.env.REACT_APP_API_CLIENTE_POR_AREA
const URL_API_ETAPAS = process.env.REACT_APP_API_ETAPA_POR_AREA
const URL_API_ACTIVIDADES = process.env.REACT_APP_API_ACTIVIDADES_POR_ETAPA

const FormularioSchema = Yup.object({
  codigo: Yup.string().required('Campo requerido'),
  email: Yup.string()
    .email('Dirección de correo electrónico no válida')
    .required('Campo requerido'),
  nombre: Yup.string().required('Campo requerido'),
  fechaInicial: Yup.date('Fecha incorrecta').required('Campo requerido'),
  fechaFinal: Yup.date(),
  area: Yup.number().required('Campo requerido').positive().integer(),
  cliente: Yup.string().required('Campo requerido'),
  etapa: Yup.string().required('Campo requerido'),
  actividades: Yup.array().required('Campo requerido').min(1, 'Campo requerido'),
  tiempo: Yup.number().required('Campo requerido'),
  notas: Yup.string(),
  seguimiento: Yup.boolean(),
})

const Formulario = () => {
  const [areaList, setAreaList] = useState([])
  const [clienteList, setClienteList] = useState([])
  const [etapaList, setEtapaList] = useState([])
  const [actividadList, setActividadList] = useState([])

  const [stateAreaControl, setStateAreaControl] = useState('')
  const [stateEtapaControl, setStateEtapaControl] = useState('')

  //const [validated, setValidated] = useState(false)

  useEffect(() => {
    Axios.get(URL_API_AREAS).then((data) => {
      setAreaList(data.data)
    })
  }, [])

  const fecha = new Date()
  const hoy =
    fecha.getFullYear() +
    '-' +
    (fecha.getMonth() + 1) +
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
      fecharegistro: new Date().toISOString(),
      codigo: 'D0',
      email: 'drenteria@dobleaasesorias.com',
      nombre: 'Duhan Enrique Renteria Hernandez',
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
      alert(JSON.stringify(values, null, 2))
      sendData(values)
      formik.resetForm()
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
        formik.values.actividades = []
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
      setActividadList([])
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
      Axios.get(URL_API_ACTIVIDADES + '/' + formik.values.etapa).then((data) => {
        //console.log(data.data)
        setActividadList(data.data)
      })
    } else {
      setClienteList([])
      setEtapaList([])
      setActividadList([])
      formik.values.actividades = []
    }
  }, [formik.values])

  const sendData = async (dataForm) => {
    //setLoading(true);
    //simulateNetworkRequest();
    // const data = await SEND_EMAIL(dataForm);
    // if (data) {
    //   alertService('success', 'Se ha enviado el mensaje');
    // }
    // setLoading(false);
    console.log('Datos formulario ', dataForm)
    //AlertSwal('success', 'Autorización', dataForm, 'Cerrar', '')
  }

  return (
    <CForm className="row g-3" onSubmit={formik.handleSubmit}>
      <CRow>
        <CCol md={2}>
          <CFormInput
            type="text"
            id="codigo"
            name="codigo"
            disabled
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.codigo}
            className={
              formik.errors.codigo
                ? 'mt-3 form-control border-danger'
                : 'mt-3 form-control border-success'
            }
          />
          {/* {formik.errors.codigo ? (
            <span className="text-danger">{formik.errors.codigo} </span>
          ) : null} */}
        </CCol>
      </CRow>
      <CCol md={6}>
        <label className="text-uppercase">
          <strong>Email del responsable</strong>
        </label>
        <CFormInput
          type="email"
          id="email"
          name="email"
          feedback="Por favor, digita tú email empresarial"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className={
            formik.errors.email ? 'form-control border-danger' : 'form-control border-success'
          }
        />
        {formik.errors.email ? <span className="text-danger">{formik.errors.email} </span> : null}
      </CCol>
      <CCol md={6}>
        <label className="text-uppercase">
          <strong>Nombre del responsable</strong>
        </label>
        <CFormInput
          type="text"
          id="nombre"
          name="nombre"
          feedback="Por favor, digita tú nombre completo."
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.nombre}
          className={
            formik.errors.nombre ? 'form-control border-danger' : 'form-control border-success'
          }
        />
        {formik.errors.nombre ? <span className="text-danger">{formik.errors.nombre} </span> : null}
      </CCol>
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
          className={
            formik.errors.fechaInicial
              ? 'form-control border-danger'
              : 'form-control border-success'
          }
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
          className={
            formik.errors.fechaFinal ? 'form-control border-danger' : 'form-control border-success'
          }
        />
        {formik.errors.fechaFinal ? (
          <span className="text-danger">{formik.errors.fechaFinal} </span>
        ) : null}
      </CCol>
      <CCol md={6}>
        <label className="text-uppercase">
          <strong>Area de registro</strong>
        </label>
        <CFormSelect
          id="area"
          aria-label="Default select area"
          feedback="Por favor, selecciona una opción de la lista"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.area}
          className={
            formik.errors.area ? 'form-control border-danger' : 'form-control border-success'
          }
        >
          <option key="area_0" value="">
            -- SELECCION AREA --
          </option>
          {areaList.map((area) => (
            <option key={'area_' + area.CodArea} value={area.CodArea}>
              {area.NameArea}
            </option>
          ))}
        </CFormSelect>
        {formik.errors.area ? <span className="text-danger">{formik.errors.area} </span> : null}
      </CCol>
      <CCol md={12}>
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
          className={
            formik.errors.cliente ? 'form-control border-danger' : 'form-control border-success'
          }
        >
          <option key="cliente_0" value="">
            -- SELECCION CLIENTE --
          </option>
          {clienteList.map((cliente) => (
            <option key={'cliente_' + cliente.CodCliente} value={cliente.CodCliente}>
              {cliente.NameCliente}
            </option>
          ))}
        </CFormSelect>
        {formik.errors.cliente ? (
          <span className="text-danger">{formik.errors.cliente} </span>
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
          className={
            formik.errors.etapa ? 'form-control border-danger' : 'form-control border-success'
          }
        >
          <option key="etapa_0" value="">
            -- SELECCION ETAPA --
          </option>
          {etapaList.map((etapa) => (
            <option key={'etapa_' + etapa.CodEtapa} value={etapa.CodEtapa}>
              {etapa.NameEtapa}
            </option>
          ))}
        </CFormSelect>
        {formik.errors.etapa ? <span className="text-danger">{formik.errors.etapa} </span> : null}
      </CCol>
      <CCol md={6}>
        <label className="text-uppercase">
          <strong>Actividades</strong>
        </label>
        <CFormSelect
          id="actividades"
          aria-label="Default select actividades"
          feedback="Por favor, selecciona una o varias opciones de la lista"
          multiple
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.actividades}
          className={
            formik.errors.actividades ? 'form-control border-danger' : 'form-control border-success'
          }
        >
          <option key="actividad_0" value="" disabled>
            -- SELECCION ACTIVIDADES --
          </option>
          {actividadList.map((actividad) => (
            <option key={'actividad_' + actividad.CodActividad} value={actividad.CodActividad}>
              {actividad.NameActividad}
            </option>
          ))}
        </CFormSelect>
        {formik.errors.actividades ? (
          <span className="text-danger">{formik.errors.actividades} </span>
        ) : null}
      </CCol>
      <CCol md={2}>
        <label className="text-uppercase">
          <strong>Tiempo dedicado</strong>
        </label>
        <CFormSelect
          id="tiempo"
          aria-label="Select tiempo"
          feedback="Por favor, selecciona una opción de la lista"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.tiempo}
          className={
            formik.errors.tiempo
              ? 'mb-3 form-control border-danger'
              : 'mb-3 form-control border-success'
          }
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
        {formik.errors.tiempo ? <span className="text-danger">{formik.errors.tiempo} </span> : null}
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
          className={
            formik.errors.notas ? 'form-control border-danger' : 'form-control border-success'
          }
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
        <CButton color="primary" type="submit">
          Submit form
        </CButton>
      </CCol>
    </CForm>
  )
}

const Vista = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Formulario</strong> <small>Registro de actividad</small>
          </CCardHeader>
          <CCardBody>
            {/* <p className="text-medium-emphasis small">
              For custom CoreUI form validation messages, you&#39;ll need to add the{' '}
              <code>noValidate</code> boolean property to your <code>&lt;CForm&gt;</code>. This
              disables the browser default feedback tooltips, but still provides access to the form
              validation APIs in JavaScript. Try to submit the form below; our JavaScript will
              intercept the submit button and relay feedback to you. When attempting to submit,
              you&#39;ll see the <code>:invalid</code> and <code>:valid</code> styles applied to
              your form controls.
            </p>
            <p className="text-medium-emphasis small">
              Custom feedback styles apply custom colors, borders, focus styles, and background
              icons to better communicate feedback.{' '}
            </p> */}
            {/* <DocsExample href="forms/validation">{CustomStyles()}</DocsExample> */}
            <Formulario />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Vista
