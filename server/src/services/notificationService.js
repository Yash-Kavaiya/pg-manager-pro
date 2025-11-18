import { sendRentReminderEmail } from './emailService.js';
import { sendRentReminderSMS } from './smsService.js';
import { differenceInDays, parseISO, isPast, isToday } from 'date-fns';

/**
 * Process payment reminders for all payments
 * @param {Array} payments - Array of payment objects
 * @param {Array} tenants - Array of tenant objects
 */
export const processPaymentReminders = async (payments, tenants) => {
  console.log('\n🔍 Processing payment reminders...');

  const daysBefore = parseInt(process.env.DAYS_BEFORE_DUE) || 3;
  const today = new Date();
  const results = {
    processed: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    details: [],
  };

  for (const payment of payments) {
    // Skip if payment is already paid
    if (payment.status === 'Paid') {
      results.skipped++;
      continue;
    }

    try {
      const dueDate = parseISO(payment.dueDate);
      const daysUntilDue = differenceInDays(dueDate, today);
      const isOverdue = isPast(dueDate) && !isToday(dueDate);

      // Find tenant information
      const tenant = tenants.find(t =>
        t.id === payment.tenantId || t.name === payment.tenant
      );

      if (!tenant) {
        console.log(`⚠️  Tenant not found for payment ID ${payment.id}`);
        results.skipped++;
        continue;
      }

      // Check if notification should be sent
      const shouldSendReminder =
        isOverdue || // Payment is overdue
        daysUntilDue <= daysBefore && daysUntilDue >= 0; // Payment is due soon

      if (!shouldSendReminder) {
        results.skipped++;
        continue;
      }

      results.processed++;

      console.log(`\n📋 Processing: ${tenant.name} - Room ${payment.room}`);
      console.log(`   Amount: ₹${payment.amount.toLocaleString('en-IN')}`);
      console.log(`   Due Date: ${dueDate.toLocaleDateString('en-IN')}`);
      console.log(`   Status: ${isOverdue ? '⚠️  OVERDUE' : `📅 Due in ${daysUntilDue} days`}`);

      const notificationData = {
        to: tenant.email,
        tenantName: tenant.name,
        amount: payment.amount,
        dueDate: payment.dueDate,
        roomNumber: payment.room,
        isOverdue,
      };

      const emailResult = await sendRentReminderEmail(notificationData);
      const smsResult = await sendRentReminderSMS({
        ...notificationData,
        to: tenant.phone,
      });

      const success = emailResult.success || smsResult.success;

      if (success) {
        results.sent++;
      } else {
        results.failed++;
      }

      results.details.push({
        paymentId: payment.id,
        tenant: tenant.name,
        room: payment.room,
        email: emailResult,
        sms: smsResult,
        isOverdue,
        daysUntilDue,
      });

    } catch (error) {
      console.error(`❌ Error processing payment ID ${payment.id}:`, error.message);
      results.failed++;
    }
  }

  console.log('\n📊 Reminder Processing Summary:');
  console.log(`   Total Processed: ${results.processed}`);
  console.log(`   Successfully Sent: ${results.sent}`);
  console.log(`   Failed: ${results.failed}`);
  console.log(`   Skipped: ${results.skipped}`);
  console.log('─────────────────────────────────────\n');

  return results;
};

/**
 * Send a single payment reminder
 * @param {Object} payment - Payment object
 * @param {Object} tenant - Tenant object
 */
export const sendSingleReminder = async (payment, tenant) => {
  const dueDate = parseISO(payment.dueDate);
  const isOverdue = isPast(dueDate) && !isToday(dueDate);

  const notificationData = {
    to: tenant.email,
    tenantName: tenant.name,
    amount: payment.amount,
    dueDate: payment.dueDate,
    roomNumber: payment.room,
    isOverdue,
  };

  const emailResult = await sendRentReminderEmail(notificationData);
  const smsResult = await sendRentReminderSMS({
    ...notificationData,
    to: tenant.phone,
  });

  return {
    email: emailResult,
    sms: smsResult,
    success: emailResult.success || smsResult.success,
  };
};

export default {
  processPaymentReminders,
  sendSingleReminder,
};
