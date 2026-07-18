const twilio = require('twilio');
const config = require('../config/config');

let client = null;

const getClient = () => {
  if (!client && config.twilio.accountSid && config.twilio.authToken) {
    client = twilio(config.twilio.accountSid, config.twilio.authToken);
  }
  return client;
};

const sendSMS = async ({ to, message }) => {
  try {
    const twilioClient = getClient();
    if (!twilioClient) {
      console.log(`SMS placeholder (Twilio not configured): ${message}`);
      return true;
    }

    await twilioClient.messages.create({
      body: message,
      from: config.twilio.phoneNumber,
      to,
    });

    console.log(`SMS sent to ${to}`);
    return true;
  } catch (error) {
    console.error('SMS send error:', error.message);
    return false;
  }
};

const sendWorkoutReminderSMS = async (phone, name, workoutName) => {
  const message = `Hi ${name}! Reminder: You have "${workoutName}" scheduled today. Stay fit! 💪 - FitZone Gym`;
  return sendSMS({ to: phone, message });
};

const sendMembershipReminderSMS = async (phone, name, endDate) => {
  const message = `Hi ${name}! Your gym membership expires on ${new Date(endDate).toLocaleDateString()}. Renew now to continue. - FitZone Gym`;
  return sendSMS({ to: phone, message });
};

const sendAttendanceAlertSMS = async (phone, name) => {
  const message = `Hi ${name}! You've been checked in to FitZone Gym. Have a great workout! 🏋️`;
  return sendSMS({ to: phone, message });
};

module.exports = {
  sendSMS,
  sendWorkoutReminderSMS,
  sendMembershipReminderSMS,
  sendAttendanceAlertSMS,
};
