import Axios from 'axios'
//import { redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AlertSwal } from 'src/components/Alert'
import { CONFIG_HEADER_AUTH } from 'src/utilities/config'
//import { cifrar } from 'src/utilities/crypto'
import { refreshPage, cifrar } from 'src/utilities/utilidades'

//==================================REFRESCAR==================================
// export function refreshPage(time = 1000) {
//   setTimeout(() => {
//     window.location.reload()
//   }, time)
// }

//==================================NO ACTION==================================
export const noAction = async (
  icon = 'warning',
  title = '',
  msn = 'No se puede realizar la acción solicitada',
) => {
  AlertSwal(icon, title, msn, true, 'Aceptar', 'dark', '')
}

//==================================ELIMINAR==================================
export const eliminarLogicamente = async (
  url,
  codigo,
  msnExito = 'Registro inhabilitado',
  msnError = 'Registro no se pudo inhabilitar',
) => {
  console.log('Eliminando')
  if (url !== '' && codigo !== '') {
    try {
      const response = await Axios.put(url, { codigo: codigo }, CONFIG_HEADER_AUTH)
      //console.log(response)
      if (response.status === 200) {
        //toast.success(msnExito)
        AlertSwal('success', '', msnExito, false, 'Ok', 'success', '')
        refreshPage(1000)
      } else {
        toast.error(response.data.detail)
        AlertSwal('warning', '', response.data.detail, false, 'Aceptar', 'warning', '')
      }
    } catch (error) {
      //console.error(error)
      toast.error(msnError)
    }
  } else {
    toast.warning('Error de parametrizacíon interna')
    AlertSwal('error', 'Error', 'Error de parametrizacíon interna', 'Ok', 'danger', '')
  }
}

//==================================RESTAURAR==================================
export const restaurarLogicamente = async (
  url,
  codigo,
  msnExito = 'Registro habilitado',
  msnError = 'Registro no se pudo habilitar',
) => {
  console.log('Restaurando')
  if (url !== '' && codigo !== '') {
    try {
      const response = await Axios.put(url, { codigo: codigo }, CONFIG_HEADER_AUTH)
      //console.log(response)
      if (response.status === 200) {
        //toast.success(msnExito)
        AlertSwal('success', '', msnExito, false, '', 'success', '')
        refreshPage(1000)
      } else {
        toast.error(response.data.detail)
      }
    } catch (error) {
      //console.error(error)
      toast.error(msnError)
    }
  } else {
    toast.warning('Error de parametrizacíon interna')
  }
}

//==================================VISUALIZAR==================================
export const visualizar = (url, codigo) => {
  console.log('Texto recibido', codigo)
  //const textoEncriptado = await encriptar('Doble4O99I*', codigo)
  const textoEncriptado = cifrar(codigo)
  //console.log(cifrar(textoEncriptado))
  //console.log(`${url}/${codigo}`)
  window.location.href = '#' + url + '/' + textoEncriptado
  refreshPage()
  //return redirect(`${url}/${codigo}`)
}
