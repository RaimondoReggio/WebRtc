import React from "react";

const NewUser = ({username, avatar}) => {
    return (
        <div className="participant">
            <div className="card">
            <div className="card-body">
                <div className="avatar">
                    <img src={avatar} />
                </div>
                <div className="username">
                    <p>{username}</p>
                </div>
            </div>
            </div>
        </div>
    )
}

export default NewUser;