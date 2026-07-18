const express = require('express');
const router = express.Router();
const { getAllEquipment, getEquipment, createEquipment, updateEquipment, deleteEquipment, getEquipmentStats } = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/stats', authorize('admin'), getEquipmentStats);
router.get('/', authorize('admin'), getAllEquipment);
router.get('/:id', authorize('admin'), getEquipment);
router.post('/', authorize('admin'), createEquipment);
router.put('/:id', authorize('admin'), updateEquipment);
router.delete('/:id', authorize('admin'), deleteEquipment);

module.exports = router;
