const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snacks'],
    required: true,
  },
  items: [{ type: String }],
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
});

const dietPlanSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    meals: [mealSchema],
    totalCalories: { type: Number, default: 0 },
    waterIntake: { type: Number, default: 8 },
    notes: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

dietPlanSchema.pre('save', function (next) {
  this.totalCalories = this.meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
  next();
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
