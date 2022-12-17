import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
    const { user } = useAuth0();
    const { nickname, picture, email } = user;

    return (
        <>
        <div>{nickname}</div>
        <div>{email}</div>
        <div>{picture}</div>
        </>
    );
};

export default Profile;