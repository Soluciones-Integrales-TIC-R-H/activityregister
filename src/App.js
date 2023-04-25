import { CSpinner } from '@coreui/react'
import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { redirect } from 'react-router-dom'

import './scss/style.scss'
import './assets/css/dataTableCustom.css'
import { bloquearClickDerecho } from './utilities/utilidades'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { VerificarAcount } from './components/VerificarAcount'

const loading = (
  <div className="pt-5 text-center">
    {/* <div className="sk-spinner sk-spinner-pulse"></div> */}
    <CSpinner ccolor="dark" variant="grow" style={{ width: '200px', height: '200px' }} />
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
//const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// eslint-disable-next-line no-unused-vars
const redirectlogin = () => {
  return redirect('/dashboard')
}

const VeryCuenta = () => {
  const very = VerificarAcount()
  return <>{very ? <DefaultLayout /> : <Page404 />}</>
}

class App extends Component {
  render() {
    // bloquearClickDerecho()
    return (
      <HashRouter>
        {/* <ProfileContent /> */}
        <Suspense fallback={loading}>
          <AuthenticatedTemplate>
            <VeryCuenta />
          </AuthenticatedTemplate>
          <Routes>
            {/* <Route exact path="/login" name="Login Page" element={<Login />} />
            <Route exact path="/register" name="Register Page" element={<Register />} /> */}
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            {/* <Route path="*" name="Home" element={<DefaultLayout />} /> */}
          </Routes>
          <UnauthenticatedTemplate>
            <Login />
          </UnauthenticatedTemplate>
          <ToastContainer position="bottom-center" autoClose={1000} />
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
