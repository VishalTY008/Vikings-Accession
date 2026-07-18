const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getAttendance, getMyAttendance, getAttendanceStats } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my', authorize('member'), getMyAttendance);
router.post('/check-in', authorize('admin'), checkIn);
router.post('/check-out', authorize('admin'), checkOut);
router.get('/', authorize('admin', 'trainer'), getAttendance);
router.get('/stats', authorize('admin'), getAttendanceStats);

module.exports = router;
