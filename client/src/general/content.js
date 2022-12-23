import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faComment, faLink } from '@fortawesome/free-solid-svg-icons'

const Content = ({children}) => {
    return (
        <div className="content row">
            <div className="container">
                <div className="displayed-content">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Content;