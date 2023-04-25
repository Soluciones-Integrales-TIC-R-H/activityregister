import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import fondoImg from './../../../assets/images/fondos/bg-fondo.jpg'
import logoCliente from './../../../assets/images/logos/cliente.png'
import { SignInButton } from 'src/components/LoginButton'
import { CONFIG_APP } from 'src/utilities/config'

const Login = () => {
  return (
    <div
      style={{
        backgroundImage: 'url(' + fondoImg + ')',
      }}
      className="bg-light min-vh-100 d-flex flex-row align-items-center"
    >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
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
              {/* todas las pantallas */}
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Iniciar sesión en su cuenta</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Username"
                        autoComplete="username"
                        disabled={true}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        disabled={true}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6} hidden>
                        <CButton color="primary" className="px-4" type="submit">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6}>
                        <SignInButton titleButton={'Ingresar'} />
                      </CCol>
                    </CRow>
                  </CForm>
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

export default Login
