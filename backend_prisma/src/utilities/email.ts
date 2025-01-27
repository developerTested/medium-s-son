import ApiError from "./ApiError";
import { appConfig } from "./helper";
import { Resend } from 'resend';

/**
 * Send an email to user
 * @param to 
 * @param subject 
 * @param text 
 * @param html 
 */
const sendEmail = async (to: string, subject = 'Password Reset Request', text: string, html?: string) => {
  
  const transporter = new Resend(appConfig.RESEND_API)
  const mailOptions = {
    from: 'No Reply <onboarding@resend.dev>',
    to: to, // Recipient email
    replyTo: appConfig.EMAIL_FROM,
    subject: subject,
    text: text, // Plain text version of the email
    html: html, // HTML version of the email
  };

  try {
    // Send email using Nodemailer
    const response  = await transporter.emails.send(mailOptions);
    console.log(`Email sent to ${to}`);
    console.log(response);
    
  } catch (error) {
    console.error('Error sending email:', error);
    throw new ApiError(500, 'Failed to send email');
  }
};

// Function to send a password reset email with the reset token
export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
  const resetLink = `${appConfig.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const subject = 'Password Reset Request';
  const text = `You have requested to reset your password. Click the link below to reset it:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`;
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You have requested to reset your password. To reset your password, click the link below:</p>
        <p><a href="${resetLink}" style="color: #007BFF; text-decoration: none;">Reset Password</a></p>
        <p>If you did not request this, please ignore this email.</p>
        <p style="font-size: 0.9em; color: #888;">This link will expire in 1 hour.</p>
        <hr />
        <footer style="font-size: 0.8em; color: #888;">
          <p>Thank you for using our service!</p>
          <p>If you have any questions, feel free to contact us.</p>
        </footer>
      </body>
    </html>
  `;

  await sendEmail(email, subject, text, html);
};
