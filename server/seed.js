const mongoose = require('mongoose');
const config = require('./config/config');
const credentials = require('./config/credentials');

const User = require('./models/User');
const Member = require('./models/Member');
const Trainer = require('./models/Trainer');
const Workout = require('./models/Workout');
const DietPlan = require('./models/DietPlan');
const Equipment = require('./models/Equipment');
const Attendance = require('./models/Attendance');
const Message = require('./models/Message');
const Notification = require('./models/Notification');
const Progress = require('./models/Progress');

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const equipmentData = [
  { name: 'Treadmill Pro X1', category: 'cardio', quantity: 8, available: 7, status: 'available', purchaseDate: new Date('2023-01-15'), description: 'Commercial-grade treadmill with incline' },
  { name: 'Exercise Bike SpinMax', category: 'cardio', quantity: 10, available: 9, status: 'available', purchaseDate: new Date('2023-02-20'), description: 'Spin bike for high-intensity cardio' },
  { name: 'Rowing Machine AirRow', category: 'cardio', quantity: 4, available: 4, status: 'available', purchaseDate: new Date('2023-03-10'), description: 'Full-body cardio rowing machine' },
  { name: 'Olympic Barbell Set', category: 'strength', quantity: 6, available: 6, status: 'available', purchaseDate: new Date('2022-11-01'), description: '20kg Olympic barbell with weight plates' },
  { name: 'Power Rack Station', category: 'strength', quantity: 4, available: 3, status: 'available', purchaseDate: new Date('2022-12-05'), description: 'Squat rack with safety bars' },
  { name: 'Dumbbell Set (5-50lb)', category: 'strength', quantity: 12, available: 11, status: 'available', purchaseDate: new Date('2023-01-20'), description: 'Full range of rubber-coated dumbbells' },
  { name: 'Cable Crossover Machine', category: 'strength', quantity: 2, available: 2, status: 'available', purchaseDate: new Date('2023-04-15'), description: 'Dual adjustable cable machine' },
  { name: 'Leg Press Machine', category: 'strength', quantity: 3, available: 2, status: 'available', purchaseDate: new Date('2023-02-10'), description: '45-degree angled leg press' },
  { name: 'Smith Machine', category: 'strength', quantity: 2, available: 1, status: 'maintenance', purchaseDate: new Date('2022-09-01'), lastMaintenance: new Date('2025-06-01'), nextMaintenance: new Date('2025-09-01'), description: 'Guided barbell smith machine' },
  { name: 'Yoga Mat Premium', category: 'flexibility', quantity: 20, available: 18, status: 'available', purchaseDate: new Date('2024-01-01'), description: 'Non-slip 6mm yoga mat' },
  { name: 'Resistance Band Set', category: 'flexibility', quantity: 15, available: 14, status: 'available', purchaseDate: new Date('2024-02-01'), description: 'Set of 5 bands with different resistance levels' },
  { name: 'Foam Roller', category: 'flexibility', quantity: 10, available: 10, status: 'available', purchaseDate: new Date('2024-01-15'), description: 'High-density foam roller for recovery' },
  { name: 'Kettlebell Set (10-35kg)', category: 'functional', quantity: 8, available: 8, status: 'available', purchaseDate: new Date('2023-06-01'), description: 'Cast iron kettlebells in multiple weights' },
  { name: 'Battle Ropes', category: 'functional', quantity: 3, available: 3, status: 'available', purchaseDate: new Date('2023-07-01'), description: '12m heavy-duty battle ropes' },
  { name: 'Pull-Up Bar Station', category: 'functional', quantity: 3, available: 3, status: 'available', purchaseDate: new Date('2023-05-01'), description: 'Multi-grip pull-up station' },
  { name: 'Gym Gloves', category: 'accessories', quantity: 30, available: 25, status: 'available', purchaseDate: new Date('2024-06-01'), description: 'Padded gym gloves for grip support' },
  { name: 'Weightlifting Belt', category: 'accessories', quantity: 15, available: 13, status: 'available', purchaseDate: new Date('2024-05-01'), description: 'Leather weightlifting support belt' },
  { name: 'Jump Rope Speed', category: 'accessories', quantity: 20, available: 18, status: 'available', purchaseDate: new Date('2024-04-01'), description: 'Adjustable speed jump rope' },
];

