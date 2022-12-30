import React from "react";

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