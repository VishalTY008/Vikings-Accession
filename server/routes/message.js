const express = require('express');
const router = express.Router();
const { sendMessage, getConversation, getChatList, markRead, getUnreadCount } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/chat-list', getChatList);
router.get('/unread', getUnreadCount);
router.get('/:userId', getConversation);
router.post('/', sendMessage);
router.put('/read/:userId', markRead);

module.exports = router;
