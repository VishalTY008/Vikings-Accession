const Attendance = require('../models/Attendance');
const Member = require('../models/Member');

exports.checkIn = async (req, res, next) => {
  try {
    const { memberId } = req.body;
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({ member: memberId, date: { $gte: today } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already checked in today' });
    }

    const attendance = await Attendance.create({
      member: memberId,
      date: today,
      checkInTime: new Date(),
      status: 'present',
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const attendance = await Attendance.findOneAndUpdate(
      { member: req.body.memberId, date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }, checkOutTime: null },
      { checkOutTime: new Date() },
      { new: true }
    );
    if (!attendance) return res.status(404).json({ success: false, message: 'No active check-in found' });
    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

exports.getAttendance = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, date } = req.query;
    const query = Attendance.find().populate({ path: 'member', populate: { path: 'user', select: 'name email profileImage' } });
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const nextD = new Date(d);
      nextD.setDate(nextD.getDate() + 1);
      query.where('date').gte(d).lt(nextD);
    }
    const total = await Attendance.countDocuments(query.getFilter());
    const attendance = await query.sort({ date: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: { attendance, total, page: Number(page), totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.getMyAttendance = async (req, res, next) => {
  try {
    const member = await Member.findOne({ user: req.user._id });
    const attendance = await Attendance.find({ member: member._id }).sort({ date: -1 }).limit(30);
    res.json({ success: true, data: attendance });
  } catch (error) {
    next(error);
  }
};

exports.getAttendanceStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [totalPresent, totalMembers, todayCount] = await Promise.all([
      Attendance.countDocuments({ date: { $gte: today } }),
      Member.countDocuments(),
      Attendance.countDocuments({ date: { $gte: today } }),
    ]);
    res.json({ success: true, data: { totalPresent, totalMembers, todayCount } });
  } catch (error) {
    next(error);
  }
};
