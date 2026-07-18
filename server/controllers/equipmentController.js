const Equipment = require('../models/Equipment');

exports.getAllEquipment = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category = '', status = '' } = req.query;
    const query = Equipment.find();
    if (search) query.where('name').regex(new RegExp(search, 'i'));
    if (category) query.where('category').equals(category);
    if (status) query.where('status').equals(status);

    const total = await Equipment.countDocuments(query.getFilter());
    const equipment = await query.sort({ name: 1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: { equipment, total, page: Number(page), totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.getEquipment = async (req, res, next) => {
  try {
    const eq = await Equipment.findById(req.params.id);
    if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found' });
    res.json({ success: true, data: eq });
  } catch (error) {
    next(error);
  }
};

exports.createEquipment = async (req, res, next) => {
  try {
    const eq = await Equipment.create(req.body);
    res.status(201).json({ success: true, data: eq });
  } catch (error) {
    next(error);
  }
};

exports.updateEquipment = async (req, res, next) => {
  try {
    const eq = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found' });
    res.json({ success: true, data: eq });
  } catch (error) {
    next(error);
  }
};

exports.deleteEquipment = async (req, res, next) => {
  try {
    const eq = await Equipment.findByIdAndDelete(req.params.id);
    if (!eq) return res.status(404).json({ success: false, message: 'Equipment not found' });
    res.json({ success: true, message: 'Equipment deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getEquipmentStats = async (req, res, next) => {
  try {
    const [total, available, maintenance, retired] = await Promise.all([
      Equipment.countDocuments(),
      Equipment.countDocuments({ status: 'available' }),
      Equipment.countDocuments({ status: 'maintenance' }),
      Equipment.countDocuments({ status: 'retired' }),
    ]);
    const byCategory = await Equipment.aggregate([
      { $group: { _id: '$category', count: { $sum: '$quantity' } } },
    ]);
    res.json({ success: true, data: { total, available, maintenance, retired, byCategory } });
  } catch (error) {
    next(error);
  }
};
