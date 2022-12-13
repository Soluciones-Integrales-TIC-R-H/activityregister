/* eslint-disable react/prop-types */
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from 'react'

import { useIsAuthenticated } from '@azure/msal-react'
import { SignInButton } from './SignInButton'
import { SignOutButton } from './SignOutButton'
import { CNavbar, CContainer, CNavbarBrand, CNavbarNav, CNavItem, CNavLink } from '@coreui/react'

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props
 */
export const PageLayout = (props) => {
  const isAuthenticated = useIsAuthenticated()

  return (
    <>
      <CNavbar expand="lg" colorScheme="light" className="bg-light">
        <CContainer fluid>
          <CNavbarBrand href="/"> Microsoft Identity Platform</CNavbarBrand>
          <CNavbarNav>
            <CNavItem>
              <CNavLink href="#">Home</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">Features</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">Pricing</CNavLink>
            </CNavItem>
            <CNavItem>{isAuthenticated ? <SignOutButton /> : <SignInButton />}</CNavItem>
          </CNavbarNav>
        </CContainer>
      </CNavbar>
      <h5>Welcome to the Microsoft Authentication Library For Javascript - React Quickstart</h5>
      <br />
      <br />
      {props.children}
    </>
  )
}
