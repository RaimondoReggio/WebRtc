import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Sul click rimanda alla pagina di logout Auth0

const LogoutButton = () => {
    const {logout} = useAuth0();

    return (
        <button className="btn logout-button" onClick={() => {

            localStorage.clear();
            logout({
                returnTo: window.location.origin,
            });
            
            }
            
            }>Log Out</button>
    );

};

export default LogoutButton;