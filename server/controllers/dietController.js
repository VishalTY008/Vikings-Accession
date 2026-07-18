const DietPlan = require('../models/DietPlan');

exports.getDietPlans = async (req, res, next) => {
  try {
    const { member, trainer, page = 1, limit = 20 } = req.query;
    const query = DietPlan.find();
    if (member) query.where('member').equals(member);
    if (trainer) query.where('trainer').equals(trainer);

    const total = await DietPlan.countDocuments(query.getFilter());
    const plans = await query
      .populate('member', 'name')
      .populate('trainer', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: { plans, total, page: Number(page), totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.getMyDietPlan = async (req, res, next) => {
  try {
    const Member = require('../models/Member');
    const member = await Member.findOne({ user: req.user._id });
    const plan = await DietPlan.findOne({ member: member._id, isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

exports.createDietPlan = async (req, res, next) => {
  try {
    const { member, name, meals, waterIntake, notes } = req.body;
    const Trainer = require('../models/Trainer');
    const trainer = await Trainer.findOne({ user: req.user._id });

    const plan = await DietPlan.create({
      member,
      trainer: trainer._id,
      name,
      meals: meals || [],
      waterIntake: waterIntake || 8,
      notes,
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

exports.updateDietPlan = async (req, res, next) => {
  try {
    const plan = await DietPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Diet plan not found' });
    }
    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

exports.deleteDietPlan = async (req, res, next) => {
  try {
    const plan = await DietPlan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Diet plan not found' });
    }
    res.json({ success: true, message: 'Diet plan deleted' });
  } catch (error) {
    next(error);
  }
};
