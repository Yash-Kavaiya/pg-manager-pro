import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send rent payment reminder email
 * @param {Object} params - Email parameters
 * @param {string} params.to - Recipient email
 * @param {string} params.tenantName - Tenant name
 * @param {number} params.amount - Payment amount
 * @param {string} params.dueDate - Payment due date
 * @param {string} params.roomNumber - Room number
 * @param {boolean} params.isOverdue - Whether payment is overdue
 */
export const sendRentReminderEmail = async ({
  to,
  tenantName,
  amount,
  dueDate,
  roomNumber,
  isOverdue = false,
}) => {
  if (process.env.ENABLE_EMAIL_REMINDERS !== 'true') {
    console.log('📧 Email reminders are disabled');
    return { success: false, message: 'Email reminders disabled' };
  }

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('❌ Email credentials not configured');
    return { success: false, message: 'Email credentials not configured' };
  }

  try {
    const transporter = createTransporter();

    const subject = isOverdue
      ? `⚠️ OVERDUE: Rent Payment Reminder - Room ${roomNumber}`
      : `🔔 Rent Payment Reminder - Room ${roomNumber}`;

    const html = generateEmailTemplate({
      tenantName,
      amount,
      dueDate,
      roomNumber,
      isOverdue,
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.message);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    };
  }
};

/**
 * Generate HTML email template
 */
const generateEmailTemplate = ({ tenantName, amount, dueDate, roomNumber, isOverdue }) => {
  const formattedDate = new Date(dueDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const urgencyColor = isOverdue ? '#dc2626' : '#f59e0b';
  const urgencyText = isOverdue ? 'OVERDUE PAYMENT' : 'UPCOMING PAYMENT';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rent Payment Reminder</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px;">PG Manager Pro</h1>
                  <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">Payment Reminder Notification</p>
                </td>
              </tr>

              <!-- Alert Badge -->
              <tr>
                <td style="padding: 20px; text-align: center;">
                  <div style="display: inline-block; background-color: ${urgencyColor}; color: #ffffff; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 12px; text-transform: uppercase;">
                    ${urgencyText}
                  </div>
                </td>
              </tr>

              <!-- Content -->
              <tr>
                <td style="padding: 0 30px 30px 30px;">
                  <p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">
                    Dear <strong>${tenantName}</strong>,
                  </p>

                  <p style="font-size: 16px; color: #374151; line-height: 1.6; margin: 0 0 20px 0;">
                    This is a ${isOverdue ? 'reminder that your' : 'friendly reminder that your'} rent payment ${isOverdue ? 'was due' : 'is due'} soon. Please find the details below:
                  </p>

                  <!-- Payment Details Box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
                    <tr>
                      <td style="padding: 20px;">
                        <table width="100%" cellpadding="8" cellspacing="0">
                          <tr>
                            <td style="color: #6b7280; font-size: 14px; width: 40%;">Room Number:</td>
                            <td style="color: #111827; font-size: 16px; font-weight: bold;">${roomNumber}</td>
                          </tr>
                          <tr>
                            <td style="color: #6b7280; font-size: 14px;">Amount Due:</td>
                            <td style="color: #111827; font-size: 20px; font-weight: bold;">₹${amount.toLocaleString('en-IN')}</td>
                          </tr>
                          <tr>
                            <td style="color: #6b7280; font-size: 14px;">Due Date:</td>
                            <td style="color: ${isOverdue ? '#dc2626' : '#111827'}; font-size: 16px; font-weight: bold;">${formattedDate}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  ${isOverdue ? `
                    <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;">
                      <p style="margin: 0; color: #991b1b; font-size: 14px; font-weight: 600;">
                        ⚠️ This payment is overdue. Please make the payment as soon as possible to avoid late fees.
                      </p>
                    </div>
                  ` : `
                    <p style="font-size: 14px; color: #6b7280; margin: 20px 0;">
                      💡 <em>Please ensure timely payment to avoid any late fees or inconvenience.</em>
                    </p>
                  `}

                  <p style="font-size: 16px; color: #374151; margin: 20px 0;">
                    If you have already made the payment, please disregard this reminder. For any queries or concerns, feel free to contact the management.
                  </p>

                  <p style="font-size: 16px; color: #374151; margin: 20px 0 0 0;">
                    Thank you,<br>
                    <strong>PG Management Team</strong>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0; color: #6b7280; font-size: 12px;">
                    This is an automated reminder from PG Manager Pro.
                  </p>
                  <p style="margin: 5px 0 0 0; color: #9ca3af; font-size: 11px;">
                    © ${new Date().getFullYear()} PG Manager Pro. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

export default {
  sendRentReminderEmail,
};
