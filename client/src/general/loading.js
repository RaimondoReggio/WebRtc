import React from "react";


const Loading = () => {
    return (
        <div className="loading-container row align-items-center justify-content-center" style={{height: '100vh'}}>
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}

export default Loading