const workoutTemplates = {
  'Strength Training': [
    { name: 'Push Day', day: 'monday', exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: 8, restTime: 90 },
      { name: 'Incline Dumbbell Press', sets: 3, reps: 10, restTime: 60 },
      { name: 'Overhead Press', sets: 4, reps: 8, restTime: 90 },
      { name: 'Lateral Raises', sets: 3, reps: 12, restTime: 45 },
      { name: 'Tricep Dips', sets: 3, reps: 12, restTime: 60 },
    ], duration: 60 },
    { name: 'Pull Day', day: 'wednesday', exercises: [
      { name: 'Deadlift', sets: 4, reps: 6, restTime: 120 },
      { name: 'Barbell Rows', sets: 4, reps: 8, restTime: 90 },
      { name: 'Pull-Ups', sets: 3, reps: 10, restTime: 60 },
      { name: 'Face Pulls', sets: 3, reps: 15, restTime: 45 },
      { name: 'Barbell Curls', sets: 3, reps: 12, restTime: 60 },
    ], duration: 60 },
    { name: 'Leg Day', day: 'friday', exercises: [
      { name: 'Barbell Squat', sets: 4, reps: 8, restTime: 120 },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, restTime: 90 },
      { name: 'Leg Press', sets: 3, reps: 12, restTime: 60 },
      { name: 'Walking Lunges', sets: 3, reps: 12, restTime: 60 },
      { name: 'Calf Raises', sets: 4, reps: 15, restTime: 45 },
    ], duration: 65 },
  ],
  'Yoga': [
    { name: 'Morning Flow', day: 'monday', exercises: [
      { name: 'Sun Salutation', sets: 1, reps: 5, duration: 10, notes: 'Flow with breath' },
      { name: 'Warrior Sequence', sets: 1, reps: 1, duration: 8, notes: 'Hold each pose 30s' },
      { name: 'Balance Poses', sets: 1, reps: 1, duration: 5, notes: 'Tree pose, Eagle pose' },
      { name: 'Cool Down Stretches', sets: 1, reps: 1, duration: 5, notes: 'Focus on hamstrings' },
    ], duration: 30 },
    { name: 'Power Yoga', day: 'wednesday', exercises: [
      { name: 'Dynamic Sun Salutation', sets: 1, reps: 8, duration: 12, notes: 'Fast-paced flow' },
      { name: 'Arm Balance Series', sets: 1, reps: 1, duration: 10, notes: 'Crow, Side Crow' },
      { name: 'Core Work', sets: 1, reps: 1, duration: 8, notes: 'Boat, Plank variations' },
      { name: 'Meditation', sets: 1, reps: 1, duration: 5, notes: 'Seated meditation' },
    ], duration: 35 },
    { name: 'Restorative', day: 'friday', exercises: [
      { name: 'Gentle Warm-Up', sets: 1, reps: 1, duration: 5, notes: 'Cat-Cow, gentle twists' },
      { name: 'Supported Poses', sets: 1, reps: 1, duration: 15, notes: 'Use props for support' },
      { name: 'Hip Openers', sets: 1, reps: 1, duration: 8, notes: 'Pigeon, Butterfly' },
      { name: 'Savasana', sets: 1, reps: 1, duration: 7, notes: 'Complete relaxation' },
    ], duration: 35 },
  ],
  'Cardio & HIIT': [
    { name: 'HIIT Blast', day: 'tuesday', exercises: [
      { name: 'Burpees', sets: 4, reps: 15, restTime: 30 },
      { name: 'Mountain Climbers', sets: 4, reps: 20, restTime: 30 },
      { name: 'Jump Squats', sets: 4, reps: 15, restTime: 30 },
      { name: 'High Knees', sets: 4, duration: 30, restTime: 30 },
      { name: 'Box Jumps', sets: 3, reps: 12, restTime: 45 },
    ], duration: 45 },
    { name: 'Endurance Run', day: 'thursday', exercises: [
      { name: 'Warm-Up Jog', sets: 1, duration: 5, notes: 'Easy pace' },
      { name: 'Interval Sprints', sets: 8, duration: 1, restTime: 2, notes: 'Sprint 1min, walk 2min' },
      { name: 'Steady State Run', sets: 1, duration: 15, notes: 'Moderate pace' },
      { name: 'Cool Down Walk', sets: 1, duration: 5, notes: 'Easy pace' },
    ], duration: 50 },
  ],
  'Weight Loss': [
    { name: 'Full Body Burn', day: 'monday', exercises: [
      { name: 'Jumping Jacks', sets: 3, duration: 2, restTime: 30 },
      { name: 'Goblet Squats', sets: 3, reps: 15, restTime: 45 },
      { name: 'Push-Ups', sets: 3, reps: 15, restTime: 30 },
      { name: 'Dumbbell Rows', sets: 3, reps: 12, restTime: 45 },
      { name: 'Plank Hold', sets: 3, duration: 1, restTime: 30 },
    ], duration: 40 },
    { name: 'Cardio Circuit', day: 'wednesday', exercises: [
      { name: 'Treadmill Run', sets: 1, duration: 10, notes: 'Moderate pace' },
      { name: 'Rowing Machine', sets: 1, duration: 8, notes: 'Interval pace' },
      { name: 'Battle Ropes', sets: 3, duration: 1, restTime: 30 },
      { name: 'Kettlebell Swings', sets: 3, reps: 15, restTime: 30 },
      { name: 'Cool Down Stretch', sets: 1, duration: 5 },
    ], duration: 40 },
  ],
};

