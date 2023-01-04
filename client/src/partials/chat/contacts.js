import React, { useEffect, useState } from "react";

const Contacts = ({contacts, currentUser, changeChat, notifications, notifyUser}) => {

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

        if(notifications[contact.id]) {
            var new_notifications = {...notifications};
            delete new_notifications[contact.id];
            notifyUser(new_notifications); 
        }
    }

    return (
        <>
        { currentUserName && currentUserImage &&
            <>
                <div className="contacts-container">
                    <div className="contacts-content">
                        {contacts.map((contact, index) => {
                            return (
                                <div
                                    key={contact.id}
                                    className={`contact-item ${
                                        index === currentSelected ? "selected" : ""
                                    }`}
                                    onClick={() => changeCurrentChat(index, contact)}
                                >
                                    <div className="avatar">
                                        { notifications[contact.id] &&
                                        <span className="position-absolute translate-middle badge rounded-pill badge-danger">
                                            {notifications[contact.id]}
                                            <span className="visually-hidden">unread messages</span>
                                        </span>
                                        }
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
                </div>
            </>
        }
        </>
    );
}

export default Contacts;