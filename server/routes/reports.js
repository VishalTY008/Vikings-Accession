const express = require('express');
const router = express.Router();
const { getAttendanceReport, getRevenueReport, getTrainerReport, getEquipmentReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/attendance', getAttendanceReport);
router.get('/revenue', getRevenueReport);
router.get('/trainers', getTrainerReport);
router.get('/equipment', getEquipmentReport);

module.exports = router;