const dietTemplates = {
  'Muscle Gain': {
    name: 'High Protein Muscle Gain',
    meals: [
      { type: 'breakfast', items: ['4 whole eggs', 'Oatmeal with banana', 'Greek yogurt', 'Orange juice'], calories: 650, protein: 40, carbs: 70, fats: 22 },
      { type: 'snacks', items: ['Protein shake', 'Almonds (30g)', 'Apple'], calories: 350, protein: 30, carbs: 30, fats: 12 },
      { type: 'lunch', items: ['Grilled chicken breast (200g)', 'Brown rice (1.5 cups)', 'Mixed vegetables', 'Olive oil dressing'], calories: 750, protein: 50, carbs: 80, fats: 18 },
      { type: 'snacks', items: ['Cottage cheese', 'Whole wheat toast', 'Peanut butter'], calories: 300, protein: 25, carbs: 25, fats: 14 },
      { type: 'dinner', items: ['Salmon fillet (200g)', 'Sweet potato', 'Steamed broccoli', 'Side salad'], calories: 650, protein: 45, carbs: 55, fats: 22 },
    ],
    waterIntake: 10,
    notes: 'Eat every 3 hours. Prioritize protein intake.',
  },
  'Weight Loss': {
    name: 'Calorie Deficit Plan',
    meals: [
      { type: 'breakfast', items: ['Egg white omelette (4 whites)', 'Whole grain toast', 'Green tea'], calories: 300, protein: 25, carbs: 30, fats: 8 },
      { type: 'snacks', items: ['Mixed berries', 'Handful of walnuts'], calories: 150, protein: 4, carbs: 15, fats: 10 },
      { type: 'lunch', items: ['Grilled chicken salad', 'Quinoa (0.5 cup)', 'Lemon vinaigrette'], calories: 450, protein: 35, carbs: 35, fats: 15 },
      { type: 'dinner', items: ['Grilled fish (150g)', 'Steamed vegetables', 'Brown rice (0.5 cup)'], calories: 400, protein: 30, carbs: 40, fats: 10 },
    ],
    waterIntake: 12,
    notes: 'Stay hydrated. Avoid processed foods and sugar.',
  },
  'General Fitness': {
    name: 'Balanced Nutrition Plan',
    meals: [
      { type: 'breakfast', items: ['Scrambled eggs (2)', 'Whole wheat toast', 'Avocado', 'Milk'], calories: 500, protein: 28, carbs: 45, fats: 22 },
      { type: 'snacks', items: ['Banana', 'Protein bar'], calories: 250, protein: 15, carbs: 35, fats: 8 },
      { type: 'lunch', items: ['Turkey wrap', 'Mixed greens', 'Fruit juice'], calories: 550, protein: 35, carbs: 55, fats: 18 },
      { type: 'dinner', items: ['Grilled chicken (180g)', 'Pasta with marinara', 'Caesar salad'], calories: 650, protein: 40, carbs: 60, fats: 22 },
    ],
    waterIntake: 8,
    notes: 'Maintain balanced macros. Adjust portions as needed.',
  },
};

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomTime(baseDate, hourMin, hourMax) {
  const d = new Date(baseDate);
  const h = hourMin + Math.floor(Math.random() * (hourMax - hourMin));
  const m = Math.floor(Math.random() * 60);
  d.setHours(h, m, 0, 0);
  return d;
}

