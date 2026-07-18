const Member = require('../models/Member');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Progress = require('../models/Progress');
const Workout = require('../models/Workout');
const DietPlan = require('../models/DietPlan');
const QRCode = require('qrcode');
const { paginate, getPagination } = require('../utils/pagination');

exports.getAllMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const query = Member.find().populate('user', 'name email phone profileImage isOnline').populate('assignedTrainer');

    if (search) {
      query.find({ 'user.name': { $regex: search, $options: 'i' } });
    }
    if (status === 'active') {
      query.where('membershipEnd').gte(new Date());
    } else if (status === 'expired') {
      query.where('membershipEnd').lt(new Date());
    }

    const total = await Member.countDocuments(query.getFilter());
    const members = await paginate(query.sort({ createdAt: -1 }), page, limit);
    const pagination = getPagination(total, page, limit);

    res.json({ success: true, data: { members, pagination } });
  } catch (error) {
    next(error);
  }
};

exports.getMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('user', 'name email phone profileImage isOnline')
      .populate('assignedTrainer');
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

exports.createMember = async (req, res, next) => {
  try {
    const { name, email, password, phone, membershipType, weight, height, goals } = req.body;

    const user = await User.create({ name, email, password, phone, role: 'member' });

    const membershipEnd = new Date();
    membershipEnd.setMonth(membershipEnd.getMonth() + (membershipType === 'premium' ? 12 : membershipType === 'standard' ? 6 : 1));

    const member = await Member.create({
      user: user._id,
      membershipType: membershipType || 'basic',
      membershipEnd,
      weight,
      height,
      goals: goals || [],
    });

    res.status(201).json({ success: true, data: { user, member } });
  } catch (error) {
    next(error);
  }
};

exports.updateMember = async (req, res, next) => {
  try {
    const { name, email, phone, membershipType, weight, height, goals, assignedTrainer } = req.body;

    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    await User.findByIdAndUpdate(member.user, { name, email, phone });

    const updates = {};
    if (membershipType) updates.membershipType = membershipType;
    if (weight) updates.weight = weight;
    if (height) updates.height = height;
    if (goals) updates.goals = goals;
    if (assignedTrainer) updates.assignedTrainer = assignedTrainer;

    const updatedMember = await Member.findByIdAndUpdate(req.params.id, updates, { new: true })
      .populate('user', 'name email phone profileImage')
      .populate('assignedTrainer');

    res.json({ success: true, data: updatedMember });
  } catch (error) {
    next(error);
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    await User.findByIdAndDelete(member.user);
    await Member.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Member deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id })
      .populate('user', 'name email phone profileImage')
      .populate('assignedTrainer');
    res.json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

exports.getQRCode = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    const qrData = JSON.stringify({ memberId: member._id, userId: req.user._id, name: req.user.name });
    const qrCode = await QRCode.toDataURL(qrData, { width: 300, margin: 2, color: { dark: '#4F46E5', light: '#ffffff' } });
    res.json({ success: true, data: { qrCode, memberId: member._id } });
  } catch (error) {
    next(error);
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    const progress = await Progress.find({ member: member._id }).sort({ date: -1 }).limit(30);
    res.json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

exports.addProgress = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    const { weight, bodyFat, muscleMass, notes } = req.body;

    const progress = await Progress.create({
      member: member._id,
      weight,
      bodyFat,
      muscleMass,
      bmi: member.bmi,
      notes,
    });

    if (weight) {
      member.weight = weight;
      await member.save();
    }

    res.status(201).json({ success: true, data: progress });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceHistory = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    const { page = 1, limit = 20 } = req.query;
    const query = Attendance.find({ member: member._id }).sort({ date: -1 });
    const total = await Attendance.countDocuments({ member: member._id });
    const attendance = await paginate(query, page, limit);
    res.json({ success: true, data: { attendance, pagination: getPagination(total, page, limit) } });
  } catch (error) {
    next(error);
  }
};

exports.getMemberDashboard = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id })
      .populate('assignedTrainer');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayWorkout, recentProgress, attendanceCount, todayAttendance] = await Promise.all([
      Workout.findOne({ member: member._id, day: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'][today.getDay() - 1] })
        .populate('trainer'),
      Progress.find({ member: member._id }).sort({ date: -1 }).limit(7),
      Attendance.countDocuments({ member: member._id }),
      Attendance.findOne({ member: member._id, date: { $gte: today } }),
    ]);

    const isMembershipActive = member.membershipEnd > new Date();

    res.json({
      success: true,
      data: {
        member,
        todayWorkout,
        recentProgress,
        attendanceCount,
        todayAttendance,
        isMembershipActive,
      },
    });
  } catch (error) {
    next(error);
  }
};
