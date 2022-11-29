import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { CButton } from '@coreui/react'

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()
  return (
    <div className="pt-3 text-center">
      <CButton className="btn-secondary" onClick={() => loginWithRedirect()}>
        Login Auth0
      </CButton>
    </div>
  )
}

export default LoginButton
