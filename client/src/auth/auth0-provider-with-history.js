import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
    const domain = process.env.REACT_APP_AUTH0_DOMAIN;
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
    const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

    console.log(domain);
  
    const navigate = useNavigate();
  
    // Viene invocata dopo il login tramite Auth0
    const onRedirectCallback = () => {
      navigate('/waiting');
    };
    
    // Viene utilizzato per gestire lo stato di autenticazione dell'utente
    // deve contentere il componente principale App (root), in modo tale che
    // le funzionalità di Auth0 siano integrate in tutto il progetto.
    return (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        redirectUri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
        audience={audience}
      >
        {children}
      </Auth0Provider>
    );
  };
  
  export default Auth0ProviderWithHistory;