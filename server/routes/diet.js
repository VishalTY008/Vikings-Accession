const express = require('express');
const router = express.Router();
const { getDietPlans, getMyDietPlan, createDietPlan, updateDietPlan, deleteDietPlan } = require('../controllers/dietController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my', authorize('member'), getMyDietPlan);
router.get('/', authorize('admin', 'trainer'), getDietPlans);
router.post('/', authorize('trainer'), createDietPlan);
router.put('/:id', authorize('trainer', 'admin'), updateDietPlan);
router.delete('/:id', authorize('trainer', 'admin'), deleteDietPlan);

module.exports = router;
