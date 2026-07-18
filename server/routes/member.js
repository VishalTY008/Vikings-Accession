const express = require('express');
const router = express.Router();
const {
  getAllMembers, getMember, createMember, updateMember, deleteMember,
  getMyProfile, getQRCode, getProgress, addProgress, getAttendanceHistory,
  getMemberDashboard,
} = require('../controllers/memberController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', authorize('member'), getMemberDashboard);
router.get('/me', authorize('member'), getMyProfile);
router.get('/qr', authorize('member'), getQRCode);
router.get('/progress', authorize('member'), getProgress);
router.post('/progress', authorize('member'), addProgress);
router.get('/attendance', authorize('member'), getAttendanceHistory);

router.get('/', authorize('admin', 'trainer'), getAllMembers);
router.get('/:id', authorize('admin', 'trainer'), getMember);
router.post('/', authorize('admin'), createMember);
router.put('/:id', authorize('admin'), updateMember);
router.delete('/:id', authorize('admin'), deleteMember);

module.exports = router;
