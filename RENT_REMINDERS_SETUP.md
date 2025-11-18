# Automated Rent Payment Reminders - Setup Guide

This document provides comprehensive instructions for setting up and using the automated rent payment reminder system in PG Manager Pro.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

## Overview

The automated rent payment reminder system sends email and SMS notifications to tenants when their rent payments are due or overdue. The system runs on a scheduled basis (daily by default) and checks for upcoming and overdue payments automatically.

## Features

- **Email Reminders**: Beautiful HTML email templates sent to tenants
- **SMS Reminders**: Text message notifications via Twilio
- **Configurable Schedule**: Set how many days before due date to send reminders
- **Overdue Notifications**: Automatic reminders for overdue payments
- **Manual Triggers**: Send test reminders or trigger checks manually
- **Server Status Monitoring**: Real-time status of email and SMS services
- **Settings UI**: Easy-to-use interface for configuring notification preferences

## Architecture

```
┌─────────────────┐
│   Frontend      │
│  (React/Vite)   │
│                 │
│  - Settings UI  │
│  - Dashboard    │
└────────┬────────┘
         │ HTTP API
         ▼
┌─────────────────┐
│   Backend       │
│  (Express.js)   │
│                 │
│  - API Routes   │
│  - Scheduler    │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│ Email  │ │  SMS   │
│Service │ │Service │
└────────┘ └────────┘
```

## Prerequisites

Before setting up the reminder system, ensure you have:

