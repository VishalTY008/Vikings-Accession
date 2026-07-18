const Attendance = require('../models/Attendance');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const Equipment = require('../models/Equipment');

exports.getAttendanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate, memberId } = req.query;
    const match = {};
    if (startDate && endDate) {
      match.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (memberId) match.member = require('mongoose').Types.ObjectId.createFromHexString(memberId);

    const daily = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const summary = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json({ success: true, data: { daily, summary } });
  } catch (error) {
    next(error);
  }
};

exports.getRevenueReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const match = {};
    if (startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const byMembership = await Member.aggregate([
      { $match: match },
      { $group: { _id: '$membershipType', count: { $sum: 1 } } },
    ]);

    const monthlyRevenue = await Member.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { month: '$_id', registrations: '$count', revenue: { $multiply: ['$count', 49] } } },
    ]);

    res.json({ success: true, data: { byMembership, monthlyRevenue } });
  } catch (error) {
    next(error);
  }
};

exports.getTrainerReport = async (req, res, next) => {
  try {
    const trainers = await Trainer.find()
      .populate('user', 'name email')
      .select('specialization experience rating assignedMembers');

    const report = trainers.map((t) => ({
      name: t.user.name,
      email: t.user.email,
      specialization: t.specialization,
      experience: t.experience,
      rating: t.rating,
      memberCount: t.assignedMembers.length,
    }));

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

exports.getEquipmentReport = async (req, res, next) => {
  try {
    const byCategory = await Equipment.aggregate([
      { $group: { _id: '$category', total: { $sum: '$quantity' }, available: { $sum: '$available' } } },
    ]);

    const byStatus = await Equipment.aggregate([
      { $group: { _id: '$status', count: { $sum: '$quantity' } } },
    ]);

    const maintenanceNeeded = await Equipment.find({
      nextMaintenance: { $lte: new Date() },
      status: { $ne: 'retired' },
    });

    res.json({ success: true, data: { byCategory, byStatus, maintenanceNeeded } });
  } catch (error) {
    next(error);
  }
};
