const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-management',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_me',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  emailFrom: process.env.EMAIL_FROM || 'noreply@gymmanagement.com',
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
