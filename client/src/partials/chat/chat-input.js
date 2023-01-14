import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

// Componente utilizzato per comporre messaggi da inviare(TextInput)

const ChatInput = ({handleSendMsg}) => {

    const [msg, setMsg] = useState("");
    
    const sendMsg = (event) => {
        event.preventDefault();
        if(msg.length > 0) {
            // Callback al componente Chat
            handleSendMsg(msg);
            setMsg('');
        }
    }

    return (
        <form className='input-container' onSubmit={(e)=>sendMsg(e)}>
            <input type="text" placeholder='type your message here' value={msg} onChange={(e)=>setMsg(e.target.value)} />
            <button className='submit btn' type='submit' >
                <span className="d-flex align-items-center justify-content-center"> 
                    Send
                    <FontAwesomeIcon className="icon" icon={faPaperPlane} style={{marginLeft: '10px'}}/>
                </span>
            </button>
        </form>        
    )

}

export default ChatInput;