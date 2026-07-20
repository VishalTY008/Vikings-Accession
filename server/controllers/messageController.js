const Message = require('../models/Message');

exports.sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, type = 'text' } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content,
      type,
    });
    const populated = await message.populate('sender', 'name profileImage');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

exports.getConversation = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .populate('sender', 'name profileImage')
      .populate('receiver', 'name profileImage')
      .sort({ createdAt: 1 });

    await Message.updateMany({ sender: userId, receiver: req.user._id, read: false }, { read: true });

    res.json({ success: true, data: messages });
  } catch (error) {
    next(error);
  }
};

exports.getChatList = async (req, res, next) => {
  try {
    const messages = await Message.aggregate([
      { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [{ $eq: ['$sender', req.user._id] }, '$receiver', '$sender'],
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$receiver', req.user._id] }, { $eq: ['$read', false] }] }, 1, 0],
            },
          },
        },
      },
      { $sort: { 'lastMessage.createdAt': -1 } },
    ]);

    const User = require('../models/User');
    const chatList = await Promise.all(
      messages.map(async (item) => {
        const user = await User.findById(item._id).select('name profileImage isOnline');
        return { user, lastMessage: item.lastMessage, unreadCount: item.unreadCount };
      })
    );

    res.json({ success: true, data: chatList });
  } catch (error) {
    next(error);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    await Message.updateMany({ sender: req.params.userId, receiver: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    next(error);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Message.countDocuments({ receiver: req.user._id, read: false });
    res.json({ success: true, data: { count } });
  } catch (error) {
    next(error);
  }
};
