import React from 'react'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../authConfig'
import { CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
// eslint-disable-next-line react/prop-types
export const SignInButton = ({ loginPopup = false, titleButton }) => {
  const { instance } = useMsal()

  const handleLogin = (loginType) => {
    if (loginType === 'popup') {
      instance.loginPopup(loginRequest).catch((e) => {
        console.log(e)
      })
    } else if (loginType === 'redirect') {
      instance.loginRedirect(loginRequest).catch((e) => {
        console.log(e)
      })
    }
  }
  return (
    <CButton onClick={() => (loginPopup ? handleLogin('popup') : handleLogin('redirect'))}>
      <CIcon icon={cilLockLocked} /> {titleButton}
    </CButton>
  )
}
