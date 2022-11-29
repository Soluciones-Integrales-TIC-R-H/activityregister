import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const AreasRegistroActividad = React.lazy(() => import('./views/areas/ListAreas'))
const NuevaAreaRegistroActividad = React.lazy(() => import('./views/areas/FormArea'))

const EtapasRegistroActividad = React.lazy(() => import('./views/etapas/ListEtapas'))
const NuevaEtapaRegistroActividad = React.lazy(() => import('./views/etapas/FormEtapa'))

const ActividadesRegistroActividad = React.lazy(() => import('./views/actividades/ListActividades'))
const NuevaActividadRegistroActividad = React.lazy(() =>
  import('./views/actividades/FormActividad'),
)

const ClientesRegistroActividad = React.lazy(() => import('./views/clientes/ListClientes'))
const NuevoClienteRegistroActividad = React.lazy(() => import('./views/clientes/FormCliente'))

const EventosRegistroActividad = React.lazy(() => import('./views/eventos/ListEventos'))
const NuevoEventoRegistroActividad = React.lazy(() => import('./views/eventos/FormEvento'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/registro-actividad', name: 'Eventos', element: EventosRegistroActividad, exact: true },
  {
    path: '/registro-actividad/nuevo-registro',
    name: 'Nuevo registro',
    element: NuevoEventoRegistroActividad,
  },
  { path: '/areas', name: 'Areas', element: AreasRegistroActividad, exact: true },
  { path: '/areas/nuevo-registro', name: 'Nuevo registro', element: NuevaAreaRegistroActividad },
  {
    path: '/areas/editar-registro:_id',
    name: 'Editar registro',
    element: NuevaAreaRegistroActividad,
  },

  { path: '/clientes', name: 'Clientes', element: ClientesRegistroActividad, exact: true },
  {
    path: '/clientes/nuevo-registro',
    name: 'Nuevo registro',
    element: NuevoClienteRegistroActividad,
  },

  {
    path: '/areas/editar-registro:_id',
    name: 'Editar registro',
    element: NuevaAreaRegistroActividad,
  },
  { path: '/etapas', name: 'Etapas', element: EtapasRegistroActividad, exact: true },

  { path: '/etapas/nuevo-registro', name: 'Nuevo registro', element: NuevaEtapaRegistroActividad },
  { path: '/actividades', name: 'Actividades', element: ActividadesRegistroActividad, exact: true },
  {
    path: '/actividades/nuevo-registro',
    name: 'Nueva Actividad',
    element: NuevaActividadRegistroActividad,
  },
]

export default routes
