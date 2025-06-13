// React imports
import React, { useEffect, useState } from 'react';
// Socket.IO client import (install pehle karo: npm i socket.io-client)
import { io } from 'socket.io-client';

// Socket server ka URL (backend ka port 5000)
const socket = io('https://ca-backend-p2rp.onrender.com');


const App = () => {
  // States to store message input aur messages list
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  // useEffect tab chalega jab component mount hoga
  useEffect(() => {
    // Jab server se 'receive_message' event aaye
    socket.on('receive_message', (data) => {
      // message list me naye message ko add karo
      setChat((prevChat) => [...prevChat, data]);
    });

    // Cleanup on unmount: listener hata do
    return () => socket.off('receive_message');
  }, []);

  // Form submit pe ye chalega
  const handleSend = (e) => {
    e.preventDefault();

    // Ek object bana ke bhejna: username + message
    const data = {
      username: 'Paras', // static user name, tu chahe to input se le sakta hai
      message: message
    };

    // Server ko 'send_message' event emit karo
    socket.emit('send_message', data);

    // Khud ke UI me bhi message dikhao (chahe to hata bhi sakte ho)
    // setChat((prevChat) => [...prevChat, data]);

    // Input clear
    setMessage('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>💬 Real-Time Chat (Socket.IO)</h2>

      {/* Message list */}
      <div style={{ border: '1px solid #ddd', padding: '10px', height: '300px', overflowY: 'auto' }}>
        {chat.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>

      {/* Message input form */}
      <form onSubmit={handleSend} style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: '8px', width: '70%' }}
        />
        <button type="submit" style={{ padding: '8px 12px', marginLeft: '10px' }}>Send</button>
      </form>
    </div>
  );
};

export default App;
