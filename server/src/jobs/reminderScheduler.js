import cron from 'node-cron';
import dotenv from 'dotenv';
import { processPaymentReminders } from '../services/notificationService.js';

dotenv.config();

/**
 * Mock data for development/testing
 * In production, this would fetch from a database
 */
const getMockData = () => {
  // This would typically be a database query
  // For now, we'll use mock data similar to the frontend
  const payments = [
    {
      id: 1,
      pgId: "pg1",
      tenant: "Rahul Sharma",
      tenantId: 1,
      room: "101",
      amount: 8000,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      status: "Pending",
      paymentType: "Rent"
    },
    {
      id: 2,
      pgId: "pg1",
      tenant: "Priya Patel",
      tenantId: 2,
      room: "102",
      amount: 12000,
      dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
      status: "Overdue",
      paymentType: "Rent"
    }
  ];

  const tenants = [
    {
      id: 1,
      pgId: "pg1",
      name: "Rahul Sharma",
      room: "101",
      phone: "+919876543210",
      email: "rahul.sharma@example.com",
      status: "Active",
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      pgId: "pg1",
      name: "Priya Patel",
      room: "102",
      phone: "+919876543211",
      email: "priya.patel@example.com",
      status: "Active",
      joinDate: "2024-02-01"
    }
  ];

  return { payments, tenants };
};

/**
 * Fetch data from frontend's localStorage or API
 * This function would be replaced with actual API calls in production
 */
const fetchPaymentData = async () => {
  // In production, this would be:
  // const payments = await database.payments.find({ status: { $ne: 'Paid' } });
  // const tenants = await database.tenants.find({ status: 'Active' });

  const { payments, tenants } = getMockData();
  return { payments, tenants };
};

/**
 * Job to process payment reminders
 */
const reminderJob = async () => {
  try {
    console.log('\n═══════════════════════════════════════');
    console.log('⏰ Reminder Job Started:', new Date().toLocaleString('en-IN'));
    console.log('═══════════════════════════════════════');

    const { payments, tenants } = await fetchPaymentData();

    console.log(`📦 Found ${payments.length} total payments`);
    console.log(`👥 Found ${tenants.length} total tenants`);

    const results = await processPaymentReminders(payments, tenants);

    console.log('✅ Reminder Job Completed:', new Date().toLocaleString('en-IN'));
    console.log('═══════════════════════════════════════\n');

    return results;
  } catch (error) {
    console.error('❌ Error in reminder job:', error);
    return { error: error.message };
  }
};

/**
 * Start the reminder scheduler
 */
export const startReminderScheduler = () => {
  const schedule = process.env.REMINDER_SCHEDULE || '0 9 * * *'; // Default: 9 AM daily

  console.log(`⏰ Scheduling reminder job: ${schedule}`);

  // Validate cron expression
  if (!cron.validate(schedule)) {
    console.error('❌ Invalid cron schedule:', schedule);
    return;
  }

  // Schedule the job
  const task = cron.schedule(schedule, reminderJob, {
    scheduled: true,
    timezone: 'Asia/Kolkata',
  });

  console.log('✅ Reminder scheduler initialized');

  // Optional: Run immediately on startup for testing
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 Running initial reminder check (development mode)...');
    setTimeout(() => {
      reminderJob();
    }, 5000); // Run after 5 seconds
  }

  return task;
};

/**
 * Run reminder job manually (for testing or manual triggers)
 */
export const runReminderJobManually = async () => {
  console.log('🔧 Manual reminder job triggered');
  return await reminderJob();
};

// If running this file directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  console.log('🚀 Starting standalone reminder scheduler...');
  startReminderScheduler();

  // Keep the process running
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down scheduler...');
    process.exit(0);
  });
}

export default {
  startReminderScheduler,
  runReminderJobManually,
};
