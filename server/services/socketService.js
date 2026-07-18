const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const Message = require('../models/Message');

let io = null;
const onlineUsers = new Map();

const initSocket = (socketIo) => {
  io = socketIo;

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication error'));
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));
      socket.userId = user._id.toString();
      socket.userRole = user.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);
    onlineUsers.set(socket.userId, socket.id);
    await User.findByIdAndUpdate(socket.userId, { isOnline: true });

    io.emit('userOnline', { userId: socket.userId });

    socket.on('joinRoom', ({ roomId }) => {
      socket.join(roomId);
    });

    socket.on('sendMessage', async (data) => {
      try {
        const message = await Message.create({
          sender: socket.userId,
          receiver: data.receiverId,
          content: data.content,
          type: data.type || 'text',
        });

        const populated = await message.populate('sender', 'name profileImage');
        io.to(data.receiverId).emit('newMessage', populated);
        socket.emit('messageSent', populated);
      } catch (error) {
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    socket.on('typing', ({ receiverId }) => {
      io.to(receiverId).emit('userTyping', { userId: socket.userId });
    });

    socket.on('stopTyping', ({ receiverId }) => {
      io.to(receiverId).emit('userStopTyping', { userId: socket.userId });
    });

    socket.on('markRead', async ({ senderId }) => {
      await Message.updateMany(
        { sender: senderId, receiver: socket.userId, read: false },
        { read: true }
      );
      io.to(senderId).emit('messagesRead', { readerId: socket.userId });
    });

    socket.on('disconnect', async () => {
      onlineUsers.delete(socket.userId);
      await User.findByIdAndUpdate(socket.userId, { isOnline: false });
      io.emit('userOffline', { userId: socket.userId });
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};

const getOnlineUsers = () => onlineUsers;
const getIO = () => io;

module.exports = { initSocket, getOnlineUsers, getIO };