async function seed() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clear all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    console.log('Cleared all collections');

    // ─── Users (Admin) ─────────────────────────────────────────
    const adminUser = await User.create(credentials.admin);
    console.log(`Created admin: ${adminUser.email}`);

    // ─── Users (Trainers) ──────────────────────────────────────
    const trainerUsers = [];
    const trainerDocs = [];
    for (const t of credentials.trainers) {
      const user = await User.create({
        name: t.name, email: t.email, password: t.password,
        phone: t.phone, role: t.role,
      });
      const trainer = await Trainer.create({
        user: user._id,
        specialization: t.specialization,
        experience: t.experience,
        certifications: t.certifications,
        bio: t.bio,
        rating: t.rating,
      });
      trainerUsers.push(user);
      trainerDocs.push(trainer);
      console.log(`Created trainer: ${user.email}`);
    }

    // ─── Users (Members) ───────────────────────────────────────
    const memberUsers = [];
    const memberDocs = [];
    for (const m of credentials.members) {
      const user = await User.create({
        name: m.name, email: m.email, password: m.password,
        phone: m.phone, role: m.role,
      });
      const memberStart = randomDate(new Date('2025-01-01'), new Date('2025-10-01'));
      const memberEnd = new Date(memberStart);
      memberEnd.setMonth(memberEnd.getMonth() + (m.membershipType === 'premium' ? 12 : m.membershipType === 'standard' ? 6 : 1));

      const member = await Member.create({
        user: user._id,
        membershipType: m.membershipType,
        membershipStart: memberStart,
        membershipEnd: memberEnd,
        weight: m.weight,
        height: m.height,
        bodyFat: m.bodyFat,
        goals: m.goals,
        emergencyContact: m.emergencyContact,
      });
      memberUsers.push(user);
      memberDocs.push(member);
      console.log(`Created member: ${user.email}`);
    }

    // Assign trainers to members (distribute evenly)
    for (let i = 0; i < memberDocs.length; i++) {
      const trainerIdx = i % trainerDocs.length;
      memberDocs[i].assignedTrainer = trainerDocs[trainerIdx]._id;
      await memberDocs[i].save();
      trainerDocs[trainerIdx].assignedMembers.push(memberDocs[i]._id);
      await trainerDocs[trainerIdx].save();
    }
    console.log('Assigned trainers to members');

    // ─── Workouts ──────────────────────────────────────────────
    const specToTrainer = {};
    trainerDocs.forEach((t, i) => {
      t.specialization.forEach(s => { specToTrainer[s] = i; });
    });

    for (const member of memberDocs) {
      for (const goal of member.goals) {
        const templateKey = Object.keys(workoutTemplates).find(k => goal.toLowerCase().includes(k.split(' ')[0].toLowerCase()));
        if (!templateKey) continue;
        const workouts = workoutTemplates[templateKey];
        const trainerIdx = specToTrainer[templateKey] ?? (memberDocs.indexOf(member) % trainerDocs.length);

        for (const w of workouts) {
          await Workout.create({
            member: member._id,
            trainer: trainerDocs[trainerIdx]._id,
            name: w.name,
            day: w.day,
            exercises: w.exercises,
            duration: w.duration,
            isCompleted: Math.random() > 0.3,
          });
        }
        break;
      }
    }
    console.log('Created workouts');

    // ─── Diet Plans ────────────────────────────────────────────
    for (const member of memberDocs) {
      const isMuscle = member.goals.some(g => g.toLowerCase().includes('muscle') || g.toLowerCase().includes('strength'));
      const isWeightLoss = member.goals.some(g => g.toLowerCase().includes('weight loss'));
      const dietKey = isMuscle ? 'Muscle Gain' : isWeightLoss ? 'Weight Loss' : 'General Fitness';
      const diet = dietTemplates[dietKey];

      const trainerIdx = memberDocs.indexOf(member) % trainerDocs.length;
      await DietPlan.create({
        member: member._id,
        trainer: trainerDocs[trainerIdx]._id,
        name: diet.name,
        meals: diet.meals,
        waterIntake: diet.waterIntake,
        notes: diet.notes,
        isActive: true,
      });
    }
    console.log('Created diet plans');

    // ─── Equipment ─────────────────────────────────────────────
    await Equipment.insertMany(equipmentData);
    console.log('Created equipment');

    // ─── Attendance (last 30 days) ─────────────────────────────
    const today = new Date();
    for (const member of memberDocs) {
      for (let d = 0; d < 30; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - d);
        date.setHours(0, 0, 0, 0);

        if (Math.random() < 0.25) continue; // ~25% chance of absence

        const isLate = Math.random() < 0.15;
        const status = isLate ? 'late' : 'present';
        const checkIn = randomTime(date, isLate ? 10 : 6, isLate ? 11 : 10);
        const checkOut = new Date(checkIn);
        checkOut.setMinutes(checkOut.getMinutes() + 45 + Math.floor(Math.random() * 75));

        await Attendance.create({
          member: member._id,
          date,
          checkInTime: checkIn,
          checkOutTime: checkOut,
          status,
        });
      }
    }
    console.log('Created attendance records');

    // ─── Progress (last 12 weeks, weekly) ──────────────────────
    for (const member of memberDocs) {
      const creds = credentials.members[memberDocs.indexOf(member)];
      let w = creds.weight;
      let bf = creds.bodyFat;

      for (let wk = 12; wk >= 0; wk--) {
        const date = new Date(today);
        date.setDate(date.getDate() - wk * 7);

        const weightChange = (Math.random() - 0.45) * 1.5;
        const bfChange = (Math.random() - 0.45) * 0.5;
        w = Math.max(40, w + weightChange);
        bf = Math.max(5, Math.min(45, bf + bfChange));

        const h = member.height / 100;
        await Progress.create({
          member: member._id,
          weight: parseFloat(w.toFixed(1)),
          bodyFat: parseFloat(bf.toFixed(1)),
          muscleMass: parseFloat((w * (1 - bf / 100) * 0.45).toFixed(1)),
          bmi: parseFloat((w / (h * h)).toFixed(1)),
          date,
          notes: wk === 12 ? 'Initial measurement' : '',
        });
      }
    }
    console.log('Created progress records');

    // ─── Messages ──────────────────────────────────────────────
    const sampleMessages = [
      'Hey, are you available for a session tomorrow?',
      'Sure! What time works for you?',
      'Let\'s do 7 AM. Don\'t forget to warm up.',
      'Got it! Should I increase the weight this week?',
      'Yes, let\'s go up by 5kg on squats.',
      'Sounds good. Also, how\'s the diet plan working?',
      'Great! I\'ve been following it closely.',
      'Keep it up! Remember to drink enough water.',
      'Will do. Thanks for the support!',
      'Anytime! See you tomorrow.',
    ];

    for (let i = 0; i < memberDocs.length; i++) {
      const memberUser = memberUsers[i];
      const trainerUser = trainerUsers[i % trainerUsers.length];

      for (let j = 0; j < 6; j++) {
        const fromMember = j % 2 === 0;
        const msgDate = new Date(today);
        msgDate.setDate(msgDate.getDate() - Math.floor(Math.random() * 14));
        msgDate.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60));

        await Message.create({
          sender: fromMember ? memberUser._id : trainerUser._id,
          receiver: fromMember ? trainerUser._id : memberUser._id,
          content: sampleMessages[(i * 3 + j) % sampleMessages.length],
          type: 'text',
          read: Math.random() > 0.2,
          createdAt: msgDate,
        });
      }
    }
    console.log('Created messages');

    // ─── Notifications ─────────────────────────────────────────
    const notificationTemplates = [
      { title: 'Welcome to FitZone!', body: 'Your membership is now active. Start your fitness journey today!', type: 'in-app' },
      { title: 'Workout Reminder', body: 'You have a scheduled workout today. Don\'t skip it!', type: 'in-app' },
      { title: 'Membership Renewal', body: 'Your membership will expire soon. Renew now to continue.', type: 'email' },
      { title: 'New Diet Plan', body: 'Your trainer has assigned a new diet plan. Check it out!', type: 'in-app' },
      { title: 'Achievement Unlocked', body: 'You\'ve completed 10 workouts this month! Keep going!', type: 'in-app' },
      { title: 'Maintenance Notice', body: 'Some equipment is under maintenance. We apologize for the inconvenience.', type: 'in-app' },
    ];

    for (const memberUser of memberUsers) {
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const tmpl = notificationTemplates[i % notificationTemplates.length];
        await Notification.create({
          user: memberUser._id,
          title: tmpl.title,
          body: tmpl.body,
          type: tmpl.type,
          read: Math.random() > 0.4,
        });
      }
    }
    // Admin notifications
    for (const t of trainerUsers) {
      await Notification.create({
        user: t._id,
        title: 'New Member Assigned',
        body: 'A new member has been assigned to you. Check the members list.',
        type: 'in-app',
        read: false,
      });
    }
    await Notification.create({
      user: adminUser._id,
      title: 'System Update',
      body: 'All systems are running smoothly. Last backup completed successfully.',
      type: 'in-app',
      read: true,
    });
    console.log('Created notifications');

    console.log('\n──────────────────────────────────────────');
    console.log('  Seed completed successfully!');
    console.log('──────────────────────────────────────────');
    console.log('\n  LOGIN CREDENTIALS:');
    console.log('  ─────────────────');
    console.log(`  Admin   : ${credentials.admin.email} / ${credentials.admin.password}`);
    credentials.trainers.forEach(t => {
      console.log(`  Trainer : ${t.email} / ${t.password}`);
    });
    credentials.members.forEach(m => {
      console.log(`  Member  : ${m.email} / ${m.password}`);
    });
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
