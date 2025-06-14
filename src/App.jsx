import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

// ✅ Backend socket server ka URL
const socket = io('https://ca-backend-p2rp.onrender.com'); // Vercel pe deploy hone ke baad URL change karna

const App = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState('');

  // ✅ Component mount hote hi: Purane messages fetch karo + Socket listener lagao
  useEffect(() => {
    // 🔹 API call to get old messages from MongoDB
    const fetchMessages = async () => {
      try {
        const res = await axios.get('https://ca-backend-p2rp.onrender.com/messages'); // Change this to deployed URL later
        setChat(res.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages();

    // 🔹 Jab new message aaye socket se
    socket.on('receive_message', (data) => {
      setChat((prevChat) => [...prevChat, data]);
    });

    // 🔹 Cleanup: socket listener hatao
    return () => socket.off('receive_message');
  }, []);

  const handleSend = (e) => {
    e.preventDefault();

    if (message.trim() === '' || username.trim() === '') {
      alert('Username and message cannot be empty!');
      return;
    }

    const data = { username, message };

    // ✅ Emit message to server
    socket.emit('send_message', data);

    // ✅ Khud ke UI me bhi dikhayein instantly
    // setChat((prevChat) => [...prevChat, data]);

    setMessage('');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>💬 Real-Time Chat (with MongoDB)</h2>

      {/* Username Input */}
      <form onSubmit={handleSend} style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Type your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '8px', width: '40%', fontSize: '16px' }}
        />
      </form>

      {/* Messages */}
      <div
        style={{
          border: '1px solid #ddd',
          padding: '10px',
          height: '300px',
          overflowY: 'auto',
          marginBottom: '10px',
        }}
      >
        {chat.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: '8px', width: '70%' }}
        />
        <button type="submit" style={{ padding: '8px 12px', marginLeft: '10px' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default App;
