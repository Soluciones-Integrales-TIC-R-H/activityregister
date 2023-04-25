import { useMsal } from '@azure/msal-react'
import { useEffect, useState } from 'react'
import { loginRequest } from 'src/authConfig'
import { callMsGraph } from 'src/graph'

export function VerificarAcount() {
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

  return (
    accounts[0].username &&
    accounts[0].username.split('@')[1] === process.env.REACT_APP_AUTH_MS_DOMAIN
  )
}

export function DatosAcount() {
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

  return VerificarAcount ? { email: accounts[0].username, nombre: accounts[0].name } : {}
}
