const User = require('../models/User');

let gymSettings = {
  name: 'FitZone Gym',
  address: '123 Fitness Street, Workout City',
  phone: '+1 (555) 123-4567',
  email: 'info@fitzonegym.com',
  openHours: '5:00 AM - 11:00 PM',
  membershipPlans: [
    { name: 'Basic', price: 29, duration: 1, features: ['Gym Access', 'Basic Equipment'] },
    { name: 'Standard', price: 49, duration: 1, features: ['Gym Access', 'All Equipment', '1 Trainer Session/Week'] },
    { name: 'Premium', price: 79, duration: 1, features: ['Gym Access', 'All Equipment', 'Unlimited Trainer Sessions', 'Diet Plan'] },
  ],
};

exports.getSettings = (req, res) => {
  res.json({ success: true, data: gymSettings });
};

exports.updateSettings = (req, res) => {
  gymSettings = { ...gymSettings, ...req.body };
  res.json({ success: true, data: gymSettings });
};
