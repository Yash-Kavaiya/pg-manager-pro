import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Create Twilio client
 */
const createTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    return null;
  }

  return twilio(accountSid, authToken);
};

/**
 * Send rent payment reminder SMS
 * @param {Object} params - SMS parameters
 * @param {string} params.to - Recipient phone number (with country code, e.g., +919876543210)
 * @param {string} params.tenantName - Tenant name
 * @param {number} params.amount - Payment amount
 * @param {string} params.dueDate - Payment due date
 * @param {string} params.roomNumber - Room number
 * @param {boolean} params.isOverdue - Whether payment is overdue
 */
export const sendRentReminderSMS = async ({
  to,
  tenantName,
  amount,
  dueDate,
  roomNumber,
  isOverdue = false,
}) => {
  if (process.env.ENABLE_SMS_REMINDERS !== 'true') {
    console.log('📱 SMS reminders are disabled');
    return { success: false, message: 'SMS reminders disabled' };
  }

  const client = createTwilioClient();

  if (!client) {
    console.error('❌ Twilio credentials not configured');
    return { success: false, message: 'Twilio credentials not configured' };
  }

  try {
    const formattedDate = new Date(dueDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const message = isOverdue
      ? `⚠️ OVERDUE RENT ALERT\n\nDear ${tenantName},\n\nYour rent payment for Room ${roomNumber} is OVERDUE.\n\nAmount: ₹${amount.toLocaleString('en-IN')}\nDue Date: ${formattedDate}\n\nPlease pay immediately to avoid late fees.\n\n- PG Manager Pro`
      : `🔔 RENT REMINDER\n\nDear ${tenantName},\n\nYour rent payment is due soon.\n\nRoom: ${roomNumber}\nAmount: ₹${amount.toLocaleString('en-IN')}\nDue Date: ${formattedDate}\n\nPlease ensure timely payment.\n\n- PG Manager Pro`;

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log(`✅ SMS sent to ${to}: ${response.sid}`);
    return {
      success: true,
      sid: response.sid,
      message: 'SMS sent successfully'
    };
  } catch (error) {
    console.error(`❌ Error sending SMS to ${to}:`, error.message);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send SMS'
    };
  }
};

export default {
  sendRentReminderSMS,
};
