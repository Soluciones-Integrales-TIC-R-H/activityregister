import React, { useState, useEffect } from 'react'
import { Navigate, redirect } from 'react-router-dom'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CForm,
  CFormInput,
  CFormSwitch,
  CRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilDescription, cilSend } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//const URL_API_ACTIVIDAD = process.env.REACT_APP_API_ACTIVIDAD_POR_CODIGO + '/10000'
const URL_API_ETAPAS = process.env.REACT_APP_API_ETAPAS_ACTIVAS
const URL_API_CREAR_ACTIVIDAD = process.env.REACT_APP_API_ACTIVIDAD_INSERTAR

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
  etapas: Yup.array().required('Campo requerido').min(1, 'Campo requerido'),
  notas: Yup.string(),
  estadoActividad: Yup.boolean(),
})

const Formulario = () => {
  const [etapasList, setEtapasList] = useState([])
  //const [datosActividad, setDatosActividad] = useState([])
  //const { _id } = useParams()
  //console.log(_id)
  useEffect(() => {
    Axios.get(URL_API_ETAPAS).then((data) => {
      setEtapasList(data.data)
    })
    // Axios.get(URL_API_ACTIVIDAD).then((data) => {
    //   setDatosActividad(data.data)
    //   //console.log('DATOS ACTIVIDAD', data.data)
    // })
  }, [])

  const formik = useFormik({
    initialValues: {
      codigo: 'D0',
      nombre: '',
      etapas: '[]',
      estadoActividad: true,
    },
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      //alert(JSON.stringify(values, null, 2))
      sendData(values)
      //formik.resetForm()
    },
  })

  useEffect(() => {
    console.log('Cambio', formik.values)
  }, [formik.values])

  const sendData = async (dataForm) => {
    Axios.post(URL_API_CREAR_ACTIVIDAD, dataForm).then((data) => {
      console.log(data)
      if (data.data) {
        toast.success('Registro insertado')
        formik.resetForm()
        return redirect('/login')
      } else {
        toast.error('Registro no se pudo insertar')
      }
    })
  }

  return (
    <>
      <CForm className="row g-3" onSubmit={formik.handleSubmit}>
        <CCol md={12} className="mb-3">
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
            <label className="text-uppercase">
              <strong>Nombre de la actividad</strong>
            </label>
            <CFormInput
              type="text"
              id="nombre"
              name="nombre"
              feedback="Por favor, digita el nombre de la actividad."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nombre}
              className={formik.errors.nombre && 'form-control border-danger'}
            />
            {formik.errors.nombre ? (
              <span className="text-danger">{formik.errors.nombre} </span>
            ) : null}
          </CCol>
          <CCol md={12} className={formik.errors.etapas && 'mt-2 mb-3 border border-danger'}>
            <label>
              <strong>ETAPAS ASOCIADAS A LA ACTIVIDAD</strong>
            </label>
            {etapasList.map((etapa) => (
              <CFormCheck
                key={'ETAPA_' + etapa.Codigo}
                id={'ETAPA_' + etapa.Codigo}
                name="etapas"
                value={etapa.Codigo}
                label={etapa.Nombre + ' (' + etapa.AreasAsociadas + ')'}
                title={etapa.AreasAsociadas}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // value={formik.values.etapas}
              />
            ))}
            {formik.errors.etapas ? (
              <span className="text-danger">{formik.errors.etapas} </span>
            ) : null}
          </CCol>
          <CCol md={12} className="mt-2 mb-3">
            <label>
              <strong>ESTADO</strong>
            </label>
            <CFormSwitch
              label="Activa"
              id="estadoActividad"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.estadoActividad}
              checked={formik.values.estadoActividad}
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
    </>
  )
}

export default Vista
