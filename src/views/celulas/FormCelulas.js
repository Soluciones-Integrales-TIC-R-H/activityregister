/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
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
  lider: Yup.string().required('Campo requerido'),
  colaboradores: Yup.array(), //.required('Campo requerido').min(1, 'Campo requerido'),
  estado: Yup.boolean(),
})

// eslint-disable-next-line react/prop-types
const Formulario = ({ _id = undefined, setTituloModulo = '', tituloModulo = '' }) => {
  const URL_API_FUNCIONARIOS = _id
    ? process.env.REACT_APP_API_FUNCIONARIOS
    : process.env.REACT_APP_API_FUNCIONARIOS_ACTIVOS
  const URL_API_CELULA = process.env.REACT_APP_API_CELULA_POR_CODIGO_DETALLADA
  const URL_API_CREAR_CELULA = process.env.REACT_APP_API_CELULA_INSERTAR
  const URL_API_ACTUALIZAR_CELULA = process.env.REACT_APP_API_CELULA_ACTUALIZAR
  const [funcionariosList, setFuncionariosList] = useState([])
  const [edicionFormulario, setEdicionFormulario] = useState(false)
  const [initialValues, setInitialValues] = useState({
    codigo: 'D0',
    nombre: '',
    lider: '',
    colaboradores: [],
    estado: true,
  })

  const [datosCelula, setDatosCelula] = useState([initialValues])

  const cargarDatos = async () => {
    if (_id !== undefined) {
      let datos
      const textoDescifrado = descifrar(_id)
      try {
        await Axios.get(`${URL_API_CELULA}/${textoDescifrado}`, CONFIG_HEADER_AUTH).then((data) => {
          //console.log('Carga datos', data.data)
          if (data.data.result) {
            datos = data.data.result
            let colaboradores = []
            // eslint-disable-next-line array-callback-return
            datos.map((celula, index) => {
              if (celula.CodColaborador != null && celula.CodColaborador !== '') {
                colaboradores.push(celula.CodColaborador)
              }
              if (datos[index].Estado === 'Activa') {
                datos[index].Estado = true
              } else {
                datos[index].Estado = false
              }
            })
            setDatosCelula(
              ...datosCelula,
              (datosCelula[0]['codigo'] = datos[0].Codigo),
              (datosCelula[0]['nombre'] = datos[0].Nombre),
              (datosCelula[0]['lider'] = datos[0].CodLider),
              //(datosCelula[0]['colaboradores'] = JSON.parse(datos[0].CodColaborador)),
              (datosCelula[0]['colaboradores'] = colaboradores),
              (datosCelula[0]['estado'] = datos[0].Estado),
            )
          }
        })
      } catch (error) {
        console.log('Error', error)
      }
    } else {
      setDatosCelula(
        ...datosCelula,
        (datosCelula[0].codigo = 'D0'),
        (datosCelula[0].nombre = ''),
        (datosCelula[0].lider = ''),
        (datosCelula[0].colaboradores = []),
        (datosCelula[0].estado = true),
      )
    }
  }

  const cargarFuncionarios = async () => {
    await Axios.get(URL_API_FUNCIONARIOS, CONFIG_HEADER_AUTH).then((data) => {
      setFuncionariosList(data.data.result)
    })
  }

  useEffect(() => {
    //console.log('datosCliente', JSON.stringify(datosCliente[0]))
    formik.resetForm()
    setInitialValues(datosCelula[0])
    formik.initialValues = initialValues
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datosCelula, setDatosCelula])

  useEffect(() => {
    setEdicionFormulario(false)
    formik.resetForm()
    cargarDatos()
    cargarFuncionarios()
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
    console.log('soy cancelar', JSON.stringify(datosCelula))
    cargarDatos()
    setEdicionFormulario(false)
    refreshPage()
  }

  const formik = useFormik({
    initialValues,
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      sendData(values)
      //formik.values.colaboradores = []
      //formik.resetForm()
    },
  })

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
          // console.log(dataForm)
          Axios.put(URL_API_ACTUALIZAR_CELULA, dataForm, CONFIG_HEADER_AUTH).then((data) => {
            // console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro actualizado')
                formik.resetForm()
                setEdicionFormulario(false)
                //window.location.href = '#/celulas'
                redireccionar(1200, '#/celulas')
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
          Axios.post(URL_API_CREAR_CELULA, dataForm, CONFIG_HEADER_AUTH).then((data) => {
            //console.log(data)
            if (data.data) {
              if (Object.keys(data.data.result).length > 0) {
                toast.success('Registro insertado')
                formik.resetForm()
                setEdicionFormulario(false)
                visualizar('/celulas/vista-registro', data.data.result.insertId)
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
        <fieldset disabled={!edicionFormulario}>
          <CRow className="mt-2 mb-3">
            <CCol md={2}>
              <CFormInput
                type="text"
                id="codigo"
                name="codigo"
                disabled={true}
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
              <label>
                <strong>NOMBRE DE LA CELULA</strong>
              </label>
              <CFormInput
                type="text"
                id="nombre"
                name="nombre"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
                className={formik.errors.nombre && 'form-control border-danger'}
              />
              {formik.errors.nombre ? (
                <span className="text-danger">{formik.errors.nombre} </span>
              ) : null}
            </CCol>
          </CRow>
        </fieldset>
        <CRow className="mb-2">
          <CCol>
            <CAccordion alwaysOpen flush activeItemKey={2}>
              <CAccordionItem className={'mt-2 border'} itemKey={1}>
                <CAccordionHeader>ENCARGADO</CAccordionHeader>
                <CAccordionBody>
                  <fieldset disabled={!edicionFormulario}>
                    <CRow>
                      <CCol className={formik.errors.lider && 'mt-2 mb-3 border border-danger'}>
                        {funcionariosList.map((lider) => (
                          <CFormCheck
                            type="radio"
                            key={'LIDER_' + lider.Codigo}
                            id={'LIDER_' + lider.Codigo}
                            name="lider"
                            value={lider.Codigo}
                            label={`
                    ${lider.Estado === 'Activo' ? ' + ' : ' - '} ${lider.Nombre} `}
                            onChange={(e) => {
                              console.log('Lideres ', JSON.stringify(formik.values.lider))
                              if (e.target.checked) {
                                formik.values.lider = parseInt(e.target.value)
                                formik.handleBlur(e)
                              }
                            }}
                            //onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            checked={formik.initialValues.lider === lider.Codigo}
                            className={
                              formik.initialValues.lider === lider.Codigo ? 'text-success' : ''
                            }
                          />
                        ))}
                        {formik.errors.lider ? (
                          <span className="text-danger">{formik.errors.lider} </span>
                        ) : null}
                      </CCol>
                    </CRow>
                  </fieldset>
                </CAccordionBody>
              </CAccordionItem>
              <CAccordionItem className={'mt-3 border'} itemKey={2}>
                <CAccordionHeader className="text-uppercase">COLABORADORES</CAccordionHeader>
                <CAccordionBody>
                  <fieldset disabled={!edicionFormulario}>
                    <CRow>
                      <CCol
                        className={formik.errors.colaboradores && 'mt-2 mb-3 border border-danger'}
                      >
                        {funcionariosList.map((colaborador) => (
                          <CFormCheck
                            key={'COLABORADOR_' + colaborador.Codigo}
                            id={'COLABORADOR_' + colaborador.Codigo}
                            name="colaboradores"
                            value={colaborador.Codigo}
                            label={`
                    ${colaborador.Estado === 'Activo' ? ' + ' : ' - '} ${colaborador.Nombre} `}
                            onChange={(e) => {
                              console.log(
                                'Colaboradores ',
                                JSON.stringify(formik.values.colaboradores),
                              )
                              const colaboradoresForm = formik.values.colaboradores
                              let ntf = colaboradoresForm
                              if (e.target.checked) {
                                if (!ntf.includes(parseInt(e.target.value))) {
                                  ntf.push(parseInt(e.target.value))
                                }
                              } else {
                                formik.values.colaboradores = colaboradoresForm.filter(
                                  (item) => item !== parseInt(e.target.value),
                                )
                              }
                              formik.handleBlur(e)
                            }}
                            // onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            checked={formik.initialValues.colaboradores.includes(
                              colaborador.Codigo,
                            )}
                            className={
                              formik.initialValues.colaboradores.includes(colaborador.Codigo)
                                ? 'text-success'
                                : ''
                            }
                          />
                        ))}
                        {formik.errors.colaboradores ? (
                          <span className="text-danger">{formik.errors.colaboradores} </span>
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
            <CCol md={12}>
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
