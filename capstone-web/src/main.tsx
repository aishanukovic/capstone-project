import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Auth0Provider } from '@auth0/auth0-react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-lezwx11sphlq0jmd.ca.auth0.com"
      clientId="rj1i93VMfdpLvBqETw8TR11n9Obazuqw"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://capstone-api",
        scope: "openid profile email",
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);