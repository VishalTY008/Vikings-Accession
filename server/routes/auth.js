const express = require('express');
const router = express.Router();
const { signup, login, getMe, forgotPassword, resetPassword, updateProfile, updatePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.put('/update-password', protect, updatePassword);

module.exports = router;