1. **Node.js** (v18 or higher)
2. **npm** or **yarn**
3. **Email Service Account** (Gmail recommended)
   - Gmail account with App Password enabled
   - [How to generate Gmail App Password](https://support.google.com/accounts/answer/185833)
4. **Twilio Account** (for SMS - optional)
   - Account SID
   - Auth Token
   - Twilio Phone Number
   - [Sign up for Twilio](https://www.twilio.com/try-twilio)

## Installation

### Step 1: Install Backend Dependencies

```bash
cd server
npm install
```

This will install:
- `express` - Web server framework
- `nodemailer` - Email sending library
- `twilio` - SMS sending library
- `node-cron` - Task scheduler
- `date-fns` - Date utilities
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### Step 2: Install Frontend Dependencies (if not already done)

```bash
cd ..
npm install
```

## Configuration

### Backend Configuration

1. **Create environment file**:

```bash
cd server
cp .env.example .env
```

2. **Edit `.env` file** with your credentials:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Email Configuration (Gmail example)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=PG Manager Pro <noreply@pgmanager.com>

# Twilio SMS Configuration (Optional)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Reminder Schedule (cron format)
# Default: Every day at 9:00 AM
REMINDER_SCHEDULE=0 9 * * *

# Notification Settings
DAYS_BEFORE_DUE=3
ENABLE_EMAIL_REMINDERS=true
ENABLE_SMS_REMINDERS=true
ENABLE_OVERDUE_REMINDERS=true
```

### Frontend Configuration

1. **Create environment file** (in the root directory):

```bash
cp .env.example .env
```

2. **Edit `.env` file**:

```env
VITE_API_URL=http://localhost:3001
```

### Gmail App Password Setup

1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Scroll to "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Use this as `EMAIL_PASSWORD` in your `.env` file

### Twilio Setup (Optional - for SMS)

1. Sign up at [Twilio](https://www.twilio.com/try-twilio)
2. Get your Account SID and Auth Token from the console
3. Purchase a phone number or use the trial number
4. Add credentials to `.env` file

## Usage

### Starting the System

#### Option 1: Development Mode (Recommended for testing)

**Terminal 1 - Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

#### Option 2: Production Mode

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
npm run build
npm run preview
```

### Accessing the Settings UI

1. Open your browser and navigate to `http://localhost:5173`
2. Log in to the application
3. Click on **Settings** in the sidebar
4. Go to the **Notifications** tab

### Configuring Notification Preferences

In the Settings page, you can configure:

- **Email Reminders**: Toggle email notifications on/off
- **SMS Reminders**: Toggle SMS notifications on/off
- **Days Before Due Date**: Set how many days before the due date to send reminders (1-30 days)
- **Overdue Payment Reminders**: Enable/disable daily reminders for overdue payments
- **Reminder Time**: View the configured time for daily checks

### Testing the System

1. Click the **"Test Reminders Now"** button in Settings
2. This will manually trigger the reminder job
3. Check the server logs for processing details
4. Check your email and phone for test notifications

### Monitoring

The Settings page shows:
- **Server Status**: Online/Offline
- **Email Service**: Configured/Not Configured
- **SMS Service**: Configured/Not Configured

## API Endpoints

### GET `/health`
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "message": "PG Manager Pro Server is running"
}
```

### GET `/api/notifications/test`
Test notification service

**Response:**
```json
{
  "success": true,
  "message": "Notification service is operational",
  "config": {
    "emailEnabled": true,
    "smsEnabled": true,
    "daysBefore": 3
  }
}
```

### POST `/api/notifications/trigger`
Manually trigger reminder job

**Response:**
```json
{
  "success": true,
  "message": "Reminder job executed",
  "results": {
    "processed": 5,
    "sent": 3,
    "failed": 0,
    "skipped": 2
  }
}
```

### POST `/api/notifications/send`
Send reminders for specific payments

**Request Body:**
```json
{
  "payments": [...],
  "tenants": [...]
}
```

### POST `/api/notifications/send-single`
Send reminder for a single payment

**Request Body:**
```json
{
  "payment": {...},
  "tenant": {...}
}
```

### GET `/api/notifications/config`
Get current notification configuration

**Response:**
```json
{
  "emailEnabled": true,
  "smsEnabled": true,
  "daysBefore": 3,
  "schedule": "0 9 * * *",
  "emailConfigured": true,
  "smsConfigured": true
}
```

## How It Works

### Automated Reminder Flow

1. **Scheduler Runs**: The cron job runs daily at the configured time (default: 9:00 AM)
2. **Payment Check**: System checks all pending/overdue payments
3. **Reminder Logic**:
   - If payment is due within `DAYS_BEFORE_DUE` days → Send reminder
   - If payment is overdue → Send overdue reminder
   - If payment is already paid → Skip
4. **Notification Sending**:
   - Email sent via Nodemailer (if enabled)
   - SMS sent via Twilio (if enabled)
5. **Logging**: Results are logged to console and can be extended to database

### Email Template

The system sends professionally designed HTML emails with:
- PG Manager Pro branding
- Payment details (room, amount, due date)
- Color-coded urgency indicators
- Overdue warnings
- Responsive design

### SMS Template

Simple, concise SMS messages containing:
- Tenant name
- Room number
- Amount due
- Due date
- Urgency indicator (🔔 for upcoming, ⚠️ for overdue)

## Cron Schedule Format

The `REMINDER_SCHEDULE` uses standard cron format:

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

**Examples:**
- `0 9 * * *` - Every day at 9:00 AM
- `0 9,18 * * *` - Every day at 9:00 AM and 6:00 PM
- `0 9 * * 1-5` - Every weekday at 9:00 AM
- `0 9 1 * *` - First day of every month at 9:00 AM

## Troubleshooting

### Server shows "Offline" in Settings

**Problem**: Backend server is not running

**Solution**:
```bash
cd server
npm install
npm run dev
```

### Email Service shows "Not Configured"

**Problem**: Email credentials are missing or incorrect

**Solution**:
1. Check `.env` file in `server/` directory
2. Ensure `EMAIL_USER` and `EMAIL_PASSWORD` are set
3. For Gmail, ensure you're using an App Password, not your regular password
4. Restart the server after updating `.env`

### SMS Service shows "Not Configured"

**Problem**: Twilio credentials are missing

**Solution**:
1. Check `.env` file in `server/` directory
2. Ensure `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` are set
3. Verify credentials at [Twilio Console](https://console.twilio.com/)
4. Restart the server

### No emails/SMS being sent

**Possible causes**:
1. Services disabled in `.env`:
   ```env
   ENABLE_EMAIL_REMINDERS=true
   ENABLE_SMS_REMINDERS=true
   ```

2. No payments meeting reminder criteria:
   - Check if payments are within `DAYS_BEFORE_DUE` days
   - Ensure payment status is not "Paid"

3. Invalid tenant contact information:
   - Verify tenant email addresses
   - Ensure phone numbers include country code (e.g., +919876543210)

4. Network/firewall issues:
   - Check if outbound SMTP (port 587/465) is allowed
   - Verify internet connectivity

### Testing with Mock Data

The server includes mock data for testing. To test without a database:

1. Start the server: `cd server && npm run dev`
2. Trigger manual test: Click "Test Reminders Now" in Settings
3. Check server console for detailed logs

### Gmail "Less Secure Apps" Error

If you see authentication errors with Gmail:

1. **Don't use** "Allow less secure apps" (deprecated)
2. **Do use** App Passwords:
   - Enable 2-Step Verification on your Google Account
   - Generate an App Password
   - Use the App Password in your `.env` file

### Twilio Trial Limitations

If using Twilio trial account:
- You can only send SMS to verified phone numbers
- Add test numbers in Twilio Console → Phone Numbers → Verified Caller IDs

## Development vs Production

### Development

- Uses `nodemon` for auto-restart
- Runs initial reminder check 5 seconds after startup
- Detailed console logging
- Mock data included

### Production

- Use `npm start` for stable operation
- Configure process manager (PM2 recommended):
  ```bash
  npm install -g pm2
  pm2 start server/src/index.js --name pg-reminder
  pm2 startup
  pm2 save
  ```

## Future Enhancements

Potential improvements:
- Database integration (PostgreSQL/MongoDB)
- Notification history/logs storage
- In-app notification center
- WhatsApp integration
- Custom email templates per PG
- Tenant notification preferences
- Multi-language support
- Payment gateway integration
- Reminder analytics dashboard

## Support

For issues or questions:
1. Check this documentation
2. Review server console logs
3. Verify environment configuration
4. Test with mock data first
5. Check network/firewall settings

## License

This feature is part of PG Manager Pro and follows the main project's license.

---

**Last Updated**: November 2025
**Version**: 1.0.0
