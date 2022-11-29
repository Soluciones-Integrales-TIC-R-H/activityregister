import React, { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
//import AlertSwal from '../../components/AppAlert'
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
  CFormCheck,
  CFormInput,
  CFormSwitch,
  CFormTextarea,
  CRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilDescription, cilSend } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const URL_API_AREAS = process.env.REACT_APP_API_AREAS_ACTIVAS
const URL_API_ETAPA = process.env.REACT_APP_API_ETAPA_POR_CODIGO + '/1004'
const URL_API_CREAR_ETAPA = process.env.REACT_APP_API_ETAPA_INSERTAR

const Vista = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="text-primaryy text-uppercase">
            <CIcon icon={cilDescription} size="xl" />
            <strong> Nuevo registro</strong>
          </CCardHeader>
          <CCardBody>
            <Formulario />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

const FormularioSchema = Yup.object({
  codigo: Yup.string().required('Campo requerido'),
  nombre: Yup.string().required('Campo requerido'),
  areas: Yup.array().required('Campo requerido').min(1, 'Campo requerido'),
  notas: Yup.string(),
  estadoEtapa: Yup.boolean(),
})

const Formulario = () => {
  const [areaList, setAreaList] = useState([])
  const [datosEtapa, setDatosEtapa] = useState([])
  const { _id } = useParams()
  //console.log(_id)
  useEffect(() => {
    Axios.get(URL_API_AREAS).then((data) => {
      setAreaList(data.data)
    })
    Axios.get(URL_API_ETAPA).then((data) => {
      setDatosEtapa(data.data)
      //console.log('DATOS ETAPA', data.data)
    })
  }, [])

  const formik = useFormik({
    initialValues: {
      codigo: 'D0',
      nombre: '',
      areas: '[]',
      notas: '',
      estadoEtapa: true,
    },
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2))
      sendData(values)
      //formik.values.areas = []
      //formik.resetForm()
    },
  })

  // useEffect(() => {
  //   console.log('Cambio', formik.values)
  // }, [formik.values])

  const sendData = async (dataForm) => {
    Axios.post(URL_API_CREAR_ETAPA, dataForm).then((data) => {
      console.log(data)
      if (data.data) {
        toast.success('Registro insertado') && <Navigate to="/etapas" replace={true} />
        formik.values.areas = []
        formik.resetForm()
      } else {
        toast.error('Registro no se pudo insertar')
      }
    })
  }

  return (
    <CForm className="row g-3" onSubmit={formik.handleSubmit}>
      <CCol md={12}>
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
              className="mt-3 text-center"
            />
            {/* {formik.errors.codigo ? (
            <span className="text-danger">{formik.errors.codigo} </span>
          ) : null} */}
          </CCol>
        </CRow>
        <CCol md={12} className="mt-2 mb-3">
          <label>
            <strong>NOMBRE DE LA ETAPA</strong>
          </label>
          <CFormInput
            type="text"
            id="nombre"
            name="nombre"
            feedback="Por favor, digita el nombre de la etapa."
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nombre}
            className={formik.errors.nombre && 'form-control border-danger'}
          />
          {formik.errors.nombre ? (
            <span className="text-danger">{formik.errors.nombre} </span>
          ) : null}
        </CCol>
        <CCol md={12} className={formik.errors.areas && 'mt-2 mb-3 border border-danger'}>
          <label className="text-uppercase">
            <strong>Areas asociadas a la etapa</strong>
          </label>
          {areaList.map((area) => (
            <CFormCheck
              key={'AREA_' + area.Codigo}
              id={'AREA_' + area.Codigo}
              name="areas"
              value={area.Codigo}
              label={area.Nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              // value={formik.values.areas}
            />
          ))}
          {formik.errors.areas ? <span className="text-danger">{formik.errors.areas} </span> : null}
        </CCol>
        <CCol md={12} className="mt-2 mb-3">
          <label>
            <strong>OBSERVACIONES</strong>
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
        <CCol md={12} className="mt-2 mb-3">
          <label>
            <strong>ESTADO</strong>
          </label>
          <CFormSwitch
            label="Activa"
            id="estadoEtapa"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.estadoEtapa}
            checked={formik.values.estadoEtapa}
          />
        </CCol>
        <CCol xs={12}>
          <CButton color="primary" type="submit">
            <CIcon icon={cilSend} /> Guardar
          </CButton>
        </CCol>
      </CCol>
      {/* <CCol md={6}>ACTIVIDADES ASOCIADAS</CCol> */}
      <ToastContainer position="bottom-center" autoClose={1000} />
    </CForm>
  )
}

export default Vista
