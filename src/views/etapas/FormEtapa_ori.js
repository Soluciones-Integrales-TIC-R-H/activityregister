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

import { refreshPage, descifrar, destroyArray } from 'src/utilities/utilidades'
import { visualizar } from 'src/services/AccionesCrud'

const URL_API_AREAS = process.env.REACT_APP_API_AREAS_ACTIVAS
const URL_API_ETAPA = process.env.REACT_APP_API_ETAPA_POR_CODIGO
const URL_API_CREAR_ETAPA = process.env.REACT_APP_API_ETAPA_INSERTAR
const URL_API_ACTUALIZAR_ETAPA = process.env.REACT_APP_API_ETAPA_ACTUALIZAR

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
            <Formulario _id={_id} setTituloModulo={setTituloModulo} tituloModulo={tituloModulo} />
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
})

// eslint-disable-next-line react/prop-types
const Formulario = ({ _id = undefined, setTituloModulo = '', tituloModulo = '' }) => {
  const [areaList, setAreaList] = useState([])
  const [datosEtapa, setDatosEtapa] = useState([])
  const [edicionFormulario, setEdicionFormulario] = useState(false)
  const [initialValues, setInitialValues] = useState({
    // codigo: 'D0',
    // nombre: '',
    // areas: '[]',
    // notas: '',
    // estado: true,
  })

  const cargarDatos = async () => {
    if (_id !== undefined) {
      const textoDescifrado = descifrar(_id)
      try {
        await Axios.get(`${URL_API_ETAPA}/${textoDescifrado}`).then((data) => {
          console.log('Soy los datos del Back', data.data)
          if (data.data) {
            setDatosEtapa(data.data)
            //console.log(data.data)
            // setInitialValues(
            //   (initialValues.codigo = data.data[0].Codigo),
            //   (initialValues.nombre = data.data[0].Nombre),
            //   (initialValues.areas = destroyArray(data.data[0].AreasAsociadas)),
            //   (initialValues.notas = ''),
            //   (initialValues.estado = data.data[0].Estado === 'Activa' ? true : false),
            // )
            setInitialValues({
              ...initialValues,
              codigo: data.data[0].Codigo,
              nombre: data.data[0].Nombre,
              areas: destroyArray(data.data[0].AreasAsociadas),
              notas: '',
              estado: data.data[0].Estado === 'Activa' ? true : false,
            })
            console.log('Soy initialValues dentro de cargaDatos', initialValues)
          }
          console.log('DATOS ETAPA DEL RESULT', data.data[0])
          console.log('[DATOS ETAPA STATE]', datosEtapa)
          console.log(datosEtapa.length)
        })
      } catch (error) {
        console.log('Error', error)
      }
    } else {
      setInitialValues({
        ...initialValues,
        codigo: 'D0',
        nombre: '',
        areas: '[]',
        notas: '',
        estado: true,
      })
    }
  }

  useEffect(() => {
    setEdicionFormulario(false)
    setInitialValues({
      ...initialValues,
      codigo: 'D0',
      nombre: '',
      areas: '[]',
      notas: '',
      estado: true,
    })
    cargarDatos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    Axios.get(URL_API_AREAS).then((data) => {
      setAreaList(data.data)
    })
  }, [])

  useEffect(() => {
    console.log('Soy initialValues useEffect ', initialValues)
  }, [initialValues])

  useEffect(() => {
    console.log('Datos ', datosEtapa[0])
    // setInitialValues({
    //   codigo: datosEtapa[0].Codigo,
    //   nombre: datosEtapa[0].Nombre,
    //   areas: destroyArray(datosEtapa[0].AreasAsociadas),
    //   notas: '',
    //   estado: datosEtapa[0].Estado === 'Activa' ? true : false,
    // })
  }, [datosEtapa])

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
    if (datosEtapa[0]) {
      setInitialValues({
        codigo: datosEtapa[0].Codigo.toString(),
        nombre: datosEtapa[0].Nombre,
        areas: destroyArray(datosEtapa[0].AreasAsociadas),
        notas: '',
        estado: datosEtapa[0].Estado === 'Activa' ? true : false,
      })
    } else {
      setInitialValues({
        codigo: 'D0',
        nombre: '',
        areas: '[]',
        notas: '',
        estado: true,
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
      //formik.values.areas = []
      //formik.resetForm()
    },
  })

  // useEffect(() => {
  //   console.log('Cambio', formik.values)
  // }, [formik.values])

  const sendData = async (dataForm) => {
    console.log('Edicion Formulario: ', edicionFormulario)
    console.log('Titulo Formulario: ', tituloModulo)
    if (edicionFormulario && tituloModulo !== '') {
      switch (tituloModulo.toUpperCase()) {
        case 'EDITAR REGISTRO':
          console.log('SOY FUNCION EDITAR')
          Axios.put(URL_API_ACTUALIZAR_ETAPA, dataForm).then((data) => {
            console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro actualizado')
                formik.resetForm()
                setEdicionFormulario(false)
                //window.location.href = '#/etapas'
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
          Axios.post(URL_API_CREAR_ETAPA, dataForm).then((data) => {
            console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro insertado')
                formik.resetForm()
                setEdicionFormulario(false)
                visualizar('/etapas/vista-registro', data.data.result.Codigo)
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
          </CCol>
          {/* <CCol md={6}>ACTIVIDADES ASOCIADAS</CCol> */}
          <ToastContainer position="bottom-center" autoClose={1000} />
        </CForm>
      </fieldset>
      {!edicionFormulario && (
        <CButton color="secondary" onClick={desbloquearFormulario}>
          <CIcon icon={cilLockUnlocked} /> {_id ? 'Editar' : 'Nuevo'}
        </CButton>
      )}
    </>
  )
}

export default Vista
