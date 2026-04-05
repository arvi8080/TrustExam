const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send invitation email
const sendInvitationEmail = async (email, examTitle, examId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Invitation to take exam: ${examTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Exam Invitation</h2>
        <p>You have been invited to take the following exam:</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0; color: #2c3e50;">${examTitle}</h3>
        </div>
        <p>Please click the button below to register and take the exam:</p>
        <a href="${process.env.FRONTEND_URL}/register?exam=${examId}&email=${encodeURIComponent(email)}"
           style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
          Register and Take Exam
        </a>
        <p style="color: #666; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          ${process.env.FRONTEND_URL}/register?exam=${examId}&email=${encodeURIComponent(email)}
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invitation email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendInvitationEmail
};
