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
import { cilActionUndo, cilCommand, cilDelete, cilDescription, cilEqualizer } from '@coreui/icons'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { nanoid } from 'nanoid'
import TablaReporteExportar from 'src/components/TablaReporteExportar'
import { eliminarLogicamente, restaurarLogicamente } from 'src/services/AccionesLogicas'

const URL_API_DATOS_LISTADO = process.env.REACT_APP_API_ACTIVIDADES_REPORTE
const URL_API_ELIMINAR_ITEM = process.env.REACT_APP_API_ACTIVIDAD_ELIMINAR
const URL_API_RESTAURAR_ITEM = process.env.REACT_APP_API_ACTIVIDAD_RESTAURAR

//==================================VISTA==================================

const Vista = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="text-primaryy text-uppercase">
            <CIcon icon={cilDescription} size="xl" />
            <strong> Actividades</strong>
          </CCardHeader>
          <CCardBody>
            <Formulario key={'FORM_ACTIVIDAD_LISTA_' + nanoid()} />
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
    grow: 2,
    sortable: true,
    wrap: true,
  },
  {
    id: 'EtapasAsociadas',
    name: 'Etapas asociadas',
    selector: (row) => row.EtapasAsociadas,
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
    cell: (row) =>
      row.Estado === 'Activa' ? (
        <CButton
          variant="outline"
          onClick={() => eliminarLogicamente(URL_API_ELIMINAR_ITEM, row.Codigo)}
          className="btn btn-sm btn-outline-danger ms-2"
          title={'Eliminar actividad'}
        >
          <CIcon className="text-whitee" icon={cilDelete} />
        </CButton>
      ) : (
        <CButton
          variant="outline"
          onClick={() => restaurarLogicamente(URL_API_RESTAURAR_ITEM, row.Codigo)}
          className="btn btn-sm btn-outline-warning ms-2"
          title={'Restaurar actividad'}
        >
          <CIcon className="text-whitee" icon={cilActionUndo} />
        </CButton>
      ),
  },
]

//==================================FORMULARIO==================================
const FormularioSchema = Yup.object({
  nombre: Yup.string(),
  estado: Yup.string(),
})

const Formulario = () => {
  const [datosListado, setDatosListado] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      await Axios.get(
        `${URL_API_DATOS_LISTADO}/nombre/${
          formik.initialValues.nombre !== '' ? formik.initialValues.nombre : 'all'
        }/estado/${formik.initialValues.estado !== '' ? formik.initialValues.estado : 'all'}`,
      ).then((data) => {
        if (data.data) {
          setDatosListado(data.data)
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
      estado: '',
    },
    validationSchema: FormularioSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2))
      sendData(values)
      //formik.resetForm()
    },
  })

  const sendData = async (dataForm) => {
    await Axios.get(
      URL_API_DATOS_LISTADO +
        '/nombre/' +
        (dataForm.nombre !== '' ? dataForm.nombre : 'all') +
        '/estado/' +
        (dataForm.estado !== '' ? dataForm.estado : 'all'),
    ).then((data) => {
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
                  <option key="estado_1" value="1">
                    Activa
                  </option>
                  <option key="estado_2" value="0">
                    Inactiva
                  </option>
                </CFormSelect>
                {formik.errors.estado ? (
                  <span className="text-danger">{formik.errors.estado} </span>
                ) : null}
              </CCol>
              <CCol md={4}>
                <label></label>
                <div key={nanoid()}>
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
                </div>
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
