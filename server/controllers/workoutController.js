const Workout = require('../models/Workout');

exports.getWorkouts = async (req, res, next) => {
  try {
    const { member, trainer, day, page = 1, limit = 20 } = req.query;
    const query = Workout.find();
    if (member) query.where('member').equals(member);
    if (trainer) query.where('trainer').equals(trainer);
    if (day) query.where('day').equals(day);

    const total = await Workout.countDocuments(query.getFilter());
    const workouts = await query
      .populate('member', 'name')
      .populate('trainer', 'name')
      .sort({ day: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: { workouts, total, page: Number(page), totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    next(error);
  }
};

exports.getMyWorkouts = async (req, res, next) => {
  try {
    const { day } = req.query;
    const Member = require('../models/Member');
    const member = await Member.findOne({ user: req.user._id });
    const query = Workout.find({ member: member._id });
    if (day) query.where('day').equals(day);
    const workouts = await query.sort({ day: 1 });
    res.json({ success: true, data: workouts });
  } catch (error) {
    next(error);
  }
};

exports.createWorkout = async (req, res, next) => {
  try {
    const { member, name, day, exercises, duration } = req.body;
    const Trainer = require('../models/Trainer');
    const trainer = await Trainer.findOne({ user: req.user._id });

    const workout = await Workout.create({
      member,
      trainer: trainer._id,
      name,
      day,
      exercises: exercises || [],
      duration: duration || 0,
    });

    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
};

exports.updateWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    res.json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
};

exports.deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    res.json({ success: true, message: 'Workout deleted' });
  } catch (error) {
    next(error);
  }
};

exports.markComplete = async (req, res, next) => {
  try {
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { isCompleted: true, completedAt: new Date() },
      { new: true }
    );
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    res.json({ success: true, data: workout });
  } catch (error) {
    next(error);
  }
};
