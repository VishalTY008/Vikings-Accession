const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: [String],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    certifications: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    assignedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trainer', trainerSchema);
