import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
let log = "";


const Connect = () => {
    //Public API that will echo messages sent to it back to the client
    // console.log(useState("e"));
    const [socketUrl, setSocketUrl] = useState('ws://localhost:3000');
    const [messageHistory, setMessageHistory] = useState([]);
    const [message, setMessage] = useState("");
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    // const handleClickSendMessage = (e) => {useCallback(() => {sendMessage(e)}, [])};
    const SendMessage = useCallback((e) => {sendMessage(JSON.stringify(e))}, []);
    function handleClickSendMessage (e) {
        SendMessage(e);
    }

    function handleSubmit() {
        // Prevent the browser from reloading the page
        // e.preventDefault();
        console.log("handleSubmit");
        // // Read the form data
        // const form = e.target;
        // const formData = new FormData(form);

        // You can pass formData as a fetch body directly:
        // fetch('/some-api', { method: form.method, body: formData });
        handleClickSendMessage(message);

        // Or you can work with it as a plain object:
        // const formJson = Object.fromEntries(formData.entries());
        // console.log(formJson);
    }
    useEffect(() => {
        if (lastMessage !== null) {
            const re = JSON.parse(lastMessage.data);
            console.log(re);
            setMessageHistory((prev) => prev.concat(re));
        }
    }, [lastMessage, setMessageHistory]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    return (
        <div>
            <button onClick={()=>{setMessage(""+Math.random())}}>Set number</button>
            <p>{message}</p>
            <button onClick={handleSubmit}>SEND</button>
            <br/>
            <span>{connectionStatus}</span>
            {/* {lastMessage ? <span>Last message: {JSON.stringify(lastMessage.data)}</span> : null} */}
            <ul>
            {messageHistory.map((message, idx) => (
                <span key={idx}>{(message)}<br/></span>
                
            ))}
            </ul>
        </div>
    );
};

export default Connect;