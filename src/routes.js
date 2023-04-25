import React from 'react'

//const Dashboard2 = React.lazy(() => import('./views/dashboard/Dashboard'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard2'))

//Forms
const AreasRegistroActividad = React.lazy(() => import('./views/areas/ListAreas'))
const NuevaAreaRegistroActividad = React.lazy(() => import('./views/areas/FormArea'))

const EtapasRegistroActividad = React.lazy(() => import('./views/etapas/ListEtapas'))
const NuevaEtapaRegistroActividad = React.lazy(() => import('./views/etapas/FormEtapa'))

const ActividadesRegistroActividad = React.lazy(() => import('./views/actividades/ListActividades'))
const NuevaActividadRegistroActividad = React.lazy(() =>
  import('./views/actividades/FormActividad'),
)

const CelulasRegistroActividad = React.lazy(() => import('./views/celulas/ListCelulas'))
const NuevaCelulaRegistroActividad = React.lazy(() => import('./views/celulas/FormCelulas'))

const ClientesRegistroActividad = React.lazy(() => import('./views/clientes/ListClientes'))
const NuevoClienteRegistroActividad = React.lazy(() => import('./views/clientes/FormCliente'))

const EventosRegistroActividad = React.lazy(() => import('./views/eventos/ListEventos'))
const NuevoEventoRegistroActividad = React.lazy(() => import('./views/eventos/FormEvento'))
const VistaEventosRegistroActividad = React.lazy(() => import('./views/eventos/FormViewEvento'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/charts', name: 'Charts', element: Charts },

  { path: '/registro-actividad', name: 'Eventos', element: EventosRegistroActividad, exact: true },
  {
    path: '/registro-actividad/nuevo-registro',
    name: 'Nuevo registro',
    element: NuevoEventoRegistroActividad,
  },
  {
    path: '/registro-actividad/vista-registro/:_id',
    name: 'Vista registro',
    element: VistaEventosRegistroActividad,
  },

  { path: '/areas', name: 'Areas', element: AreasRegistroActividad, exact: true },
  { path: '/areas/nuevo-registro', name: 'Nuevo registro', element: NuevaAreaRegistroActividad },
  {
    path: '/areas/vista-registro/:_id',
    name: 'Vista registro',
    element: NuevaAreaRegistroActividad,
  },
  {
    path: '/areas/editar-registro/:_id',
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
    path: '/clientes/vista-registro/:_id',
    name: 'Vista registro',
    element: NuevoClienteRegistroActividad,
  },
  {
    path: '/clientes/editar-registro:_id',
    name: 'Editar registro',
    element: NuevoClienteRegistroActividad,
  },

  { path: '/etapas', name: 'Etapas', element: EtapasRegistroActividad, exact: true },
  { path: '/etapas/nuevo-registro', name: 'Nuevo registro', element: NuevaEtapaRegistroActividad },
  {
    path: '/etapas/vista-registro/:_id',
    name: 'Vista registro',
    element: NuevaEtapaRegistroActividad,
  },
  {
    path: '/etapas/editar-registro/:_id',
    name: 'Editar registro',
    element: NuevaEtapaRegistroActividad,
  },

  { path: '/actividades', name: 'Actividades', element: ActividadesRegistroActividad, exact: true },
  {
    path: '/actividades/nuevo-registro',
    name: 'Nueva Actividad',
    element: NuevaActividadRegistroActividad,
  },
  {
    path: '/actividades/vista-registro/:_id',
    name: 'Vista registro',
    element: NuevaActividadRegistroActividad,
  },
  {
    path: '/actividades/editar-registro/:_id',
    name: 'Editar registro',
    element: NuevaActividadRegistroActividad,
  },

  { path: '/celulas', name: 'Celulas', element: CelulasRegistroActividad, exact: true },
  {
    path: '/celulas/nuevo-registro',
    name: 'Nueva Celula',
    element: NuevaCelulaRegistroActividad,
  },
  {
    path: '/celulas/vista-registro/:_id',
    name: 'Vista registro',
    element: NuevaCelulaRegistroActividad,
  },
  {
    path: '/celulas/editar-registro/:_id',
    name: 'Editar registro',
    element: NuevaCelulaRegistroActividad,
  },
]

export default routes
