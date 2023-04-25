import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cil3d,
  cilAddressBook,
  cilFork,
  cilLineStyle,
  cilNotes,
  cilPuzzle,
  cilSpeedometer,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Registro de actividades',
  },
  {
    component: CNavGroup,
    name: 'Eventos',
    icon: <CIcon icon={cilLineStyle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Listar',
        to: '/registro-actividad',
      },
      {
        component: CNavItem,
        name: 'Nuevo evento',
        to: '/registro-actividad/nuevo-registro',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Componentes',
  },
  {
    component: CNavGroup,
    name: 'Clientes',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Lista',
        to: '/clientes',
      },
      {
        component: CNavItem,
        name: 'Nuevo cliente',
        to: '/clientes/nuevo-registro',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Areas',
    icon: <CIcon icon={cil3d} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Lista',
        to: '/areas',
      },
      {
        component: CNavItem,
        name: 'Nueva area',
        to: '/areas/nuevo-registro',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Etapas',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Lista',
        to: '/etapas',
      },
      {
        component: CNavItem,
        name: 'Nueva etapa',
        to: '/etapas/nuevo-registro',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Actividades',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Lista',
        to: '/actividades',
      },
      {
        component: CNavItem,
        name: 'Nueva actividad',
        to: '/actividades/nuevo-registro',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Celulas',
    icon: <CIcon icon={cilFork} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Lista',
        to: '/celulas',
      },
      {
        component: CNavItem,
        name: 'Nueva celula',
        to: '/celulas/nuevo-registro',
      },
    ],
  },
]

export default _nav
