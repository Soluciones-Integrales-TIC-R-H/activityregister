import Axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//==================================REFRESCAR==================================
export function refreshPage(time = 1000) {
  setTimeout(() => {
    window.location.reload()
  }, time)
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
    await Axios.get(url + '/' + codigo).then((data) => {
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
    await Axios.get(url + '/' + codigo).then((data) => {
      if (data.status === 200) {
        toast.success(msnExito)
        refreshPage()
      } else {
        toast.error(msnError)
      }
    })
  }
}
