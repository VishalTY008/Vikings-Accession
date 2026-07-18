import { motion } from 'framer-motion';
import Avatar from '../UI/Avatar';
import { useSocket } from '../../context/SocketContext';

export default function ChatList({ chats, selectedId, onSelect }) {
  const { onlineUsers } = useSocket();

  return (
    <div className="space-y-1">
      {chats.map((chat) => (
        <motion.button
          key={chat.user._id}
          whileHover={{ x: 4 }}
          onClick={() => onSelect(chat.user)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
            selectedId === chat.user._id
              ? 'bg-primary-50 dark:bg-primary-900/20'
              : 'hover:bg-gray-50 dark:hover:bg-dark-700'
          }`}
        >
          <div className="relative">
            <Avatar name={chat.user.name} src={chat.user.profileImage} size="sm" />
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-dark-800 ${
              onlineUsers.includes(chat.user._id) ? 'bg-accent-500' : 'bg-gray-300'
            }`} />
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="font-medium text-sm truncate">{chat.user.name}</p>
            <p className="text-xs text-gray-500 dark:text-dark-400 truncate">{chat.lastMessage?.content}</p>
          </div>
          {chat.unreadCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center">
              {chat.unreadCount}
            </span>
          )}
        </motion.button>
      ))}
      {chats.length === 0 && (
        <p className="text-center text-gray-400 dark:text-dark-500 text-sm py-8">No conversations yet</p>
      )}
    </div>
  );
}
