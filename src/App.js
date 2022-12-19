import { CSpinner } from '@coreui/react'
import React, { Component, Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { CButton } from '@coreui/react'
import { loginRequest } from './authConfig'
import { callMsGraph } from './graph'
import { ProfileData } from './components/ProfileData'
import { redirect } from 'react-router-dom'

import './scss/style.scss'
import './assets/css/dataTableCustom.css'

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

const ProfileContent = () => {
  const { instance, accounts } = useMsal()
  const [graphData, setGraphData] = useState(null)

  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) => setGraphData(response))
      })
  }

  return (
    <>
      <h5 className="card-title">
        Welcome {JSON.stringify(accounts[0])} {accounts[0].username}
      </h5>
      {graphData ? (
        <ProfileData graphData={graphData} />
      ) : (
        <CButton color="secondary" onClick={RequestProfileData}>
          Request Profile Information
        </CButton>
      )}
    </>
  )
}

const VerificarAcount = () => {
  const { instance, accounts } = useMsal()
  const [graphData, setGraphData] = useState(null)

  useEffect(() => {
    RequestProfileData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) => setGraphData(response))
      })
  }

  //console.log(graphData)
  return (
    <>
      {/* graphData.userPrincipalName === accounts[0].username */}
      {accounts[0].username &&
      accounts[0].username.split('@')[1] === process.env.REACT_APP_AUTH_MS_DOMAIN ? (
        <DefaultLayout />
      ) : (
        <Page404 />
      )}
    </>
  )
}

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Suspense fallback={loading}>
          <AuthenticatedTemplate>
            <VerificarAcount />
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
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
