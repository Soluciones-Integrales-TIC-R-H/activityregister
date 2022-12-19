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

  const handleLogout = (logoutType) => {
    if (logoutType === 'popup') {
      instance.logoutPopup({
        postLogoutRedirectUri: '/',
        mainWindowRedirectUri: '/',
      })
    } else if (logoutType === 'redirect') {
      instance.logoutRedirect({
        postLogoutRedirectUri: '/',
      })
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
