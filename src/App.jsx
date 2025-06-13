// React imports
import React, { useEffect, useState } from 'react';
// Socket.IO client import (install pehle karo: npm i socket.io-client)
import { io } from 'socket.io-client';

const socket = io('https://ca-backend-p2rp.onrender.com');


const App = () => {
  // States to store message input aur messages list
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState(''); // Static username, tu chahe to input se le sakta hai



  // useEffect tab chalega jab component mount hoga
  useEffect(() => {
     const oldChat = localStorage.getItem('chat');
  if (oldChat) {
    setChat(JSON.parse(oldChat));
  }
    // Jab server se 'receive_message' event aaye
    socket.on('receive_message', (data) => {
      // message list me naye message ko add karo
      setChat((prevChat) => {
        const updatedChat = [...prevChat, data];
      localStorage.setItem('chat', JSON.stringify(updatedChat)); // Store in LS
      return updatedChat;
      });
    });

    // Cleanup on unmount: listener hata do
    return () => socket.off('receive_message');
  }, []);

  // Form submit pe ye chalega
  const handleSend = (e) => {
    e.preventDefault();
if (message.trim() === '') {
  alert('Message cannot be empty!');

  return;
}
else if (username.trim() === '') {
  alert('Username cannot be empty!');
  return;
    }
    
    // Ek object bana ke bhejna: username + message
    const data = {
  
        username: username, // static user name, tu chahe to input se le sakta hai
      message: message
    }
        

    // Server ko 'send_message' event emit karo
    socket.emit('send_message', data);

    // Khud ke UI me bhi message dikhao (chahe to hata bhi sakte ho)
    // setChat((prevChat) => [...prevChat, data]);

    // Input clear
    setMessage('');
  };


  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>💬 Real-Time Chat </h2>

      {/* Message list */}
      <div style={{ border: '1px solid #ddd', padding: '10px', height: '300px', overflowY: 'auto' }}>
           <form onSubmit={handleSend} style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Type your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '5px', width: '40vw', fontSize: '16px' }}
        />
        
      </form>
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
