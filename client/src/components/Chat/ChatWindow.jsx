import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import { getConversation, sendMessage } from '../../services/chatService';
import Avatar from '../UI/Avatar';

export default function ChatWindow({ selectedUser }) {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    if (selectedUser) {
      getConversation(selectedUser._id).then((res) => setMessages(res.data.data));
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!socket || !selectedUser) return;
    socket.on('newMessage', (msg) => {
      if (msg.sender._id === selectedUser._id) {
        setMessages((prev) => [...prev, msg]);
        socket.emit('markRead', { senderId: selectedUser._id });
      }
    });
    socket.on('userTyping', ({ userId }) => { if (userId === selectedUser._id) setTyping(true); });
    socket.on('userStopTyping', ({ userId }) => { if (userId === selectedUser._id) setTyping(false); });
    return () => { socket.off('newMessage'); socket.off('userTyping'); socket.off('userStopTyping'); };
  }, [socket, selectedUser]);

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    const res = await sendMessage({ receiverId: selectedUser._id, content: newMessage });
    setMessages((prev) => [...prev, res.data.data]);
    setNewMessage('');
    socket?.emit('stopTyping', { receiverId: selectedUser._id });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socket?.emit('typing', { receiverId: selectedUser._id });
    setTimeout(() => socket?.emit('stopTyping', { receiverId: selectedUser._id }), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-dark-700">
        <Avatar name={selectedUser?.name} src={selectedUser?.profileImage} size="sm" />
        <div>
          <h4 className="font-semibold text-sm">{selectedUser?.name}</h4>
          {typing && <p className="text-xs text-accent-500">Typing...</p>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={msg._id || i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
              msg.sender._id === user?._id
                ? 'gradient-bg text-white rounded-br-md'
                : 'bg-gray-100 dark:bg-dark-700 rounded-bl-md'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEnd} />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-dark-700">
        <div className="flex items-center gap-2">
          <input
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="input-field flex-1"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="p-3 rounded-xl gradient-bg text-white"
          >
            <FiSend size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
