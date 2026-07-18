const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    membershipType: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      default: 'basic',
    },
    membershipStart: {
      type: Date,
      default: Date.now,
    },
    membershipEnd: {
      type: Date,
      required: true,
    },
    weight: {
      type: Number,
      min: 20,
      max: 300,
    },
    height: {
      type: Number,
      min: 100,
      max: 250,
    },
    bmi: {
      type: Number,
    },
    bodyFat: {
      type: Number,
      min: 0,
      max: 60,
    },
    emergencyContact: {
      name: String,
      phone: String,
    },
    assignedTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
    },
    goals: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

memberSchema.pre('save', function (next) {
  if (this.weight && this.height) {
    const h = this.height / 100;
    this.bmi = parseFloat((this.weight / (h * h)).toFixed(1));
  }
  next();
});

module.exports = mongoose.model('Member', memberSchema);
