import React, { useEffect, useState } from "react";

// Componente che serve per renderizzare i contatti all'interno del componente Chat

const Contacts = ({contacts, currentUser, changeChat, notifications, notifyUser}) => {

    // Per current si intende l'utente loggato
    const[currentUserName,setCurrentUserName] = useState(undefined);
    const[currentUserImage,setCurrentUserImage] = useState(undefined);
    const [currentSelected,setCurrentSelected] = useState(undefined);


    //DA CONTROLLARE, MAI USATO
    useEffect(() => {
        if(currentUser) {
            setCurrentUserName(currentUser.username);
            setCurrentUserImage(currentUser.avatar_image);
        }
    }, [currentUser]);

    // Richiamata quando si seleziona utente dalla lista contatti
    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);

        //Callback al componente Chat
        changeChat(contact);

        // Elimina le notifiche per l'utente selezionato
        if(notifications[contact.id]) { 
            var new_notifications = {...notifications};
            delete new_notifications[contact.id];
            // Callback al componente chat
            notifyUser(new_notifications); 
        }
    }

    return (
        <>
        { currentUserName && currentUserImage &&
            <>
                <div className="contacts-container">
                    <div className="contacts-content">
                        { contacts.length > 0 ? 
                        <>
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
                        </>
                        : <> <h3>It's time to make new friends!</h3> </>}


                    </div>
                </div>
            </>
        }
        </>
    );
}

export default Contacts;