import React, { useEffect, useState } from "react";

const Contacts = ({contacts, currentUser, changeChat}) => {

    // State variables
    const[currentUserName,setCurrentUserName] = useState(undefined);
    const[currentUserImage,setCurrentUserImage] = useState(undefined);
    const [currentSelected,setCurrentSelected] = useState(undefined);

    useEffect(() => {
        if(currentUser) {
            setCurrentUserName(currentUser.username);
            setCurrentUserImage(currentUser.avatar_image);
        }
    }, [currentUser]);

    // Change selected chat
    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    }

    return (
        <>
        { currentUserName && currentUserImage &&
            <>
                <div className="contacts">
                    {contacts.map((contact, index) => {
                        return (
                            <div
                                key={contact.id}
                                className={`contact ${
                                    index === currentSelected ? "selected" : ""
                                }`}
                                onClick={() => changeCurrentChat(index, contact)}
                            >
                                <div className="avatar">
                                    <img
                                    src={contact.avatar_image}
                                    alt="avatar"
                                    />
                                </div>
                                <div className="username">
                                    <h3>{contact.username}</h3>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="current-user">
                    <div className="avatar">
                        <img
                            src={currentUserImage}
                            alt="avatar"
                        />
                    </div>
                    <div className="username">
                        <h2>{currentUserName}</h2>
                    </div>
                </div>
            </>
        }
        </>
    );
}

export default Contacts;