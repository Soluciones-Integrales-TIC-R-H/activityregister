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
import { eliminarLogicamente, restaurarLogicamente, visualizar } from 'src/services/AccionesCrud'

const URL_API_DATOS_LISTADO = process.env.REACT_APP_API_ETAPAS_CONSULTA_AVANZADA
const URL_API_ELIMINAR_ITEM = process.env.REACT_APP_API_ETAPA_ELIMINAR
const URL_API_RESTAURAR_ITEM = process.env.REACT_APP_API_ETAPA_RESTAURAR
const URL_API_AREAS = process.env.REACT_APP_API_AREAS_ACTIVAS

//==================================VISTA==================================

const Vista = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="text-primaryy text-uppercase">
            <CIcon icon={cilDescription} size="xl" />
            <strong> Etapas</strong>
          </CCardHeader>
          <CCardBody>
            <Formulario key={'FORM_ETAPA_LISTA_' + nanoid()} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

//==================================COLUMNAS DE TABLA REPORTE==================================

const Columnas = [
  { id: 'Codigo', name: 'Codigo', selector: (row) => row.Codigo, sortable: true, omit: false },
  {
    id: 'Nombre',
    name: 'Nombre',
    selector: (row) => row.Nombre,
    grow: 3,
    sortable: true,
    wrap: true,
  },
  {
    id: 'AreasAsociadas',
    name: 'Areas asociadas',
    selector: (row) => row.AreasAsociadas,
    grow: 3,
    wrap: true,
    omit: true,
  },
  {
    id: 'NombreAreas',
    name: 'Areas asociadas',
    selector: (row) => row.NombreAreas,
    grow: 3,
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
    cell: (row) =>
      row.Estado === 'Activa' ? (
        <CButton
          variant="outline"
          onClick={() => eliminarLogicamente(URL_API_ELIMINAR_ITEM, row.Codigo)}
          className="btn btn-sm btn-outline-danger ms-2"
          title={'Eliminar etapa'}
        >
          <CIcon className="text-whitee" icon={cilDelete} />
        </CButton>
      ) : (
        <CButton
          variant="outline"
          onClick={() => restaurarLogicamente(URL_API_RESTAURAR_ITEM, row.Codigo)}
          className="btn btn-sm btn-outline-warning ms-2"
          title={'Restaurar etapa'}
        >
          <CIcon className="text-whitee" icon={cilActionUndo} />
        </CButton>
      ),
  },
  {
    name: '',
    button: true,
    cell: (row) => (
      <CButton
        variant="outline"
        onClick={() => visualizar('/etapas/vista-registro', row.Codigo)}
        className="btn btn-sm btn-outline-primary ms-2"
        title={'Visualizar area'}
      >
        <CIcon className="text-whitee" icon={cilLineStyle} />
      </CButton>
    ),
  },
]

//==================================FORMULARIO==================================
const FormularioSchema = Yup.object({
  nombre: Yup.string(),
  area: Yup.number().positive().integer(),
  estado: Yup.string(),
})

const Formulario = () => {
  const [datosListado, setDatosListado] = useState([])
  const [areaList, setAreaList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      await Axios.get(URL_API_AREAS).then((data) => {
        setAreaList(data.data)
      })

      Axios.post(URL_API_DATOS_LISTADO, formik.initialValues).then((data) => {
        if (data.data) {
          //toast.success('Listado generado')
          setDatosListado(data.data)
          //formik.resetForm()
        } else {
          toast.error('No se pudo generar la consulta')
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
      nombre: '',
      area: '',
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
    Axios.post(URL_API_DATOS_LISTADO, dataForm).then((data) => {
      console.log('datos ', dataForm)
      if (data.data) {
        toast.success('Listado generado')
        setDatosListado(data.data)
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
              <CCol md={6}>
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
              <CCol md={4}>
                <label className="text-uppercase">
                  <strong>Area</strong>
                </label>
                <CFormSelect
                  id="area"
                  aria-label="Default select area"
                  feedback="Por favor, selecciona una opción de la lista"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.area}
                  className={formik.errors.area && 'form-control border-danger'}
                >
                  <option key="area_0" value="">
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
            columns={Columnas}
            filas={datosListado}
            botonReporte={true}
            expandible={false}
          />
        </>
      )}
    </>
  )
}

export default Vista
