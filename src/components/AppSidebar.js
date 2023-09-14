import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CBadge,
  CButton,
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarNav,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import logoClient from 'src/assets/images/logos/cliente.png'
import logoApp from 'src/assets/brand/logosApp/favicon-96x96.png'
//import bgFondo from 'src/assets/images/fondos/bg-fondo.jpg'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'
import { CONFIG_APP } from 'src/utilities/config'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
      // style={{
      //   backgroundSize: 'cover',
      //   backgroundImage:
      //     'linear-gradient(rgba(229, 83, 83, 0.75), rgba(229, 83, 83, 0.5)), url(' + bgFondo + ')',
      // }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CImage className="sidebar-brand-full w-100" src={logoClient} height={60} />
        <CImage className="sidebar-brand-narrow" src={logoApp} height={60} />
        {/* <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex align-items-center justify-content-center"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      >
        <div className="sidebar-brand-full align-middle">
          <CBadge color="primary"> 
            <CImage src={logoApp} height={16} />
            <span className=" text-uppercase"> Versión </span>
            {CONFIG_APP.VERSION}
          </CBadge>
        </div>
      </CSidebarToggler>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
