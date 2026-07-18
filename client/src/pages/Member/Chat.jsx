import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import ChatList from '../../components/Chat/ChatList';
import ChatWindow from '../../components/Chat/ChatWindow';
import { getChatList } from '../../services/chatService';

export default function MemberChat() {
  const [chats, setChats] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { getChatList().then(r => setChats(r.data.data)); }, []);

  return (
    <DashboardLayout>
      <div className="glass-card h-[calc(100vh-8rem)] flex">
        <div className="w-80 border-r border-gray-100 dark:border-dark-700 p-4 overflow-y-auto">
          <h3 className="font-display font-bold mb-4">Messages</h3>
          <ChatList chats={chats} selectedId={selected?._id} onSelect={setSelected} />
        </div>
        <div className="flex-1 flex flex-col">
          {selected
            ? <ChatWindow selectedUser={selected} />
            : <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-dark-500">Select a conversation</div>
          }
        </div>
      </div>
    </DashboardLayout>
  );
}
