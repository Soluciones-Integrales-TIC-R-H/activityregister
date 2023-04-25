import React from 'react'
import { SignOutButton } from 'src/components/LogoutButton'
import {
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { DatosAcount } from '../VerificarAcount'

const AppHeaderDropdown = () => {
  const datosFuncionario = DatosAcount()
  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <div className="m-0 justify-content-center align-items-center text-center">
            <div
              className="bg-dark text-white text-uppercase font-weight-bold border rounded-circle mx-autoo fs-4"
              style={{ width: '40px', height: '40px' }}
            >
              {datosFuncionario ? datosFuncionario.nombre.slice(0, 1) : 'AA'}
            </div>
          </div>
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-dark text-white fw-semibold py-2">Cuenta</CDropdownHeader>
          <CDropdownHeader className="bg-secondary text-white fw-semibold py-2">
            {datosFuncionario ? datosFuncionario.nombre : 'Usuario'}
          </CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilBell} className="me-2" />
            Actualizaciones
            <CBadge color="info" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilEnvelopeOpen} className="me-2" />
            Mensajes
            <CBadge color="success" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilTask} className="me-2" />
            Tareas
            <CBadge color="danger" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilCommentSquare} className="me-2" />
            Comentarios
            <CBadge color="warning" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownHeader className="bg-secondary text-white fw-semibold py-2">
            Configuraciónes
          </CDropdownHeader>
          <CDropdownItem href="#">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilSettings} className="me-2" />
            Ajustes
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilCreditCard} className="me-2" />
            Pagos
            <CBadge color="secondary" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownItem href="#">
            <CIcon icon={cilFile} className="me-2" />
            Proyectos
            <CBadge color="primary" className="ms-2">
              42
            </CBadge>
          </CDropdownItem>
          <CDropdownDivider />
          <CDropdownItem href="#" className="btn">
            <CIcon icon={cilLockLocked} className="me-2" />
            Bloquear
          </CDropdownItem>
          <SignOutButton className="w-100 text-center" logoutPopup={false} titleButton={'Salir'} />
        </CDropdownMenu>
      </CDropdown>
    </>
  )
}

export default AppHeaderDropdown
