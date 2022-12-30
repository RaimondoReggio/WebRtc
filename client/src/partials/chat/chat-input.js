import React, { useState } from "react";

const ChatInput = ({handleSendMsg}) => {

    const [msg, setMsg] = useState("");
    
    const sendMsg = (event) => {
        event.preventDefault();
        if(msg.length > 0) {
            handleSendMsg(msg);
            setMsg('');
        }
    }

    return (
        <form className='input-container' onSubmit={(e)=>sendMsg(e)}>
            <input type="text" placeholder='type your message here' value={msg} onChange={(e)=>setMsg(e.target.value)} />
            <button className='submit' type='submit' >
                Send
            </button>
        </form>        
    )

}

export default ChatInput;