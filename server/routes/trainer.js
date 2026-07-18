const express = require('express');
const router = express.Router();
const {
  getAllTrainers, getTrainer, createTrainer, updateTrainer, deleteTrainer,
  getTrainerDashboard, getAssignedMembers, getMemberProgress,
} = require('../controllers/trainerController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard', authorize('trainer'), getTrainerDashboard);
router.get('/my-members', authorize('trainer'), getAssignedMembers);
router.get('/member-progress/:memberId', authorize('trainer'), getMemberProgress);

router.get('/', authorize('admin'), getAllTrainers);
router.get('/:id', authorize('admin'), getTrainer);
router.post('/', authorize('admin'), createTrainer);
router.put('/:id', authorize('admin'), updateTrainer);
router.delete('/:id', authorize('admin'), deleteTrainer);

module.exports = router;
