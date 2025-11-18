import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notifications.js';
import { startReminderScheduler } from './jobs/reminderScheduler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PG Manager Pro Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📧 Email reminders: ${process.env.ENABLE_EMAIL_REMINDERS === 'true' ? 'Enabled' : 'Disabled'}`);
  console.log(`📱 SMS reminders: ${process.env.ENABLE_SMS_REMINDERS === 'true' ? 'Enabled' : 'Disabled'}`);

  // Start the reminder scheduler
  startReminderScheduler();
  console.log('⏰ Reminder scheduler started');
});

export default app;
