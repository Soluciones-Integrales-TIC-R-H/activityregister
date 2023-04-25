import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CImage,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowThickLeft } from '@coreui/icons'
import fondoImg from './../../../assets/images/fondos/bg-fondo.jpg'
import logoCliente from './../../../assets/images/logos/cliente.png'
import { CONFIG_APP } from 'src/utilities/config'

const Page500 = () => {
  return (
    <div
      style={{
        backgroundImage: 'url(' + fondoImg + ')',
      }}
      className="bg-light min-vh-100 d-flex flex-row align-items-center"
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10}>
            <CCardGroup>
              {/* Este texto solo visible para smartphone */}
              <CCard className="d-block d-sm-block d-md-none text-white bg-secondary mb-11 border-none py-1">
                <CCardBody className="text-center">
                  <div>
                    <h2 className="text-uppercase">{CONFIG_APP.NAME}</h2>
                    <p>{CONFIG_APP.DESCRIPTION}</p>
                    <div className="clearfix">
                      <CImage
                        align="center"
                        src={logoCliente}
                        width={300}
                        height={100}
                        // className="img-fluid"
                        rounded={true}
                      />
                    </div>
                  </div>
                </CCardBody>
              </CCard>
              {/* todas las pantallas */}
              <CCard className="p-4">
                <CCardBody>
                  <h1
                    className="float-startt display-3 mee-4 text-center"
                    style={{ fontSize: '100px' }}
                  >
                    500
                  </h1>
                  {/* <h4 className="pt-3">¡Houston, tenemos un problema!</h4> */}
                  <p className="text-medium-emphasis float-start">
                    El recurso que está buscando no está disponible temporalmente.
                  </p>
                  {/* <span className="clearfix">
                    <h1 className="float-start display-3 me-4">500</h1>
                    <h4 className="pt-3">¡Houston, tenemos un problema!</h4>
                    <p className="text-medium-emphasis float-start">
                      El recurso que está buscando no está disponible temporalmente.
                    </p>
                  </span> */}
                  <CButton color="dark">
                    <CIcon icon={cilArrowThickLeft} /> Regresar
                  </CButton>
                </CCardBody>
              </CCard>
              {/* Este texto solo visible para escritorio */}
              <CCard className="d-none d-sm-none d-md-block text-white bg-secondary py-5">
                <CCardBody className="text-center">
                  <div>
                    <h2 className="text-uppercase">{CONFIG_APP.NAME}</h2>
                    <p>{CONFIG_APP.DESCRIPTION}</p>
                    <div className="clearfix">
                      <CImage
                        align="center"
                        src={logoCliente}
                        width={300}
                        height={100}
                        rounded={true}
                      />
                    </div>
                    <Link to="/register" hidden>
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Page500
