import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const AlertSwal = (icon, title, text, textButton, colorButton, footer) => {
  return MySwal.fire({
    icon: icon,
    title: title,
    text: text,
    confirmButtonText: textButton,
    confirmButtonColor: colorButton,
    footer: footer,
  })
}

export default AlertSwal
