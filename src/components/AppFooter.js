import React from 'react'
import { CFooter } from '@coreui/react'
import { CONFIG_APP } from 'src/utilities/config'

const AppFooter = () => {
  return (
    <CFooter>
      <div className="text-uppercase">
        {/* <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          CoreUI
        </a> */}
        {CONFIG_APP.NAME}
        <span className="ms-1">&copy; 2023 DOBLE A ASESORIAS.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        {/* <a href="#/" target="_blank" rel="noopener noreferrer"> */}
        Drenthe
        {/* </a> */}
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
