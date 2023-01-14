import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Sul click rimanda alla pagina di login Auth0

const LoginButton = () => {
    const {loginWithRedirect} = useAuth0();

    return (
        <button variant="contained btn" onClick={() => loginWithRedirect()}>Log In</button>
    );

};

export default LoginButton;