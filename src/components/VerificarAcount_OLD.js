import { useMsal } from '@azure/msal-react'
import { useEffect, useState } from 'react'
import Axios from 'axios'
import { loginRequest } from 'src/authConfig'
import { callMsGraph } from 'src/graph'
import { CONFIG_HEADER_AUTH, CONFIG_HEADER_NO_AUTH } from 'src/utilities/config'
import { clearSessionStorage, clearStorage, setStorage } from 'src/utilities/storage'

import 'react-toastify/dist/ReactToastify.css'
import { AlertSwal } from './Alert'
import { refreshPage } from 'src/utilities/utilidades'

const URL_API_AUTH = process.env.REACT_APP_API_AUTH_LOGIN
const URL_API_AUTH_PERMISOS = process.env.REACT_APP_API_AUTH_ME_PERMISSION

export function VerificarAcount() {
  const { instance, accounts } = useMsal()
  const [graphData, setGraphData] = useState(null)

  const loadData = async () => {
    try {
      const response = await Axios.post(
        URL_API_AUTH,
        {
          email: accounts[0] ? accounts[0].username : '',
          name: accounts[0] ? accounts[0].name : '',
        },
        CONFIG_HEADER_NO_AUTH,
      )
      if (response.data) {
        setStorage('Token', response.data.Bamba)
        // AlertSwal('success', 'Bienvenido', accounts[0].name, 'Ok', 'danger', '')
      } else {
        //toast.error('No se pudo generar la consulta')
        clearStorage()
        clearSessionStorage()
        AlertSwal(
          'warning',
          'Notificación',
          'No se pudo generar la consulta',
          false,
          'Aceptar',
          'dark',
          '',
        )
        refreshPage(2000)
      }
    } catch (error) {
      clearStorage()
      clearSessionStorage()
      AlertSwal('error', '', error.response.data.detail, true, 'Aceptar', 'dark', '')
      refreshPage(2000)
      //refreshPage()
    }
  }

  useEffect(() => {
    RequestProfileData()
    loadData()
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

  /* VALIDAR CONTRA EL BACK */
  /* graphData.userPrincipalName === accounts[0].username */

  return (
    accounts[0].username &&
    accounts[0].username.split('@')[1] === process.env.REACT_APP_AUTH_MS_DOMAIN
  )
}

export async function DatosAcount() {
  const { instance, accounts } = useMsal()
  const [graphData, setGraphData] = useState(null)

  /*
  const loadPermisos = async () => {
    let permisos = ''
    try {
      permisos = await Axios.post(
        URL_API_AUTH_PERMISOS,
        {
          email: accounts[0] ? accounts[0].username : '',
        },
        CONFIG_HEADER_NO_AUTH,
      )
      if (permisos.data.result.permisos) {
        console.log(permisos.data.result.permisos)
        setStorage('Permisos', JSON.stringify(permisos.data.result.permisos))
        //AlertSwal('success', 'Bienvenido', accounts[0].name, 'Ok', 'danger', '')
      } else {
        //toast.error('No se pudo generar la consulta')
        clearStorage()
        clearSessionStorage()
        AlertSwal(
          'warning',
          'Notificación',
          'No se pudo generar la consulta',
          false,
          'Aceptar',
          'dark',
          '',
        )
        refreshPage(2000)
      }
    } catch (error) {
      // clearStorage()
      // clearSessionStorage()
      AlertSwal('error', '', error.message, true, 'Aceptar', 'dark', '')
      //refreshPage(2000)
      //refreshPage()
    }
  }
*/
  useEffect(() => {
    RequestProfileData()
    //loadPermisos()
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
