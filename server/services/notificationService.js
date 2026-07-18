const Notification = require('../models/Notification');
const { sendEmail } = require('./emailService');
const { sendSMS } = require('./smsService');

const createNotification = async ({ userId, title, body, type = 'in-app' }) => {
  const notification = await Notification.create({ user: userId, title, body, type, sentVia: [type] });
  return notification;
};

const notifyUser = async ({ userId, title, body, channels = ['in-app'], userEmail, userPhone }) => {
  const sentVia = [];

  for (const channel of channels) {
    switch (channel) {
      case 'in-app':
        await createNotification({ userId, title, body, type: 'in-app' });
        sentVia.push('in-app');
        break;
      case 'email':
        if (userEmail) {
          const sent = await sendEmail({ to: userEmail, template: 'welcome', data: { name: title } });
          if (sent) sentVia.push('email');
        }
        break;
      case 'sms':
        if (userPhone) {
          const sent = await sendSMS({ to: userPhone, message: `${title}: ${body}` });
          if (sent) sentVia.push('sms');
        }
        break;
    }
  }

  return sentVia;
};

const broadcastNotification = async ({ userIds, title, body, channels = ['in-app'] }) => {
  const User = require('../models/User');
  const results = [];

  for (const userId of userIds) {
    const user = await User.findById(userId);
    if (user) {
      const sentVia = await notifyUser({
        userId,
        title,
        body,
        channels,
        userEmail: user.email,
        userPhone: user.phone,
      });
      results.push({ userId, sentVia });
    }
  }
  return results;
};

module.exports = { createNotification, notifyUser, broadcastNotification };
