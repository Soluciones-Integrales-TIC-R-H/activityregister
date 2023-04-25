import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const AlertSwal = (
  icon,
  title,
  text,
  showConfirmButton = true,
  textButton,
  colorButton,
  footer,
) => {
  return MySwal.fire({
    icon: icon,
    title: title,
    text: text,
    showConfirmButton: showConfirmButton,
    confirmButtonText: textButton ? textButton : 'Ok',
    confirmButtonColor: colorButton,
    footer: footer,
  })
}

export { AlertSwal }
