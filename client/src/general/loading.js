import React from "react";

// Componente grafico utilizzato durante le transizioni di pagina.

const Loading = () => {
    return (
        <div className="loading-container row align-items-center justify-content-center" style={{height: '100vh'}}>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default Loading