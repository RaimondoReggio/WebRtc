import React from 'react';
import LoginButton from '../../partials/auth/login-button';
import LogoutButton from '../../partials/auth/logout-button';

import { useAuth0 } from '@auth0/auth0-react';

const AuthenticationButton = () => {
    const { isAuthenticated } = useAuth0();
  
    return isAuthenticated ? <LogoutButton /> : <LoginButton />;
  };
  
  export default AuthenticationButton;