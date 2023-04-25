//import CryptoJS from 'crypto-js'

/*
const $contrasenhaEncriptar = document.querySelector('#contrasenhaEncriptar'),
  $informacionEncriptar = document.querySelector('#informacionEncriptar'),
  $resultadoEncriptacion = document.querySelector('#resultadoEncriptacion'),
  $botonEncriptar = document.querySelector('#botonEncriptar'),
  $contrasenhaDesencriptar = document.querySelector('#contrasenhaDesencriptar'),
  $informacionDesencriptar = document.querySelector('#informacionDesencriptar'),
  $resultadoDesencriptacion = document.querySelector('#resultadoDesencriptacion'),
  $botonDesencriptar = document.querySelector('#botonDesencriptar')
*/
const bufferABase64 = (buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)))
const base64ABuffer = (buffer) => Uint8Array.from(atob(buffer), (c) => c.charCodeAt(0))
const LONGITUD_SAL = 16
const LONGITUD_VECTOR_INICIALIZACION = LONGITUD_SAL

const derivacionDeClaveBasadaEnContrasenha = async (
  contrasenha,
  sal,
  iteraciones,
  longitud,
  hash,
  algoritmo = 'AES-CBC',
) => {
  const encoder = new TextEncoder()
  let keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(contrasenha),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(sal),
      iterations: iteraciones,
      hash,
    },
    keyMaterial,
    { name: algoritmo, length: longitud },
    false,
    ['encrypt', 'decrypt'],
  )
}

const encriptar = async (contrasenha, textoPlano) => {
  const encoder = new TextEncoder()
  const sal = window.crypto.getRandomValues(new Uint8Array(LONGITUD_SAL))
  const vectorInicializacion = window.crypto.getRandomValues(
    new Uint8Array(LONGITUD_VECTOR_INICIALIZACION),
  )
  const bufferTextoPlano = encoder.encode(textoPlano)
  const clave = await derivacionDeClaveBasadaEnContrasenha(contrasenha, sal, 100000, 256, 'SHA-256')
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv: vectorInicializacion },
    clave,
    bufferTextoPlano,
  )
  return bufferABase64([...sal, ...vectorInicializacion, ...new Uint8Array(encrypted)])
}

const desencriptar = async (contrasenha, encriptadoEnBase64) => {
  const decoder = new TextDecoder()
  const datosEncriptados = base64ABuffer(encriptadoEnBase64)
  const sal = datosEncriptados.slice(0, LONGITUD_SAL)
  const vectorInicializacion = datosEncriptados.slice(
    0 + LONGITUD_SAL,
    LONGITUD_SAL + LONGITUD_VECTOR_INICIALIZACION,
  )
  const clave = await derivacionDeClaveBasadaEnContrasenha(contrasenha, sal, 100000, 256, 'SHA-256')
  const datosDesencriptadosComoBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: vectorInicializacion },
    clave,
    datosEncriptados.slice(LONGITUD_SAL + LONGITUD_VECTOR_INICIALIZACION),
  )
  return decoder.decode(datosDesencriptadosComoBuffer)
}

// const 
replaceCharacters = (textoOriginal, caracterOriginal, remplazo) => {
//   return textoOriginal.replaceAll(caracterOriginal, remplazo)
// }

// const cifrar = (texto) => {
//   const textoCifrado = CryptoJS.AES.encrypt('COD#' + texto, 'Doble4O99I*')
//   const nuevoTextoCifrado = 
replaceCharacters(textoCifrado.toString(), '/', 'DOC')
//   return nuevoTextoCifrado //textoCifrado.toString()
// }

// const descifrar = (textoEncriptado) => {
//   const originalEncodeDuCifrado = 
replaceCharacters(textoEncriptado, 'DOC', '/')
//   //const bytes = CryptoJS.AES.decrypt(textoEncriptado, 'Doble4O99I*')
//   const bytes = CryptoJS.AES.decrypt(originalEncodeDuCifrado, 'Doble4O99I*')
//   const textoDescifrado = bytes.toString(CryptoJS.enc.Utf8)
//   console.log('Texto descifrado', textoDescifrado.substring(4))
//   return textoDescifrado.substring(4)
// }

/*
$botonEncriptar.onclick = async () => {
  const contrasenha = $contrasenhaEncriptar.value
  if (!contrasenha) {
    return alert('No hay contraseña')
  }
  const textoPlano = $informacionEncriptar.value
  if (!textoPlano) {
    return alert('No hay texto para encriptar')
  }
  const encriptado = await encriptar(contrasenha, textoPlano)
  $resultadoEncriptacion.value = encriptado
}
*/
/*
$botonDesencriptar.onclick = async () => {
  const contrasenha = $contrasenhaDesencriptar.value
  if (!contrasenha) {
    return alert('No hay contraseña')
  }
  const textoCifradoBase64 = $informacionDesencriptar.value
  if (!textoCifradoBase64) {
    return alert('No hay texto en base64')
  }
  try {
    const desencriptado = await desencriptar(contrasenha, textoCifradoBase64)
    $resultadoDesencriptacion.value = desencriptado
  } catch (e) {
    $resultadoDesencriptacion.value =
      'Error desencriptando: ' +
      e.message +
      '. ¿La contrasenha es la correcta y la información está en base64?'
  }
}
*/
export { encriptar, desencriptar }
