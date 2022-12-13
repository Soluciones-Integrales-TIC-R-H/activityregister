import React from 'react'
import { useMsal } from '@azure/msal-react'
import { CButton } from '@coreui/react'

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
    <CButton onClick={() => (logoutPopup ? handleLogout('popup') : handleLogout('redirect'))}>
      {titleButton}
    </CButton>
  )
}
