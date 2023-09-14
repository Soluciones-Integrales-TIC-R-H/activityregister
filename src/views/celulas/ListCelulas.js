import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import {
  CBadge,
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
import {
  cilActionUndo,
  cilCommand,
  cilDelete,
  cilDescription,
  cilEqualizer,
  cilLineStyle,
} from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { nanoid } from 'nanoid'
import TablaReporteExportar from 'src/components/TablaReporteExportar'
import {
  eliminarLogicamente,
  noAction,
  restaurarLogicamente,
  visualizar,
} from 'src/services/AccionesCrud'
import { CONFIG_HEADER_AUTH } from 'src/utilities/config'
import { Page404 } from '../pages/page404/Page404'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'

const URL_API_DATOS_LISTADO_SIMPLE = process.env.REACT_APP_API_CELULAS_CONSULTA_AVANZADA_SIMPLE
const URL_API_DATOS_LISTADO_DETALLADO =
  process.env.REACT_APP_API_CELULAS_CONSULTA_AVANZADA_DETALLADA
const URL_API_ELIMINAR_ITEM = process.env.REACT_APP_API_CELULA_ELIMINAR
const URL_API_RESTAURAR_ITEM = process.env.REACT_APP_API_CELULA_RESTAURAR
const URL_API_FUNCIONARIOS = process.env.REACT_APP_API_FUNCIONARIOS

//==================================VISTA==================================

const Vista = () => {
  return (
    <>
      <AuthenticatedTemplate>
        <CRow>
          <CCol xs={12}>
            <CCard className="border-dark">
              <CCardHeader className="bg-dark text-white text-uppercase">
                <CIcon icon={cilDescription} size="xl" />
                <strong> Celulas</strong>
              </CCardHeader>
              <CCardBody>
                <Formulario key={'FORM_CELULA_LISTA_' + nanoid()} />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Page404 />
      </UnauthenticatedTemplate>
    </>
  )
}

//==================================COLUMNAS DE TABLA REPORTE==================================

const ColumnasSimples = [
  { id: 'Codigo', name: 'Codigo', selector: (row) => row.Codigo, sortable: true, omit: false },
  {
    id: 'Nombre',
    name: 'Celula',
    selector: (row) => row.Nombre,
    grow: 3,
    sortable: true,
    wrap: true,
  },
  {
    id: 'Lider',
    name: 'Lider',
    selector: (row) => row.Lider,
    grow: 3,
    sortable: true,
    wrap: true,
  },
  {
    id: 'Estado',
    name: 'Estado',
    selector: (row) => row.Estado,
    cell: (row) => (
      <CBadge color={row.Estado === 'Activa' ? 'success' : 'danger'} shape="rounded-pill">
        {row.Estado}
      </CBadge>
    ),
    sortable: true,
    center: true,
  },
  {
    name: '',
    button: true,
    cell: (row) => (
      <>
        <CButton
          variant="outline"
          onClick={() =>
            row.Estado === 'Activa'
              ? eliminarLogicamente(URL_API_ELIMINAR_ITEM, row.Codigo)
              : restaurarLogicamente(URL_API_RESTAURAR_ITEM, row.Codigo)
          }
          className={`btn btn-sm ${
            row.Estado === 'Activa' ? 'btn-outline-danger' : 'btn-outline-warning'
          } ms-2`}
          title={row.Estado === 'Activa' ? 'Eliminar celula' : 'Restaurar celula'}
        >
          <CIcon
            className="text-whitee"
            icon={row.Estado === 'Activa' ? cilDelete : cilActionUndo}
          />
        </CButton>
        <CButton
          variant="outline"
          onClick={() => visualizar('/celulas/vista-registro', row.Codigo)}
          className="btn btn-sm btn-outline-primary ms-2"
          title={'Visualizar celula'}
        >
          <CIcon className="text-whitee" icon={cilLineStyle} />
        </CButton>
      </>
    ),
  },
]

const ColumnasDetalladas = [
  { id: 'Codigo', name: 'Codigo', selector: (row) => row.Codigo, sortable: true, omit: false },
  {
    id: 'Nombre',
    name: 'Celula',
    selector: (row) => row.Nombre,
    grow: 3,
    sortable: true,
    wrap: true,
  },
  {
    id: 'lider',
    name: 'Colaborador',
    selector: (row) => row.Lider,
    grow: 2,
    sortable: true,
    wrap: true,
  },
  {
    id: 'Colaborador',
    name: 'Colaborador',
    selector: (row) => row.Colaborador,
    grow: 2,
    sortable: true,
    wrap: true,
  },
  {
    id: 'Estado',
    name: 'Estado',
    selector: (row) => row.Estado,
    cell: (row) => (
      <CBadge color={row.Estado === 'Activa' ? 'success' : 'danger'} shape="rounded-pill">
        {row.Estado}
      </CBadge>
    ),
    sortable: true,
    center: true,
  },
  {
    name: '',
    button: true,
    cell: (row) => (
      <>
        <CButton
          variant="outline"
          onClick={() =>
            row.Estado === 'Activa'
              ? eliminarLogicamente(URL_API_ELIMINAR_ITEM, row.Codigo)
              : restaurarLogicamente(URL_API_RESTAURAR_ITEM, row.Codigo)
          }
          className={`btn btn-sm ${
            row.Estado === 'Activa' ? 'btn-outline-danger' : 'btn-outline-warning'
          } ms-2`}
          title={row.Estado === 'Activa' ? 'Eliminar celula' : 'Restaurar celula'}
        >
          <CIcon
            className="text-whitee"
            icon={row.Estado === 'Activa' ? cilDelete : cilActionUndo}
          />
        </CButton>
        <CButton
          variant="outline"
          onClick={() => visualizar('/celulas/vista-registro', row.Codigo)}
          className="btn btn-sm btn-outline-primary ms-2"
          title={'Visualizar celula'}
        >
          <CIcon className="text-whitee" icon={cilLineStyle} />
        </CButton>
      </>
    ),
  },
]

//==================================FORMULARIO==================================
const FormularioSchema = Yup.object({
  consulta: Yup.string(),
  nombre: Yup.string(),
  funcionario: Yup.number().positive().integer(),
  estado: Yup.string(),
})

const Formulario = () => {
  const [datosListado, setDatosListado] = useState([])
  const [funcionarioList, setFuncionarioList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      await Axios.get(URL_API_FUNCIONARIOS, CONFIG_HEADER_AUTH).then((data) => {
        setFuncionarioList(data.data.result)
      })
      await Axios.post(URL_API_DATOS_LISTADO_SIMPLE, formik.initialValues, CONFIG_HEADER_AUTH).then(
        (data) => {
          if (data.data) {
            //toast.success('Listado generado')
            setDatosListado(data.data.result)
            //formik.resetForm()
          } else {
            toast.error('No se pudo generar la consulta')
          }
          setLoading(false)
        },
      )
    }
    setLoading(true)
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formik = useFormik({
    initialValues: {
      consulta: '1',
      nombre: '',
      funcionario: '',
      estado: '',
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
    //simple
    // if (formik.values.consulta === '1') {
    //   formik.values.funcionario = ''
    //   //setFuncionarioList([{ Email: '', Nombre: 'TODOS LOS COLABORADORES' }])
    // } else {
    //   formik.values.responsable = ''
    //   setFuncionarioList([{ Email: '', Nombre: 'TODAS LAS CELULAS' }])
    // }
  }, [formik.values])

  const sendData = async (dataForm) => {
    Axios.post(
      dataForm && dataForm.consulta === '2'
        ? URL_API_DATOS_LISTADO_DETALLADO
        : URL_API_DATOS_LISTADO_SIMPLE,
      dataForm,
      CONFIG_HEADER_AUTH,
    ).then((data) => {
      console.log('datos ', dataForm)
      if (data.data) {
        toast.success('Listado generado')
        setDatosListado(data.data.result)
        //formik.resetForm()
      } else {
        toast.error('No se pudo generar la consulta')
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
              <CCol md={4}>
                <label className="text-uppercase">
                  <strong>Nombre</strong>
                </label>
                <CFormInput
                  type="text"
                  id="nombre"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nombre}
                  className={formik.errors.nombre && 'form-control border-danger'}
                />
                {formik.errors.nombre ? (
                  <span className="text-danger">{formik.errors.nombre} </span>
                ) : null}
              </CCol>
              <CCol md={2}>
                <label className="text-uppercase">
                  <strong>Vista</strong>
                </label>
                <CFormSelect
                  id="consulta"
                  feedback="Por favor, selecciona una opción de la lista"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.consulta}
                  className={`text-uppercase form-control ${
                    formik.errors.consulta ? ' border-danger' : ''
                  }`}
                >
                  <option key="consulta_simple" value="1">
                    Simple
                  </option>
                  <option key="consulta_detallada" value="2">
                    Detallada
                  </option>
                </CFormSelect>
                {formik.errors.consulta ? (
                  <span className="text-danger">{formik.errors.consulta} </span>
                ) : null}
              </CCol>
              <CCol md={4}>
                <label className="text-uppercase">
                  <strong>
                    {formik.values.consulta === '1' ? ' Lider' : 'Lider o Colaborador'}
                  </strong>
                </label>
                <CFormSelect
                  id="funcionario"
                  feedback="Por favor, selecciona una opción de la lista"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.funcionario}
                  className={formik.errors.funcionario && 'form-control border-danger'}
                >
                  <option key="funcionario_0" value="">
                    TODOS LOS FUNCIONARIOS
                  </option>
                  {funcionarioList.map((funcionario) => (
                    <option key={'funcionario_' + funcionario.Codigo} value={funcionario.Codigo}>
                      {funcionario.Nombre}
                    </option>
                  ))}
                </CFormSelect>
                {formik.errors.funcionario ? (
                  <span className="text-danger">{formik.errors.funcionario} </span>
                ) : null}
              </CCol>
              <CCol md={2}>
                <label className="text-uppercase">
                  <strong>Estado</strong>
                </label>
                <CFormSelect
                  id="estado"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.estado}
                  className={formik.errors.estado && 'form-control border-danger'}
                >
                  <option key="estado_0" value="">
                    Todos
                  </option>
                  <option key="estado_1" value="Activa">
                    Activa
                  </option>
                  <option key="estado_2" value="Inactiva">
                    Inactiva
                  </option>
                </CFormSelect>
                {formik.errors.estado ? (
                  <span className="text-danger">{formik.errors.estado} </span>
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
          <TablaReporteExportar
            columns={formik.values.consulta === '1' ? ColumnasSimples : ColumnasDetalladas}
            filas={datosListado}
            botonReporte={true}
            expandible={false}
            tituloTabla={
              formik.values.consulta === '1'
                ? 'listado celulas simple '
                : 'listado celulas detallado'
            }
            defaultSortFieldId={formik.values.consulta === '1' ? 'Lider' : 'Colaborador'}
          />
        </>
      )}
    </>
  )
}

export default Vista
