const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['cardio', 'strength', 'flexibility', 'functional', 'accessories'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    available: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    status: {
      type: String,
      enum: ['available', 'maintenance', 'retired'],
      default: 'available',
    },
    purchaseDate: Date,
    lastMaintenance: Date,
    nextMaintenance: Date,
    image: String,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
