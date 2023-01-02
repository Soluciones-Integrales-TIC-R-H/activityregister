import CryptoJS from 'crypto-js'

const CLAVE_CIFRA = process.env.REACT_APP_API_AREA_POR_CODIGO

//==================================REFRESCAR==================================
export function refreshPage(time = 1000) {
  setTimeout(() => {
    window.location.reload()
  }, time)
}

//==================================REMPLAZAR==================================
export const remplaceCaracteres = (textoOriginal, caracterOriginal, remplazo) => {
  return textoOriginal.replaceAll(caracterOriginal, remplazo)
}

export const destroyArray = (textoOriginal) => {
  const texto1 = textoOriginal.replaceAll('[', '')
  return texto1.replaceAll(']', '')
}
//=================================ENCRIPTAR==================================
export const cifrar = (texto) => {
  const textoCifrado = CryptoJS.AES.encrypt('COD#' + texto, CLAVE_CIFRA)
  const nuevoTextoCifrado = remplaceCaracteres(textoCifrado.toString(), '/', 'DOC')
  return nuevoTextoCifrado //textoCifrado.toString()
}

//==================================DESENCRIPTAR==================================
export const descifrar = (textoEncriptado) => {
  const originalEncodeDuCifrado = remplaceCaracteres(textoEncriptado, 'DOC', '/')
  const bytes = CryptoJS.AES.decrypt(originalEncodeDuCifrado, CLAVE_CIFRA)
  const textoDescifrado = bytes.toString(CryptoJS.enc.Utf8)
  //console.log('Texto descifrado', textoDescifrado.substring(4))
  return textoDescifrado.substring(4)
}
