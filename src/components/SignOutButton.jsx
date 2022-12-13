import React from 'react'
import { useMsal } from '@azure/msal-react'
import { CButton, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'

/**
 * Renders a sign-out button
 */
export const SignOutButton = () => {
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
    <CDropdown>
      <CDropdownToggle color="secondary">Sign In</CDropdownToggle>
      <CDropdownMenu>
        <CDropdownItem href="#">
          <CButton color="secondary" onClick={() => handleLogout('popup')}>
            Sign out using Popup
          </CButton>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CButton color="secondary" onClick={() => handleLogout('redirect')}>
            Sign out using Redirect
          </CButton>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}
