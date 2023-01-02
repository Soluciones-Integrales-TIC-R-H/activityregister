import Axios from 'axios'
//import { redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
//import { cifrar } from 'src/utilities/crypto'
import { refreshPage, cifrar } from 'src/utilities/utilidades'

//==================================REFRESCAR==================================
// export function refreshPage(time = 1000) {
//   setTimeout(() => {
//     window.location.reload()
//   }, time)
// }
//==================================ELIMINAR==================================
export const eliminarLogicamente = async (
  url,
  codigo,
  msnExito = 'Registro inhabilitado',
  msnError = 'Registro no se pudo inhabilitar',
) => {
  console.log('Eliminando')
  if (url !== '' && codigo !== '') {
    Axios.put(url, { codigo: codigo }).then((data) => {
      console.log(data)
      if (data.status === 200) {
        toast.success(msnExito)
        refreshPage()
      } else {
        toast.error(msnError)
      }
    })
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
    await Axios.put(url, { codigo: codigo }).then((data) => {
      if (data.status === 200) {
        toast.success(msnExito)
        refreshPage()
      } else {
        toast.error(msnError)
      }
    })
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
