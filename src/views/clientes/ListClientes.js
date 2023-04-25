import React, { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Axios from 'axios'
import { eliminarLogicamente, restaurarLogicamente, visualizar } from 'src/services/AccionesCrud'
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
import { CONFIG_HEADER_AUTH } from 'src/utilities/config'
import { Page404 } from '../pages/page404/Page404'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'

const URL_API_DATOS_REPORTE = process.env.REACT_APP_API_CLIENTES_CONSULTA_AVANZADA
const URL_API_ELIMINAR_ITEM = process.env.REACT_APP_API_CLIENTE_ELIMINAR
const URL_API_RESTAURAR_ITEM = process.env.REACT_APP_API_CLIENTE_RESTAURAR

const URL_API_AREAS = process.env.REACT_APP_API_AREAS_ACTIVAS

//==================================VISTA==================================

const Vista = () => {
  return (
    <>
      <AuthenticatedTemplate>
        <CRow>
          <CCol xs={12}>
            <CCard>
              <CCardHeader className="text-primaryy text-uppercase">
                <CIcon icon={cilDescription} size="xl" />
                <strong> Clientes</strong>
              </CCardHeader>
              <CCardBody>
                <Formulario key={'FORM_CLIENTE_LISTA_' + nanoid()} />
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

const Columnas = [
  { id: 'Codigo', name: 'Codigo', selector: (row) => row.CodEvento, omit: true },
  {
    id: 'Nit',
    name: 'Nit',
    selector: (row) => row.Nit,
    center: true,
    omit: true,
  },
  {
    id: 'Nombre',
    name: 'Nombre',
    selector: (row) => row.Nombre,
    grow: 2,
    sortable: true,
    wrap: true,
  },
  //{ name: 'Fin', visible: false selector: row => row.title},
  {
    id: 'Direccion',
    name: 'Direccion',
    selector: (row) => row.Direccion,
    grow: 2,
    wrap: true,
  },
  {
    id: 'Telefono',
    name: 'Teléfonos',
    selector: (row) => row.Telefono,
    omit: false,
  },
  {
    id: 'Email',
    name: 'Email contacto',
    selector: (row) => row.Email,
    omit: false,
  },
  {
    id: 'SerContable',
    name: 'Servi AC',
    selector: (row) => row.ServicioContabilidad,
    cell: (row) => (
      <CBadge color={row.ServicioContabilidad === 'Si' ? 'success' : 'dark'} shape="rounded-pill">
        {row.ServicioContabilidad}
      </CBadge>
    ),
    sortable: true,
    center: true,
  },
  {
    id: 'SerRevisoria',
    name: 'Servi RF',
    selector: (row) => row.ServicioRevisoria,
    cell: (row) => (
      <CBadge color={row.ServicioRevisoria === 'Si' ? 'success' : 'dark'} shape="rounded-pill">
        {row.ServicioRevisoria}
      </CBadge>
    ),
    sortable: true,
    center: true,
  },
  {
    id: 'SerTributaria',
    name: 'Servi AT',
    selector: (row) => row.ServicioTributaria,
    cell: (row) => (
      <CBadge color={row.ServicioTributaria === 'Si' ? 'success' : 'dark'} shape="rounded-pill">
        {row.ServicioTributaria}
      </CBadge>
    ),
    sortable: true,
    center: true,
  },
  {
    id: 'AreasAsociadas',
    name: 'Areas asociadas',
    selector: (row) => row.AreasAsociadas,
    sortable: true,
    omit: true,
  },
  {
    id: 'Estado',
    name: 'Estado',
    selector: (row) => row.Estado,
    cell: (row) => (
      <CBadge color={row.Estado === 'Activo' ? 'success' : 'danger'} shape="rounded-pill">
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
            row.Estado === 'Activo'
              ? eliminarLogicamente(URL_API_ELIMINAR_ITEM, row.Codigo)
              : restaurarLogicamente(URL_API_RESTAURAR_ITEM, row.Codigo)
          }
          className={`btn btn-sm ${
            row.Estado === 'Activo' ? 'btn-outline-danger' : 'btn-outline-warning'
          } ms-2`}
          title={row.Estado === 'Activo' ? 'Eliminar cliente' : 'Restaurar cliente'}
        >
          <CIcon
            className="text-whitee"
            icon={row.Estado === 'Activo' ? cilDelete : cilActionUndo}
          />
        </CButton>
        <CButton
          variant="outline"
          onClick={() => visualizar('/clientes/vista-registro', row.Codigo)}
          className="btn btn-sm btn-outline-primary ms-2"
          title={'Visualizar client'}
        >
          <CIcon className="text-whitee" icon={cilLineStyle} />
        </CButton>
      </>
    ),
  },
]

//==================================FORMULARIO==================================
const FormularioSchema = Yup.object({
  servicio: Yup.number(),
  nombre: Yup.string(),
  area: Yup.number(),
  responsable: Yup.string(),
  estado: Yup.string(),
})

const Formulario = () => {
  const [datosListado, setDatosListado] = useState([])
  const [loading, setLoading] = useState(false)

  const [areaList, setAreaList] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [funcionarioList, setFuncionarioList] = useState([])

  useEffect(() => {
    const loadData = async () => {
      Axios.get(URL_API_AREAS, CONFIG_HEADER_AUTH).then((data) => {
        setAreaList(data.data.result)
      })

      Axios.post(URL_API_DATOS_REPORTE, formik.initialValues, CONFIG_HEADER_AUTH).then((data) => {
        if (data.data) {
          //toast.success('Listado generado')
          setDatosListado(data.data.result)
          //formik.resetForm()
        } else {
          toast.error('No se pudo generar el listado')
        }
        setLoading(false)
      })
    }
    setLoading(true)
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formik = useFormik({
    initialValues: {
      servicio: 0,
      nombre: '',
      area: 0,
      responsable: '',
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
  }, [formik.values])

  const sendData = async (dataForm) => {
    Axios.post(URL_API_DATOS_REPORTE, dataForm, CONFIG_HEADER_AUTH).then((data) => {
      console.log('datos ', dataForm)
      if (data.data) {
        toast.success('Listado generado')
        setDatosListado(data.data.result)
        //formik.resetForm()
      } else {
        toast.error('No se pudo generar el listado')
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
                  <strong>Servicio</strong>
                </label>
                <CFormSelect
                  id="servicio"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.servicio}
                  className={formik.errors.servicio && 'form-control border-danger'}
                >
                  <option key="servicio_0" value={0}>
                    TODOS LOS SERVICIOS
                  </option>
                  <option key="servicio_100" value={100}>
                    Contabilidad
                  </option>
                  <option key="servicio_101" value={101}>
                    Tributaria
                  </option>
                  <option key="servicio_102" value={102}>
                    Revisoría fiscal
                  </option>
                </CFormSelect>
                {formik.errors.servicio ? (
                  <span className="text-danger">{formik.errors.servicio} </span>
                ) : null}
              </CCol>
              <CCol md={8}>
                <label className="text-uppercase">
                  <strong>nombre</strong>
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
            </CRow>
            <CRow className="mt-2">
              <CCol md={4}>
                <label className="text-uppercase">
                  <strong>Cargabilidad por area</strong>
                </label>
                <CFormSelect
                  id="area"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.area}
                  className={formik.errors.area && 'form-control border-danger'}
                >
                  <option key="area_0" value={0}>
                    TODAS LAS AREAS
                  </option>
                  {areaList.map((area) => (
                    <option key={'area_' + area.Codigo} value={area.Codigo}>
                      {area.Nombre}
                    </option>
                  ))}
                </CFormSelect>
                {formik.errors.area ? (
                  <span className="text-danger">{formik.errors.area} </span>
                ) : null}
              </CCol>

              <CCol md={6}>
                <label className="text-uppercase">
                  <strong>Cargabilidad por celula</strong>
                </label>
                <CFormSelect
                  id="responsable"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.responsable}
                  disabled={true}
                  className={formik.errors.responsable && 'form-control border-danger'}
                >
                  <option key="funcionario_0" value="">
                    TODAS LAS CELULAS
                  </option>
                  {funcionarioList.map((funcionario) => (
                    <option
                      key={'funcionario_' + funcionario.CodFuncionario}
                      value={funcionario.CodFuncionario}
                    >
                      {funcionario.NameFuncionario}
                    </option>
                  ))}
                </CFormSelect>
                {formik.errors.responsable ? (
                  <span className="text-danger">{formik.errors.responsable} </span>
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
                  <option key="estado_all" value="">
                    TODOS
                  </option>
                  <option key="estado_1" value="Activo">
                    Activo
                  </option>
                  <option key="estado_0" value="Inactivo">
                    Inactivo
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
            columns={Columnas}
            filas={datosListado}
            botonReporte={true}
            expandible={true}
            tituloTabla={'listado clientes'}
            defaultSortFieldId={'Nombre'}
          />
        </>
      )}
    </>
  )
}

export default Vista