const Trainer = require('../models/Trainer');
const User = require('../models/User');
const Member = require('../models/Member');
const Workout = require('../models/Workout');
const DietPlan = require('../models/DietPlan');
const Progress = require('../models/Progress');
const Attendance = require('../models/Attendance');

exports.getAllTrainers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = Trainer.find().populate('user', 'name email phone profileImage isOnline');
    if (search) {
      query.find({ 'user.name': { $regex: search, $options: 'i' } });
    }
    const total = await Trainer.countDocuments();
    const trainers = await query.sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({
      success: true,
      data: {
        trainers,
        pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .populate('user', 'name email phone profileImage isOnline')
      .populate({ path: 'assignedMembers', populate: { path: 'user', select: 'name email profileImage' } });
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    res.json({ success: true, data: trainer });
  } catch (error) {
    next(error);
  }
};

exports.createTrainer = async (req, res, next) => {
  try {
    const { name, email, password, phone, specialization, experience, certifications, bio } = req.body;
    const user = await User.create({ name, email, password, phone, role: 'trainer' });
    const trainer = await Trainer.create({
      user: user._id,
      specialization: specialization || [],
      experience: experience || 0,
      certifications: certifications || [],
      bio,
    });
    res.status(201).json({ success: true, data: { user, trainer } });
  } catch (error) {
    next(error);
  }
};

exports.updateTrainer = async (req, res, next) => {
  try {
    const { name, email, phone, specialization, experience, certifications, bio, assignedMembers } = req.body;
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    if (name || email || phone) {
      await User.findByIdAndUpdate(trainer.user, { name, email, phone });
    }
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      { specialization, experience, certifications, bio, assignedMembers },
      { new: true }
    ).populate('user', 'name email phone profileImage');
    res.json({ success: true, data: updatedTrainer });
  } catch (error) {
    next(error);
  }
};

exports.deleteTrainer = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }
    await User.findByIdAndDelete(trainer.user);
    await Trainer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Trainer deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getTrainerDashboard = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id });
    const today = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayName = dayNames[today.getDay()];

    const [todaySchedule, assignedMembers, pendingWorkouts, chatNotifications] = await Promise.all([
      Workout.find({ trainer: trainer._id, day: todayName }).populate('member'),
      Member.find({ assignedTrainer: trainer._id }).populate('user', 'name email profileImage isOnline'),
      Workout.countDocuments({ trainer: trainer._id, isCompleted: false }),
    ]);

    res.json({
      success: true,
      data: { trainer, todaySchedule, assignedMembers, pendingWorkouts, chatNotifications },
    });
  } catch (error) {
    next(error);
  }
};

exports.getAssignedMembers = async (req, res, next) => {
  try {
    const trainer = await Trainer.findOne({ user: req.user._id });
    const members = await Member.find({ assignedTrainer: trainer._id })
      .populate('user', 'name email phone profileImage isOnline');
    res.json({ success: true, data: members });
  } catch (error) {
    next(error);
  }
};

exports.getMemberProgress = async (req, res, next) => {
  try {
    const { memberId } = req.params;
    const [progress, attendance, workouts] = await Promise.all([
      Progress.find({ member: memberId }).sort({ date: -1 }).limit(30),
      Attendance.find({ member: memberId }).sort({ date: -1 }).limit(30),
      Workout.find({ member: memberId }).sort({ createdAt: -1 }),
    ]);
    res.json({ success: true, data: { progress, attendance, workouts } });
  } catch (error) {
    next(error);
  }
};
