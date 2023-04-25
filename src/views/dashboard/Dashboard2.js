import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import {
  CCard,
  CCardBody,
  CCol,
  CCardHeader,
  CRow,
  CTableDataCell,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableHead,
  CTable,
  CAccordion,
  CAccordionItem,
  CAccordionHeader,
  CAccordionBody,
  CAlert,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { CChart, CChartBar, CChartLine, CChartPie } from '@coreui/react-chartjs'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import {
  extraerAnhoToFecha,
  extraerMesToFecha,
  extraerUltimoDiaToFecha,
  generarArrayDeColores,
} from 'src/utilities/utilidades'
import { DatosAcount } from 'src/components/VerificarAcount'
import { CONFIG_HEADER_AUTH } from 'src/utilities/config'
import { nanoid } from 'nanoid'

const URL_API_DASHBOARD_EVENTO = process.env.REACT_APP_API_EVENTOS_DATOS_DASHBOARD

const listYear = [2022, 2023]
const listMonth = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const Charts = () => {
  const datosFuncionario = DatosAcount()
  const [datosListado, setDatosListado] = useState([])
  const [datosTiemposPorDias, setDatosTiemposPorDias] = useState([])
  const [datosTiemposPorClientes, setDatosTiemposPorClientes] = useState([])
  const [datosTiemposPorAreas, setDatosTiemposPorAreas] = useState([])
  const [datosTiemposPorEtapas, setDatosTiemposPorEtapas] = useState([])
  const [mes, setMes] = useState(extraerMesToFecha())
  const [anho, setAnho] = useState(extraerAnhoToFecha())

  const loadData = async () => {
    let infoGraficoDias = []
    let infoGraficoClientes = []
    let infoGraficoAreas = []
    let infoGraficoEtapas = []
    Axios.post(
      URL_API_DASHBOARD_EVENTO,
      {
        responsable: datosFuncionario.email,
        month: mes,
        year: anho,
      },
      CONFIG_HEADER_AUTH,
    ).then((data) => {
      //console.log('Duhan', data)
      if (data.data) {
        const datos = Array.isArray(data.data.result) ? data.data.result : []
        setDatosListado(data.data.result)
        // eslint-disable-next-line array-callback-return
        datos.map(function (datoGrande, i) {
          if (i === 0) {
            infoGraficoDias.push({
              Dia: datoGrande.Day,
              Tiempos: datoGrande.Tiempo,
              Atraso: datoGrande.Atraso,
              Cuenta: 1,
            })
            infoGraficoClientes.push({
              Cliente: datoGrande.Cliente,
              Tiempos: datoGrande.Tiempo,
              Cuenta: 1,
            })
            infoGraficoAreas.push({
              Area: datoGrande.AreaRegistro,
              Tiempos: datoGrande.Tiempo,
              Cuenta: 1,
            })
            infoGraficoEtapas.push({
              Etapa: datoGrande.Etapa,
              Tiempos: datoGrande.Tiempo,
              Cuenta: 1,
            })
          } else {
            const resultadoDias = infoGraficoDias.find(
              (datoInterno) => datoInterno.Dia === datoGrande.Day,
            )
            const indexResultadoDias = infoGraficoDias.findIndex(
              (datoInterno) => datoInterno.Dia === datoGrande.Day,
            )
            const resultadoClientes = infoGraficoClientes.find(
              (datoInterno) => datoInterno.Cliente === datoGrande.Cliente,
            )
            const indexResultadoClientes = infoGraficoClientes.findIndex(
              (datoInterno) => datoInterno.Cliente === datoGrande.Cliente,
            )

            const resultadoAreas = infoGraficoAreas.find(
              (datoInterno) => datoInterno.Area === datoGrande.AreaRegistro,
            )
            const indexResultadoAreas = infoGraficoAreas.findIndex(
              (datoInterno) => datoInterno.Area === datoGrande.AreaRegistro,
            )

            const resultadoEtapas = infoGraficoEtapas.find(
              (datoInterno) => datoInterno.Etapa === datoGrande.Etapa,
            )
            const indexResultadoEtapas = infoGraficoEtapas.findIndex(
              (datoInterno) => datoInterno.Etapa === datoGrande.Etapa,
            )
            //info Dias
            if (resultadoDias) {
              infoGraficoDias[indexResultadoDias] = {
                Dia: datoGrande.Day,
                Tiempos:
                  parseFloat(infoGraficoDias[indexResultadoDias].Tiempos) +
                  parseFloat(datoGrande.Tiempo),
                Atraso:
                  parseInt(infoGraficoDias[indexResultadoDias].Atraso) +
                  parseInt(datoGrande.Atraso),
                Cuenta: infoGraficoDias[indexResultadoDias].Cuenta + 1,
              }
            } else {
              infoGraficoDias.push({
                Dia: datoGrande.Day,
                Tiempos: datoGrande.Tiempo,
                Atraso: datoGrande.Atraso,
                Cuenta: 1,
              })
            }
            //info clientes
            if (resultadoClientes) {
              infoGraficoClientes[indexResultadoClientes] = {
                Cliente: datoGrande.Cliente,
                Tiempos:
                  parseFloat(infoGraficoClientes[indexResultadoClientes].Tiempos) +
                  parseFloat(datoGrande.Tiempo),
                Cuenta: infoGraficoClientes[indexResultadoClientes].Cuenta + 1,
              }
            } else {
              infoGraficoClientes.push({
                Cliente: datoGrande.Cliente,
                Tiempos: datoGrande.Tiempo,
                Cuenta: 1,
              })
            }
            //info areas
            if (resultadoAreas) {
              infoGraficoAreas[indexResultadoAreas] = {
                Area: datoGrande.AreaRegistro,
                Tiempos:
                  parseFloat(infoGraficoAreas[indexResultadoAreas].Tiempos) +
                  parseFloat(datoGrande.Tiempo),
                Cuenta: infoGraficoAreas[indexResultadoAreas].Cuenta + 1,
              }
            } else {
              infoGraficoAreas.push({
                Area: datoGrande.AreaRegistro,
                Tiempos: datoGrande.Tiempo,
                Cuenta: 1,
              })
            }
            //info areas
            if (resultadoEtapas) {
              infoGraficoEtapas[indexResultadoEtapas] = {
                Etapa: datoGrande.Etapa,
                Tiempos:
                  parseFloat(infoGraficoEtapas[indexResultadoEtapas].Tiempos) +
                  parseFloat(datoGrande.Tiempo),
                Cuenta: infoGraficoEtapas[indexResultadoEtapas].Cuenta + 1,
              }
            } else {
              infoGraficoEtapas.push({
                Etapa: datoGrande.Etapa,
                Tiempos: datoGrande.Tiempo,
                Cuenta: 1,
              })
            }
          }
        })
        setDatosTiemposPorDias(infoGraficoDias)
        setDatosTiemposPorClientes(infoGraficoClientes)
        setDatosTiemposPorAreas(infoGraficoAreas)
        setDatosTiemposPorEtapas(infoGraficoEtapas)
      } else {
        toast.error('No se pudo generar la consulta')
      }
      // console.log('Grafico dias', infoGraficoDias)
      // console.log('Grafico clientes', infoGraficoClientes)
      // console.log('Grafico areas', infoGraficoAreas)
      // console.log('Grafico etapas', infoGraficoEtapas)
    })
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mes, anho])

  return (
    <>
      <CRow className="mb-2">
        <CCol sm={7} className="mb-22">
          <h4 id="traffic" className="card-title mb-0">
            Tráfico
          </h4>
          <div className="small text-medium-emphasis">
            01 {listMonth[parseInt(mes) - 1]} -{' '}
            {extraerUltimoDiaToFecha(new Date(anho + '-' + mes + '-15'))}{' '}
            {listMonth[parseInt(mes) - 1]} de {anho}
          </div>
        </CCol>
        <CCol sm={5} className="d-none d-md-block mt-2">
          <CInputGroup className="floatt-endd me-33">
            <CInputGroupText className="border border-dark bg-dark text-white">Mes</CInputGroupText>
            <CFormSelect
              size="lgg"
              onChange={(e) => {
                setMes(e.target.value)
              }}
            >
              {listMonth.map((month, index) => (
                <option
                  key={'month_' + month}
                  value={('' + parseInt(index + 1)).toString().padStart(2, 0)}
                  selected={parseInt(index + 1) === parseInt(mes) ? true : false}
                >
                  {month}
                </option>
              ))}
            </CFormSelect>
            <CInputGroupText className="border border-dark bg-dark text-white">Año</CInputGroupText>
            <CFormSelect
              onChange={(e) => {
                setAnho(e.target.value)
              }}
            >
              {listYear.map((year) => (
                <option
                  key={'year_' + year}
                  value={year}
                  selected={parseInt(year) === parseInt(anho) ? true : false}
                >
                  {year}
                </option>
              ))}
            </CFormSelect>
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <ToastContainer position="bottom-center" autoClose={1000} />
        </CCol>
      </CRow>
      <CRow>
        <CAccordion flush activeItemKey={1}>
          {/* TIEMPOS POR CLIENTES */}
          <CAccordionItem itemKey={1} className="mb-2">
            <CAccordionHeader>TIEMPOS POR CLIENTES</CAccordionHeader>
            <CAccordionBody>
              <CCol xs={12}>
                <CCard className="mb-4">
                  {/* <CCardHeader className="fw-boldd">TIEMPOS POR CLIENTES</CCardHeader> */}
                  <CCardBody>
                    {datosTiemposPorClientes.length > 0 ? (
                      <CRow>
                        <CCol>
                          <CTable>
                            <CTableHead color="dark">
                              <CTableRow>
                                <CTableHeaderCell scope="col">CLIENTE</CTableHeaderCell>
                                <CTableHeaderCell scope="col">HORAS</CTableHeaderCell>
                                {/* <CTableHeaderCell scope="col">CANTIDAD</CTableHeaderCell> */}
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {datosTiemposPorClientes.map((tiemClient) => (
                                // eslint-disable-next-line react/jsx-key
                                <CTableRow key={nanoid()}>
                                  <CTableHeaderCell scope="row">
                                    {tiemClient.Cliente}
                                  </CTableHeaderCell>
                                  <CTableDataCell>{tiemClient.Tiempos}</CTableDataCell>
                                  {/* <CTableDataCell>{tiemClient.Cuenta}</CTableDataCell> */}
                                </CTableRow>
                              ))}
                            </CTableBody>
                          </CTable>
                        </CCol>
                        <CCol>
                          <CChartBar
                            data={{
                              labels: datosTiemposPorClientes.map(function (dato) {
                                return dato.Cliente
                              }),
                              datasets: [
                                {
                                  label: 'Horas',
                                  backgroundColor: '#f87979',
                                  data: datosTiemposPorClientes.map(function (dato) {
                                    return dato.Tiempos
                                  }), // [40, 20, 12, 39, 10, 40, 39, 80, 40],
                                },
                              ],
                            }}
                            labels="months"
                          />
                        </CCol>
                      </CRow>
                    ) : (
                      <CAlert color="secondary" height="450px">
                        Sin información para visualizar
                      </CAlert>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CAccordionBody>
          </CAccordionItem>
          {/* TIEMPOS REGISTRADOS POR DIA */}
          <CAccordionItem itemKey={2} className="mb-2">
            <CAccordionHeader>DIAS REGISTRADOS</CAccordionHeader>
            <CAccordionBody>
              <CCol xs={12}>
                <CCard className="mb-4">
                  {/* <CCardHeader className="fw-boldd">DIAS REGISTRADOS</CCardHeader> */}
                  <CCardBody>
                    {datosTiemposPorDias.length > 0 ? (
                      <CRow>
                        <CCol xs={3}>
                          <CTable>
                            <CTableHead color="dark">
                              <CTableRow>
                                <CTableHeaderCell scope="col">DIA</CTableHeaderCell>{' '}
                                <CTableHeaderCell scope="col">HORAS</CTableHeaderCell>
                                <CTableHeaderCell scope="col">ATRASO</CTableHeaderCell>
                              </CTableRow>
                            </CTableHead>
                            <CTableBody>
                              {datosTiemposPorDias.map((tiemDia) => (
                                // eslint-disable-next-line react/jsx-key
                                <CTableRow>
                                  <CTableHeaderCell scope="row">{tiemDia.Dia}</CTableHeaderCell>
                                  <CTableDataCell className="text-right">
                                    {tiemDia.Tiempos}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    className={`text-right ${
                                      tiemDia.Atraso / tiemDia.Cuenta > 0
                                        ? 'text-danger'
                                        : 'text-success'
                                    }`}
                                  >
                                    {tiemDia.Atraso / tiemDia.Cuenta}
                                  </CTableDataCell>
                                </CTableRow>
                              ))}
                            </CTableBody>
                          </CTable>
                        </CCol>
                        {/*GRAFICO*/}
                        <CCol xs={9}>
                          <CChartLine
                            data={{
                              labels: datosTiemposPorDias.map(function (dato) {
                                return dato.Dia
                              }),
                              datasets: [
                                {
                                  label: 'Días atraso',
                                  backgroundColor: 'rgba(229, 83, 83)',
                                  borderColor: 'rgba(79, 93, 115)',
                                  pointBackgroundColor: 'rgba(229, 83, 83, 1)',
                                  pointBorderColor: '#e55353',
                                  data: datosTiemposPorDias.map(function (dato) {
                                    return dato.Atraso / dato.Cuenta
                                  }),
                                },
                              ],
                            }}
                          />
                        </CCol>
                      </CRow>
                    ) : (
                      <CAlert color="secondary" height="450px">
                        Sin información para visualizar
                      </CAlert>
                    )}
                  </CCardBody>
                </CCard>
              </CCol>
            </CAccordionBody>
          </CAccordionItem>
          {/* TIEMPOS REGISTRADOS POR AREA */}
          <CAccordionItem itemKey={3} className="mb-3">
            <CAccordionHeader>TIEMPOS POR AREA Y ETAPA</CAccordionHeader>
            <CAccordionBody>
              <CRow>
                <CCol xs={6}>
                  <CCard className="mb-4">
                    <CCardHeader>TIEMPOS POR AREA</CCardHeader>
                    <CCardBody>
                      {datosTiemposPorAreas.length > 0 ? (
                        <CChartPie
                          data={{
                            labels: datosTiemposPorAreas.map(function (dato) {
                              return dato.Area
                            }),
                            datasets: [
                              {
                                data: datosTiemposPorAreas.map(function (dato) {
                                  return dato.Tiempos
                                }),
                                backgroundColor: generarArrayDeColores(
                                  datosTiemposPorEtapas.length,
                                ), //['#FF6384', '#36A2EB', '#FFCE56'],
                                hoverBackgroundColor: generarArrayDeColores(
                                  datosTiemposPorEtapas.length,
                                ), //['#FF6384', '#36A2EB', '#FFCE56'],
                              },
                            ],
                          }}
                        />
                      ) : (
                        <CAlert color="secondary" height="450px">
                          Sin información para visualizar
                        </CAlert>
                      )}
                    </CCardBody>
                  </CCard>
                </CCol>
                {/* TIEMPOS REGISTRADOS POR ETAPA */}
                <CCol xs={6}>
                  <CCard className="mb-4">
                    <CCardHeader>TIEMPOS POR ETAPA</CCardHeader>
                    <CCardBody>
                      {/* <CChartPolarArea
              data={{
                labels: datosTiemposPorEtapas.map(function (dato) {
                  return dato.Etapa
                }),
                datasets: [
                  {
                    data: datosTiemposPorEtapas.map(function (dato) {
                      return dato.Tiempos
                    }),
                    backgroundColor: generarArrayDeColores(datosTiemposPorEtapas.length), //['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
                  },
                ],
              }}
            /> */}
                      {datosTiemposPorEtapas.length > 0 ? (
                        <CChart
                          type="doughnut"
                          data={{
                            labels: datosTiemposPorEtapas.map(function (dato) {
                              return dato.Etapa
                            }),
                            datasets: [
                              {
                                backgroundColor: generarArrayDeColores(
                                  datosTiemposPorEtapas.length,
                                ),
                                data: datosTiemposPorEtapas.map(function (dato) {
                                  return dato.Tiempos
                                }),
                              },
                            ],
                          }}
                        />
                      ) : (
                        <CAlert color="secondary" height="450px">
                          Sin información para visualizar
                        </CAlert>
                      )}
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CRow>
    </>
  )
}

export default Charts
