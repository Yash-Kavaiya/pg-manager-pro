import express from 'express';
import { processPaymentReminders, sendSingleReminder } from '../services/notificationService.js';
import { runReminderJobManually } from '../jobs/reminderScheduler.js';

const router = express.Router();

/**
 * GET /api/notifications/test
 * Test endpoint to verify notification service is working
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Notification service is operational',
    config: {
      emailEnabled: process.env.ENABLE_EMAIL_REMINDERS === 'true',
      smsEnabled: process.env.ENABLE_SMS_REMINDERS === 'true',
      daysBefore: process.env.DAYS_BEFORE_DUE || 3,
    }
  });
});

/**
 * POST /api/notifications/trigger
 * Manually trigger reminder job (for testing or manual execution)
 */
router.post('/trigger', async (req, res) => {
  try {
    console.log('📤 Manual trigger requested');
    const results = await runReminderJobManually();

    res.json({
      success: true,
      message: 'Reminder job executed',
      results
    });
  } catch (error) {
    console.error('Error triggering reminder job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to trigger reminder job',
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/send
 * Send notification for specific payment
 * Body: { payments: Array, tenants: Array }
 */
router.post('/send', async (req, res) => {
  try {
    const { payments, tenants } = req.body;

    if (!payments || !tenants) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: payments and tenants'
      });
    }

    const results = await processPaymentReminders(payments, tenants);

    res.json({
      success: true,
      message: 'Reminders processed',
      results
    });
  } catch (error) {
    console.error('Error sending notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notifications',
      error: error.message
    });
  }
});

/**
 * POST /api/notifications/send-single
 * Send notification for a single payment
 * Body: { payment: Object, tenant: Object }
 */
router.post('/send-single', async (req, res) => {
  try {
    const { payment, tenant } = req.body;

    if (!payment || !tenant) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: payment and tenant'
      });
    }

    const result = await sendSingleReminder(payment, tenant);

    res.json({
      success: result.success,
      message: result.success ? 'Reminder sent successfully' : 'Failed to send reminder',
      result
    });
  } catch (error) {
    console.error('Error sending single notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
      error: error.message
    });
  }
});

/**
 * GET /api/notifications/config
 * Get current notification configuration
 */
router.get('/config', (req, res) => {
  res.json({
    emailEnabled: process.env.ENABLE_EMAIL_REMINDERS === 'true',
    smsEnabled: process.env.ENABLE_SMS_REMINDERS === 'true',
    daysBefore: parseInt(process.env.DAYS_BEFORE_DUE) || 3,
    schedule: process.env.REMINDER_SCHEDULE || '0 9 * * *',
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
    smsConfigured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
  });
});

export default router;
