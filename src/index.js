import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'
import { Auth0Provider } from '@auth0/auth0-react'

const DOMAIN = process.env.REACT_APP_AUTH_DOMAIN
const CLIENTID = process.env.REACT_APP_AUTH_CLIENT_ID
const DOMAIN_365 = process.env.REACT_APP_AUTH_DOMAIN_365
const CLIENTID_365 = process.env.REACT_APP_AUTH_CLIENT_ID_365

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* <Auth0Provider domain={DOMAIN} clientId={CLIENTID} redirectUri={window.location.origin}> */}
    <App />
    {/* </Auth0Provider> */}
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
