const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    weight: Number,
    bodyFat: Number,
    muscleMass: Number,
    bmi: Number,
    date: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  },
  { timestamps: true }
);

progressSchema.index({ member: 1, date: -1 });

module.exports = mongoose.model('Progress', progressSchema);
