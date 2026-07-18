const express = require('express');
const router = express.Router();
const { getNotifications, markRead, markAllRead, getUnreadCount, sendNotification, deleteNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotifications);
router.get('/unread', getUnreadCount);
router.put('/read/:id', markRead);
router.put('/read-all', markAllRead);
router.post('/send', authorize('admin'), sendNotification);
router.delete('/:id', deleteNotification);

module.exports = router;
