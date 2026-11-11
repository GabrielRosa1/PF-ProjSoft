import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-ws7izgxg5afd106q.us.auth0.com"
      clientId="jXawa4E0EfQ3iBqDag9kbCx7eCTYPtZ7"
      authorizationParams={{
        audience: "https://dev-ws7izgxg5afd106q.us.auth0.com/api/v2/",
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)