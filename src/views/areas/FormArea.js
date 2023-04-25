import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
import { cilDescription, cilLockLocked, cilLockUnlocked, cilSend } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { refreshPage, descifrar, redireccionar } from 'src/utilities/utilidades'
import { visualizar } from 'src/services/AccionesCrud'
import { CONFIG_HEADER_AUTH } from 'src/utilities/config'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { Page404 } from '../pages/page404/Page404'

const URL_API_AREA = process.env.REACT_APP_API_AREA_POR_CODIGO
const URL_API_CREAR_AREA = process.env.REACT_APP_API_AREA_INSERTAR
const URL_API_ACTUALIZAR_AREA = process.env.REACT_APP_API_AREA_ACTUALIZAR

const Vista = () => {
  const { _id } = useParams()
  const [tituloModulo, setTituloModulo] = useState('Nuevo registro')
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="text-primaryy text-uppercase">
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
  nombre: Yup.string().required('Campo requerido'),
  notas: Yup.string(),
  estado: Yup.boolean(),
  editable: Yup.boolean(),
})

// eslint-disable-next-line react/prop-types
const Formulario = ({ _id = undefined, setTituloModulo = '', tituloModulo = '' }) => {
  const [datosArea, setDatosArea] = useState([])
  const [edicionFormulario, setEdicionFormulario] = useState(false)
  const [initialValues, setInitialValues] = useState({
    codigo: 'D0',
    nombre: '',
    notas: '',
    estado: true,
    editable: true,
  })

  const cargarDatos = async () => {
    if (_id !== undefined) {
      const textoDescifrado = descifrar(_id)
      try {
        await Axios.get(`${URL_API_AREA}/${textoDescifrado}`, CONFIG_HEADER_AUTH).then((data) => {
          console.log(data.data)
          if (data.data) {
            setDatosArea(data.data)
            //console.log(data.data)
            setInitialValues(
              (initialValues.codigo = '' + data.data.result.Codigo),
              (initialValues.nombre = data.data.result.Nombre),
              (initialValues.notas = ''),
              (initialValues.estado = data.data.result.Estado === 'Activa' ? true : false),
              (initialValues.editable = data.data.result.Editable === 'Si' ? true : false),
            )
            console.log('Soy initialValues dentro de cargaDatos', initialValues)
          }
          console.log('DATOS AREA', data.data.result)
          console.log('[DATOS AREA]', datosArea)
        })
      } catch (error) {
        console.log('Error', error)
      }
    } else {
      setInitialValues(
        (initialValues.codigo = 'D0'),
        (initialValues.nombre = ''),
        (initialValues.notas = ''),
        (initialValues.estado = true),
        (initialValues.editable = true),
      )
    }
  }

  useEffect(() => {
    setEdicionFormulario(false)
    setInitialValues({
      codigo: 'D0',
      nombre: '',
      notas: '',
      estado: true,
      editable: true,
    })
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
    if (datosArea[0]) {
      setInitialValues({
        codigo: datosArea[0].Codigo.toString(),
        nombre: datosArea[0].Nombre,
        notas: '',
        estado: datosArea[0].Estado === 'Activa' ? true : false,
        editable: datosArea[0].Editable === 'Si' ? true : false,
      })
    } else {
      setInitialValues({
        codigo: 'D0',
        nombre: '',
        notas: '',
        estado: true,
        editable: true,
      })
    }
    setEdicionFormulario(false)
    refreshPage()
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      sendData(values)
      //formik.resetForm()
    },
  })

  const sendData = async (dataForm) => {
    console.log('Edicion Formulario: ', edicionFormulario)
    console.log('Titulo Formulario: ', tituloModulo)
    if (edicionFormulario && tituloModulo !== '') {
      switch (tituloModulo.toUpperCase()) {
        case 'EDITAR REGISTRO':
          console.log('SOY FUNCION EDITAR')
          Axios.put(URL_API_ACTUALIZAR_AREA, dataForm, CONFIG_HEADER_AUTH).then((data) => {
            console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro actualizado')
                formik.resetForm()
                setEdicionFormulario(false)
                //window.location.href = '#/areas'
                redireccionar(1200, '#/areas')
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
          Axios.post(URL_API_CREAR_AREA, dataForm, CONFIG_HEADER_AUTH).then((data) => {
            console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro insertado')
                formik.resetForm()
                setEdicionFormulario(false)
                visualizar('/areas/vista-registro', data.data.result.insertId)
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
      <fieldset disabled={!edicionFormulario}>
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
            {formik.errors.nombre ? (
              <span className="text-danger">{formik.errors.nombre} </span>
            ) : null}
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
            {formik.values.editable && edicionFormulario && (
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
          <ToastContainer position="bottom-center" autoClose={1000} />
        </CForm>
      </fieldset>
      {formik.values.editable && !edicionFormulario && (
        <CButton color="secondary" onClick={desbloquearFormulario}>
          <CIcon icon={cilLockUnlocked} /> {_id ? 'Editar' : 'Nuevo'}
        </CButton>
      )}
    </>
  )
}

export default Vista
