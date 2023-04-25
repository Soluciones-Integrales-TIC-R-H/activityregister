/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
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
  CFormCheck,
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

// const URL_API_AREAS = process.env.REACT_APP_API_AREAS //process.env.REACT_APP_API_AREAS_ACTIVAS
// const URL_API_ETAPA = process.env.REACT_APP_API_ETAPA_POR_CODIGO
// const URL_API_CREAR_ETAPA = process.env.REACT_APP_API_ETAPA_INSERTAR
// const URL_API_ACTUALIZAR_ETAPA = process.env.REACT_APP_API_ETAPA_ACTUALIZAR

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
  areas: Yup.array().required('Campo requerido').min(1, 'Campo requerido'),
  notas: Yup.string(),
  estado: Yup.boolean(),
  editable: Yup.boolean(),
})

// eslint-disable-next-line react/prop-types
const Formulario = ({ _id = undefined, setTituloModulo = '', tituloModulo = '' }) => {
  const URL_API_AREAS = _id
    ? process.env.REACT_APP_API_AREAS
    : process.env.REACT_APP_API_AREAS_ACTIVAS
  const URL_API_ETAPA = process.env.REACT_APP_API_ETAPA_POR_CODIGO
  const URL_API_CREAR_ETAPA = process.env.REACT_APP_API_ETAPA_INSERTAR
  const URL_API_ACTUALIZAR_ETAPA = process.env.REACT_APP_API_ETAPA_ACTUALIZAR
  const [areaList, setAreaList] = useState([])
  const [edicionFormulario, setEdicionFormulario] = useState(false)
  const [initialValues, setInitialValues] = useState({
    codigo: 'D0',
    nombre: '',
    areas: [],
    notas: '',
    estado: true,
    editable: true,
  })

  const [datosEtapa, setDatosEtapa] = useState([initialValues])

  const cargarDatos = async () => {
    if (_id !== undefined) {
      let datos
      const textoDescifrado = descifrar(_id)
      try {
        await Axios.get(`${URL_API_ETAPA}/${textoDescifrado}`, CONFIG_HEADER_AUTH).then((data) => {
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
            setDatosEtapa(
              ...datosEtapa,
              (datosEtapa[0]['codigo'] = datos.Codigo),
              (datosEtapa[0]['nombre'] = datos.Nombre),
              (datosEtapa[0]['areas'] = JSON.parse(datos.AreasAsociadas)),
              (datosEtapa[0]['notas'] = ''),
              (datosEtapa[0]['estado'] = datos.Estado),
              (datosEtapa[0]['editable'] = datos.Editable),
            )
          }
        })
      } catch (error) {
        console.log('Error', error)
      }
    } else {
      setDatosEtapa(
        ...datosEtapa,
        (datosEtapa[0].codigo = 'D0'),
        (datosEtapa[0].nombre = ''),
        (datosEtapa[0].areas = []),
        (datosEtapa[0].notas = ''),
        (datosEtapa[0].estado = true),
        (datosEtapa[0].editable = true),
      )
    }
  }

  const cargarAreas = async () => {
    await Axios.get(URL_API_AREAS, CONFIG_HEADER_AUTH).then((data) => {
      setAreaList(data.data.result)
    })
  }

  useEffect(() => {
    //console.log('datosCliente', JSON.stringify(datosCliente[0]))
    formik.resetForm()
    setInitialValues(datosEtapa[0])
    formik.initialValues = initialValues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datosEtapa, setDatosEtapa])

  useEffect(() => {
    setEdicionFormulario(false)
    formik.resetForm()
    cargarDatos()
    cargarAreas()
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
    console.log('soy cancelar', JSON.stringify(datosEtapa))
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
  //   setInitialValues(...initialValues, datosEtapa[0])
  //   formik.values.codigo = initialValues.codigo
  //   formik.values.nombre = initialValues.nombre
  //   formik.values.areas = initialValues.areas
  //   formik.values.notas = initialValues.notas
  //   //console.log(initialValues)
  //   formik.setValues(initialValues)
  // }, [datosEtapa])

  // useEffect(() => {
  //   console.log('Cambio datos formulario', formik.values)
  // }, [formik.values])

  const sendData = async (dataForm) => {
    console.log('Edicion Formulario: ', edicionFormulario)
    console.log('Titulo Formulario: ', tituloModulo)
    if (edicionFormulario && tituloModulo !== '') {
      switch (tituloModulo.toUpperCase()) {
        case 'EDITAR REGISTRO':
          console.log('SOY FUNCION EDITAR')
          Axios.put(URL_API_ACTUALIZAR_ETAPA, dataForm, CONFIG_HEADER_AUTH).then((data) => {
            console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro actualizado')
                formik.resetForm()
                setEdicionFormulario(false)
                //window.location.href = '#/etapas'
                redireccionar(1200, '#/etapas')
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
          Axios.post(URL_API_CREAR_ETAPA, dataForm, CONFIG_HEADER_AUTH).then((data) => {
            console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro insertado')
                formik.resetForm()
                setEdicionFormulario(false)
                visualizar('/etapas/vista-registro', data.data.result.insertId)
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
          <CCol md={12}>
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
                  // onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.initialValues.areas.includes(area.Codigo)}
                  className={formik.initialValues.areas.includes(area.Codigo) ? 'text-success' : ''}
                  // value={formik.values.areas}
                />
              ))}
              {formik.errors.areas ? (
                <span className="text-danger">{formik.errors.areas} </span>
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
