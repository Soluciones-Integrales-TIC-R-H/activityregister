import 'react-app-polyfill/stable'
import 'core-js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import { msalConfig } from './authConfig'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from './store'

/**
 * Initialize a PublicClientApplication instance which is provided to the MsalProvider component
 * We recommend initializing this outside of your root component to ensure it is not re-initialized on re-renders
 */
const msalInstance = new PublicClientApplication(msalConfig)

/**
 * We recommend wrapping most or all of your components in the MsalProvider component. It's best to render the MsalProvider as close to the root as possible.
 */
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* <React.StrictMode> */}
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
    {/* </React.StrictMode> */}
  </Provider>,
)

reportWebVitals()
