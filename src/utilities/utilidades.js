import CryptoJS from 'crypto-js'
import { CONFIG_SECUR } from './config'
import { string } from 'prop-types'

const CLAVE_CIFRA = CONFIG_SECUR.ACCESS_KEY

//==================================REFRESCAR==================================
export function refreshPage(time = 100) {
  setTimeout(() => {
    window.location.reload()
  }, time)
}

export function redireccionar(time = 1000, url) {
  if (url !== '') {
    setTimeout(() => {
      window.location.href = url
    }, time)
  }
}

//==================================TEXTOS ==================================
export const replaceCharacters = (textIn, originalCharacter, replacement) => {
  return textIn.replaceAll(originalCharacter, replacement)
}

export const destroyArray = (datoIn) => {
  var datoOut = datoIn
  if (datoIn.includes('[')) {
    datoOut = datoOut.replaceAll('[', '')
  }
  if (datoIn.includes(']')) {
    datoOut = datoOut.replaceAll(']', '')
  }
  //const texto1 = datoIn.replaceAll('[', '')
  //return texto1.replaceAll(']', '')
  return datoOut
}

export function capitalLetter(str = '') {
  str = str.trim()
  return str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str
}

export function upperLetter(str = '') {
  str = str.trim()
  return str.length > 0 ? str.toUpperCase() : str
}

export function lowerLetter(str = '') {
  str = str.trim()
  return str.length > 0 ? str.toLowerCase() : str
}

export function removerCamelCase(texto = '', separador = ' ') {
  // if (texto.constructor !== String) {
  //   throw TypeError('El argumento debe ser una cadena de caracteres.')
  // }
  texto = texto.trim()
  let resultado = texto.replace(/[A-Z]/g, (letra) => separador + letra.toLowerCase())

  return resultado.replace('/^' + separador + '/', '').trim()
}

//=================================ENCRIPTAR==================================
export const cifrar = (texto) => {
  const textoCifrado = CryptoJS.AES.encrypt('COD#' + texto, CLAVE_CIFRA)
  const nuevoTextoCifrado = replaceCharacters(textoCifrado.toString(), '/', 'DOC')
  return nuevoTextoCifrado //textoCifrado.toString()
}

//================================DESENCRIPTAR=================================
export const descifrar = (textoEncriptado) => {
  const originalEncodeDuCifrado = replaceCharacters(textoEncriptado, 'DOC', '/')
  const bytes = CryptoJS.AES.decrypt(originalEncodeDuCifrado, CLAVE_CIFRA)
  const textoDescifrado = bytes.toString(CryptoJS.enc.Utf8)
  //console.log('Texto descifrado', textoDescifrado.substring(4))
  return textoDescifrado.substring(4)
}

//=========================SUMAR O RESTAR DIAS A  UNA FECHA====================
export const sumarDiasTofecha = (fecha, dias) => {
  fecha.setDate(fecha.getDate() + dias)
  return fecha
}

//=========================SUMAR O RESTAR DIAS A  UNA FECHA====================
export const transformarFechaYMD = (fecha = new Date(), separador = '-') => {
  return (
    fecha.getFullYear() +
    separador +
    (fecha.getMonth() + 1).toString().padStart(2, 0) +
    separador +
    fecha.getDate().toString().padStart(2, 0)
  )
}

//===========================EXTRAER DATOS DE UNA FECHA=========================
export const extraerAnhoToFecha = (fecha = new Date()) => {
  return fecha.getFullYear()
}

export const extraerMesToFecha = (fecha = new Date()) => {
  return (fecha.getMonth() + 1).toString().padStart(2, 0)
}

export const extraerDiaToFecha = (fecha = new Date()) => {
  return fecha.getDate().toString().padStart(2, 0)
}

// export const extraerPrimerDiaToFecha = (fecha = new Date()) => {
//   var primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1)
//   console.log(fecha)
//   return primerDia.getDate().toString().padStart(2, 0)
// }

export const extraerUltimoDiaToFecha = (fecha = new Date()) => {
  var ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)
  return ultimoDia.getDate().toString().padStart(2, 0)
}

//=============================GENERADOR DE COLORES===========================
export const generarColor = () => {
  var simbolos, color
  simbolos = '0123456789ABCDEF'
  color = '#'

  for (var i = 0; i < 6; i++) {
    color = color + simbolos[Math.floor(Math.random() * 16)]
  }
  return color
}

export const generarArrayDeColores = (cantidad = 1) => {
  let arrayColores = []
  for (var i = 0; i < cantidad; i++) {
    let color = generarColor()
    while (arrayColores.find((element) => element === 5)) {
      color = generarColor()
    }
    arrayColores.push(color)
  }
  return arrayColores
}

//=============================HERRAMIENTAS WINDOWS===========================
export const bloquearClickDerecho = () => {
  function disableIE() {
    if (document.all) {
      return false
    }
  }
  function disableNS(e) {
    if (document.layers || (document.getElementById && !document.all)) {
      if (e.which === 2 || e.which === 3) {
        return false
      }
    }
  }
  if (document.layers) {
    document.captureEvents(Event.MOUSEDOWN)
    document.onmousedown = disableNS
  } else {
    document.onmouseup = disableNS
    document.oncontextmenu = disableIE
  }

  document.oncontextmenu = function () {
    return false
  }
}

onkeydown = (e) => {
  let tecla = e.which || e.keyCode
  // Evaluar si se ha presionado la tecla Ctrl:
  if (e.ctrlKey) {
    if (tecla === 83 || tecla === 85) {
      // Evitar el comportamiento por defecto del nevagador:
      e.preventDefault()
      e.stopPropagation()
      // Mostrar el resultado de la combinación de las teclas:
      if (tecla === 85) console.log('Ha presionado las teclas Ctrl + U')
      if (tecla === 83) console.log('Ha presionado las teclas Ctrl + S')
    }
  }
  // if (e.keyCode) {
  //   // Evitar el comportamiento por defecto del nevagador:
  //   e.preventDefault()
  //   e.stopPropagation()
  //   if (tecla === 123) console.log('Ha presionado la tecla F12')
  // }
}
