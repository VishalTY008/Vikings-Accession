const nodemailer = require('nodemailer');
const config = require('../config/config');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
};

const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to FitZone Gym!',
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#4F46E5,#06B6D4);padding:40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px">Welcome to FitZone 💪</h1>
        </div>
        <div style="padding:30px">
          <p style="color:#334155;font-size:16px">Hi ${name},</p>
          <p style="color:#64748b;font-size:14px;line-height:1.6">
            We're thrilled to have you on board! Your fitness journey starts now.
            Access your dashboard to view your workout plans, diet plans, and track your progress.
          </p>
          <a href="${config.clientUrl}/login" style="display:inline-block;background:#4F46E5;color:#fff;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:10px">
            Go to Dashboard
          </a>
        </div>
        <div style="background:#f8fafc;padding:20px;text-align:center">
          <p style="color:#94a3b8;font-size:12px">FitZone Gym Management System</p>
        </div>
      </div>
    `,
  }),

  workoutReminder: (name, workoutName) => ({
    subject: `Workout Reminder: ${workoutName}`,
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#22C55E,#06B6D4);padding:30px;text-align:center">
          <h1 style="color:#fff;margin:0">Time to Workout! 🏋️</h1>
        </div>
        <div style="padding:30px">
          <p style="color:#334155;font-size:16px">Hi ${name},</p>
          <p style="color:#64748b;line-height:1.6">
            Don't forget your scheduled workout: <strong>${workoutName}</strong>.
            Stay consistent and keep pushing towards your goals!
          </p>
          <a href="${config.clientUrl}/member/workouts" style="display:inline-block;background:#22C55E;color:#fff;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:600">
            View Workout
          </a>
        </div>
      </div>
    `,
  }),

  membershipRenewal: (name, endDate) => ({
    subject: 'Membership Renewal Reminder',
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#F59E0B,#EF4444);padding:30px;text-align:center">
          <h1 style="color:#fff;margin:0">Membership Expiring Soon ⚠️</h1>
        </div>
        <div style="padding:30px">
          <p style="color:#334155;font-size:16px">Hi ${name},</p>
          <p style="color:#64748b;line-height:1.6">
            Your gym membership is expiring on <strong>${new Date(endDate).toLocaleDateString()}</strong>.
            Renew now to continue enjoying uninterrupted access to all facilities.
          </p>
          <a href="${config.clientUrl}/member/profile" style="display:inline-block;background:#F59E0B;color:#fff;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:600">
            Renew Now
          </a>
        </div>
      </div>
    `,
  }),

  passwordReset: (name, resetUrl) => ({
    subject: 'Password Reset Request',
    html: `
      <div style="font-family:'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#4F46E5,#06B6D4);padding:30px;text-align:center">
          <h1 style="color:#fff;margin:0">Password Reset</h1>
        </div>
        <div style="padding:30px">
          <p style="color:#334155;font-size:16px">Hi ${name},</p>
          <p style="color:#64748b;line-height:1.6">
            You requested a password reset. Click the button below to reset your password.
            This link expires in 15 minutes.
          </p>
          <a href="${resetUrl}" style="display:inline-block;background:#4F46E5;color:#fff;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:600">
            Reset Password
          </a>
          <p style="color:#94a3b8;font-size:12px;margin-top:20px">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `,
  }),
};

const sendEmail = async ({ to, template, data }) => {
  try {
    const transporter = createTransporter();
    const { subject, html } = emailTemplates[template](...Object.values(data));

    await transporter.sendMail({
      from: `"FitZone Gym" <${config.emailFrom}>`,
      to,
      subject,
      html,
    });

    console.log(`Email sent to ${to}: ${subject}`);
    return true;
  } catch (error) {
    console.error('Email send error:', error.message);
    return false;
  }
};

const sendBulkEmail = async ({ recipients, template, data }) => {
  const results = await Promise.allSettled(
    recipients.map((email) => sendEmail({ to: email, template, data }))
  );
  return results;
};

module.exports = { sendEmail, sendBulkEmail, emailTemplates };
