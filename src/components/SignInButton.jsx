import React from 'react'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../authConfig'
import { CButton, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 */
export const SignInButton = () => {
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
    <CDropdown variant="nav-item" popper={false}>
      <CDropdownToggle>Sign In</CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem href="#">
          <CButton onClick={() => handleLogin('popup')}> Sign in using Popup</CButton>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CButton onClick={() => handleLogin('redirect')}> Sign in using Redirect</CButton>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}
