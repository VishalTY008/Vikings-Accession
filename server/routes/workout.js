const express = require('express');
const router = express.Router();
const { getWorkouts, getMyWorkouts, createWorkout, updateWorkout, deleteWorkout, markComplete } = require('../controllers/workoutController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my', authorize('member'), getMyWorkouts);
router.put('/:id/complete', authorize('member'), markComplete);
router.get('/', authorize('admin', 'trainer'), getWorkouts);
router.post('/', authorize('trainer'), createWorkout);
router.put('/:id', authorize('trainer', 'admin'), updateWorkout);
router.delete('/:id', authorize('trainer', 'admin'), deleteWorkout);

module.exports = router;
