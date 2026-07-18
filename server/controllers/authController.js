const User = require('../models/User');
const Member = require('../models/Member');
const Trainer = require('../models/Trainer');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('../services/emailService');
const crypto = require('crypto');

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, membershipType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, role: role || 'member', phone });

    if (user.role === 'member') {
      const membershipEnd = new Date();
      membershipEnd.setMonth(membershipEnd.getMonth() + 1);
      await Member.create({
        user: user._id,
        membershipType: membershipType || 'basic',
        membershipEnd,
      });
      sendEmail({ to: email, template: 'welcome', data: { name } }).catch(() => {});
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    let extraData = {};
    if (user.role === 'member') {
      const member = await Member.findOne({ user: user._id });
      extraData = { member };
    } else if (user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: user._id });
      extraData = { trainer };
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        darkMode: user.darkMode,
        token,
        ...extraData,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let extraData = {};

    if (user.role === 'member') {
      const member = await Member.findOne({ user: user._id }).populate('assignedTrainer');
      extraData = { member };
    } else if (user.role === 'trainer') {
      const trainer = await Trainer.findOne({ user: user._id }).populate('assignedMembers');
      extraData = { trainer };
    }

    res.json({ success: true, data: { ...user.toObject(), ...extraData } });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user with that email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

    sendEmail({
      to: user.email,
      template: 'passwordReset',
      data: { name: user.name, resetUrl },
    }).catch(() => {});

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, data: { token } });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.phone) updates.phone = req.body.phone;
    if (req.file) updates.profileImage = `/uploads/${req.file.filename}`;
    if (req.body.darkMode !== undefined) updates.darkMode = req.body.darkMode === 'true' || req.body.darkMode === true;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });

    if (user.role === 'member' && req.body.weight) {
      await Member.findOneAndUpdate(
        { user: user._id },
        {
          weight: req.body.weight,
          height: req.body.height,
          goals: req.body.goals ? JSON.parse(req.body.goals) : undefined,
          emergencyContact: req.body.emergencyContact ? JSON.parse(req.body.emergencyContact) : undefined,
        }
      );
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = req.body.newPassword;
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, data: { token } });
  } catch (error) {
    next(error);
  }
};
