import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        {/* <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          CoreUI
        </a> */}
        Center AA Plus <span className="ms-1">&copy; 2022 Doble A Asesorias.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        {/* <a href="#/" target="_blank" rel="noopener noreferrer"> */}
        Soluciones Integrales TIC R&amp;H
        {/* </a> */}
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
