import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'

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
  CFormTextarea,
  CRow,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { cilDescription, cilSend } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//const URL_API_AREA = process.env.REACT_APP_API_AREA_POR_CODIGO + '/100'
const URL_API_CREAR_AREA = process.env.REACT_APP_API_AREA_INSERTAR

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
  notas: Yup.string(),
  estado: Yup.boolean(),
})

const Formulario = () => {
  //const [datosArea, setDatosArea] = useState([])
  //const { _id } = useParams()
  //console.log(_id)
  // useEffect(() => {
  //   Axios.get(URL_API_AREA).then((data) => {
  //     setDatosArea(data.data)
  //     //console.log('DATOS AREA', data.data)
  //   })
  // }, [])

  const formik = useFormik({
    initialValues: {
      codigo: 'D0',
      nombre: '',
      notas: '',
      estado: true,
    },
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      //alert(JSON.stringify(values, null, 2))
      sendData(values)
      //formik.resetForm()
    },
  })

  const sendData = async (dataForm) => {
    Axios.post(URL_API_CREAR_AREA, dataForm).then((data) => {
      console.log(data)
      if (data.data) {
        toast.success('Registro insertado') && <Navigate to="/areas" replace={true} />
        formik.resetForm()
      } else {
        toast.error('Registro no se pudo insertar')
      }
    })
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
            className="mt-3 text-center"
          />
          {/* {formik.errors.codigo ? (
            <span className="text-danger">{formik.errors.codigo} </span>
          ) : null} */}
        </CCol>
      </CRow>
      <CCol md={12} className="mt-2 mb-3">
        <label>
          <strong>NOMBRE DEL AREA</strong>
        </label>
        <CFormInput
          type="text"
          id="nombre"
          name="nombre"
          feedback="Por favor, digita el nombre del area a registrar"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.nombre}
          className={formik.errors.nombre && 'form-control border-danger'}
        />
        {formik.errors.nombre ? <span className="text-danger">{formik.errors.nombre} </span> : null}
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
          label="Activo"
          id="estadoArea"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.estado}
          checked={formik.values.estado}
        />
      </CCol>
      <CCol xs={12}>
        <CButton color="primary" type="submit">
          <CIcon icon={cilSend} /> Guardar
        </CButton>
      </CCol>
      <ToastContainer position="bottom-center" autoClose={1000} />
    </CForm>
  )
}

export default Vista
