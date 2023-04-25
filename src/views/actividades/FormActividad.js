import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import { Page404 } from '../pages/page404/Page404'
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
import { cilDescription, cilLockLocked, cilLockUnlocked, cilSend } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { refreshPage, descifrar, redireccionar } from 'src/utilities/utilidades'
import { visualizar } from 'src/services/AccionesCrud'
import { CONFIG_HEADER_AUTH } from 'src/utilities/config'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'

// const URL_API_ETAPAS = process.env.REACT_APP_API_ETAPAS //process.env.REACT_APP_API_ETAPAS_ACTIVAS
// const URL_API_ACTIVIDAD = process.env.REACT_APP_API_ACTIVIDAD_POR_CODIGO
// const URL_API_CREAR_ACTIVIDAD = process.env.REACT_APP_API_ACTIVIDAD_INSERTAR
// const URL_API_ACTUALIZAR_ACTIVIDAD = process.env.REACT_APP_API_ACTIVIDAD_ACTUALIZAR

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
  etapas: Yup.array().required('Campo requerido').min(1, 'Campo requerido'),
  notas: Yup.string(),
  estado: Yup.boolean(),
  editable: Yup.boolean(),
})

// eslint-disable-next-line react/prop-types
const Formulario = ({ _id = undefined, setTituloModulo = '', tituloModulo = '' }) => {
  const URL_API_ETAPAS = _id
    ? process.env.REACT_APP_API_ETAPAS
    : process.env.REACT_APP_API_ETAPAS_ACTIVAS
  const URL_API_ACTIVIDAD = process.env.REACT_APP_API_ACTIVIDAD_POR_CODIGO
  const URL_API_CREAR_ACTIVIDAD = process.env.REACT_APP_API_ACTIVIDAD_INSERTAR
  const URL_API_ACTUALIZAR_ACTIVIDAD = process.env.REACT_APP_API_ACTIVIDAD_ACTUALIZAR
  const [etapasList, setEtapasList] = useState([])
  const [edicionFormulario, setEdicionFormulario] = useState(false)
  const [initialValues, setInitialValues] = useState({
    codigo: 'D0',
    nombre: '',
    etapas: [],
    notas: '',
    estado: true,
    editable: true,
  })
  const [datosActividad, setDatosActividad] = useState([initialValues])

  const cargarDatosActividad = async () => {
    if (_id !== undefined) {
      const textoDescifrado = descifrar(_id)
      let datos
      try {
        await Axios.get(`${URL_API_ACTIVIDAD}/${textoDescifrado}`, CONFIG_HEADER_AUTH).then(
          (data) => {
            //console.log('Carga datos', data.data)
            if (data.data.result) {
              datos = data.data.result
              if (datos.Estado === 'Activa') {
                datos.Estado = true
              } else {
                datos.Estado = false
              }
              if (datos.Editable === 'Si') {
                datos.Editable = true
              } else {
                datos.Editable = false
              }
              setDatosActividad(
                ...datosActividad,
                (datosActividad[0]['codigo'] = datos.Codigo),
                (datosActividad[0]['nombre'] = datos.Nombre),
                (datosActividad[0]['etapas'] = JSON.parse(datos.EtapasAsociadas)),
                (datosActividad[0]['notas'] = ''),
                (datosActividad[0]['estado'] = datos.Estado),
                (datosActividad[0]['editable'] = datos.Editable),
              )
            }
          },
        )
      } catch (error) {
        console.log('Error', error)
      }
    } else {
      setDatosActividad(
        ...datosActividad,
        (datosActividad[0].codigo = 'D0'),
        (datosActividad[0].nombre = ''),
        (datosActividad[0].etapas = []),
        (datosActividad[0].notas = ''),
        (datosActividad[0].estado = true),
        (datosActividad[0].editable = true),
      )
    }
  }

  const cargarEtapas = async () => {
    Axios.get(URL_API_ETAPAS, CONFIG_HEADER_AUTH).then((data) => {
      setEtapasList(data.data.result)
    })
  }

  useEffect(() => {
    setEdicionFormulario(false)
    formik.resetForm()
    cargarDatosActividad()
    cargarEtapas()
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
    cargarDatosActividad()
  }

  const cancelarAccion = () => {
    //console.log('soy cancelar', JSON.stringify(datosActividad))
    cargarDatosActividad()
    setEdicionFormulario(false)
    refreshPage()
  }

  useEffect(() => {
    setInitialValues(datosActividad[0])
    //console.log(initialValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datosActividad])

  const formik = useFormik({
    initialValues,
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      sendData(values)
      //formik.values.etapas = []
      //formik.resetForm()
    },
  })

  // useEffect(() => {
  //   setInitialValues(...initialValues, datosActividad[0])
  //   formik.values.codigo = initialValues.codigo
  //   formik.values.nombre = initialValues.nombre
  //   formik.values.etapas = initialValues.etapas
  //   formik.values.notas = initialValues.notas
  //   //console.log(initialValues)
  //   formik.setValues(initialValues)
  // }, [datosActividad])

  // useEffect(() => {
  //   console.log('Cambio datos formulario', formik.values)
  // }, [formik.values])

  const sendData = async (dataForm) => {
    //console.log('Edicion Formulario: ', edicionFormulario)
    //console.log('Titulo Formulario: ', tituloModulo)
    if (edicionFormulario && tituloModulo !== '') {
      switch (tituloModulo.toUpperCase()) {
        case 'EDITAR REGISTRO':
          //console.log('SOY FUNCION EDITAR')
          Axios.put(URL_API_ACTUALIZAR_ACTIVIDAD, dataForm, CONFIG_HEADER_AUTH).then((data) => {
            //console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro actualizado')
                formik.resetForm()
                setEdicionFormulario(false)
                //window.location.href = '#/actividades'
                redireccionar(1200, '#/actividades')
              } else {
                toast.info(data.data.detail)
              }
            } else {
              toast.error('Registro no se pudo actualizar')
            }
          })
          break
        case 'NUEVO REGISTRO':
          //console.log('SOY FUNCION NUEVO')
          Axios.post(URL_API_CREAR_ACTIVIDAD, dataForm, CONFIG_HEADER_AUTH).then((data) => {
            //console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro insertado')
                formik.resetForm()
                setEdicionFormulario(false)
                visualizar('/actividades/vista-registro', data.data.result.insertId)
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
          <CCol md={12} className="mb-3">
            <CRow>
              <CCol md={2}>
                <CFormInput
                  type="text"
                  id="codigo"
                  name="codigo"
                  disabled={true}
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
                  label={`
                    ${etapa.Estado === 'Activa' ? ' + ' : ' - '} ${etapa.Nombre} `}
                  title={etapa.NombreAreas}
                  onChange={(e) => {
                    //console.log('Etapas ', JSON.stringify(formik.values.etapas))
                    const etapasForm = formik.values.etapas
                    let ntf = etapasForm
                    if (e.target.checked) {
                      if (!ntf.includes(parseInt(e.target.value))) {
                        ntf.push(parseInt(e.target.value))
                      }
                    } else {
                      formik.values.etapas = etapasForm.filter(
                        (item) => item !== parseInt(e.target.value),
                      )
                    }
                    formik.handleBlur(e)
                  }}
                  // onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.initialValues.etapas.includes(etapa.Codigo)}
                  className={
                    formik.initialValues.etapas.includes(etapa.Codigo) ? 'text-success' : ''
                  }
                  //value={formik.values.etapas}
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
                id="estado"
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
