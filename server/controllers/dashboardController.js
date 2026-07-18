const User = require('../models/User');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const Equipment = require('../models/Equipment');
const Attendance = require('../models/Attendance');
const Workout = require('../models/Workout');

exports.getAdminDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalMembers,
      activeMembers,
      totalTrainers,
      equipmentStats,
      todayAttendance,
      monthlyRegistrations,
      monthlyAttendance,
      recentMembers,
    ] = await Promise.all([
      Member.countDocuments(),
      Member.countDocuments({ membershipEnd: { $gte: today } }),
      Trainer.countDocuments(),
      Equipment.aggregate([
        { $group: { _id: '$status', count: { $sum: '$quantity' } } },
      ]),
      Attendance.countDocuments({ date: { $gte: today } }),
      Member.countDocuments({ createdAt: { $gte: monthStart } }),
      Attendance.countDocuments({ date: { $gte: monthStart } }),
      Member.find().populate('user', 'name email profileImage').sort({ createdAt: -1 }).limit(5),
    ]);

    const monthlyRevenue = monthlyRegistrations * 49;
    const occupancyRate = totalMembers > 0 ? Math.round((todayAttendance / totalMembers) * 100) : 0;

    const monthlyStats = await Attendance.aggregate([
      { $match: { date: { $gte: monthStart } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const memberGrowth = await Member.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        inactiveMembers: totalMembers - activeMembers,
        totalTrainers,
        equipmentStats,
        todayAttendance,
        monthlyRegistrations,
        monthlyRevenue,
        monthlyAttendance,
        occupancyRate,
        monthlyStats,
        memberGrowth,
        recentMembers,
      },
    });
  } catch (error) {
    next(error);
  }
};
