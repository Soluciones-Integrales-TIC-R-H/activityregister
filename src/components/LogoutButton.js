import React from 'react'
import { useMsal } from '@azure/msal-react'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilAccountLogout } from '@coreui/icons'

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
// eslint-disable-next-line react/prop-types
export const SignOutButton = ({ logoutPopup = false, titleButton }) => {
  const { instance } = useMsal()

  const handleLogout = async (logoutType) => {
    if (logoutType === 'popup') {
      instance.logoutPopup({
        postLogoutRedirectUri: '/',
        mainWindowRedirectUri: '/',
      })
    } else if (logoutType === 'redirect') {
      //OLD
      // instance.logoutRedirect({
      //   postLogoutRedirectUri: '/',
      // })
      //NUEVO
      // eslint-disable-next-line no-undef
      const currentAccount = instance.getAccountByHomeId() //homeAccountId
      // El token de identificación de la cuenta debe contener el reclamo opcional login_hint para evitar el selector de cuenta
      instance.logoutRedirect({ account: currentAccount, postLogoutRedirectUri: '/' })
    }
  }
  return (
    <div className="d-grid gap-2 mx-auto">
      <CButton
        variant="ghost"
        color="danger"
        onClick={() => (logoutPopup ? handleLogout('popup') : handleLogout('redirect'))}
      >
        <CIcon icon={cilAccountLogout} /> {titleButton}
      </CButton>
    </div>
  )
}
