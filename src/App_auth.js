import React, { useState } from 'react'
import './scss/style.scss'
import { PageLayout } from './components/PageLayout'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react'
import { CButton, CContainer } from '@coreui/react'
import { loginRequest } from './authConfig'
import { callMsGraph } from './graph'
import { ProfileData } from './components/ProfileData'
import Login from './views/pages/login/Login'

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
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
        Welcome {JSON.stringify(accounts[0])} {accounts[0].name}
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

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
 */
const MainContent = () => {
  return (
    <div className="App">
      <AuthenticatedTemplate>
        <ProfileContent />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <h5 className="card-title">Please sign-in to see your profile information.</h5>
        {/* <CContainer>
          <Login />
        </CContainer> */}
      </UnauthenticatedTemplate>
    </div>
  )
}

export default function App() {
  return (
    <PageLayout>
      <MainContent />
    </PageLayout>
  )
}
