# Room Booking Forms - User Guide

## Overview

The PG Manager Pro now includes comprehensive room booking forms with tenant management. This guide explains how to use the new booking features.

## Features

### 1. Enhanced Booking Form Dialog

The main booking form (`BookingFormDialog`) provides a complete solution for managing room bookings with full tenant details.

#### Key Features:

- **React Hook Form Integration**: Professional form handling with automatic validation
- **Zod Schema Validation**: Type-safe validation with clear error messages
- **Room Selection**: Dropdown showing only available rooms with rent and type information
- **Tenant Autocomplete**: Auto-fills tenant details when selecting existing tenants
- **Auto-fill Rent**: Automatically fills monthly rent and security deposit when room is selected
- **Emergency Contact**: Capture emergency contact information
- **Document Management**: Store URLs for ID proof, photos, and rental agreements
- **Date Validation**: Ensures end date is after start date
- **Notes Section**: Additional booking information and special requirements

#### Form Sections:

1. **Room Details**
   - Room number (dropdown with available rooms)
   - Booking status (Pending, Upcoming, Active, Completed, Cancelled)

2. **Tenant Information**
   - Tenant name (with autocomplete from existing tenants)
   - Email address
   - Phone number

3. **Booking Period**
   - Start date (check-in)
   - End date (expected check-out)

4. **Financial Details**
   - Monthly rent (auto-filled from room data)
   - Security deposit (auto-filled from room data)
   - Advance payment (optional)

5. **Emergency Contact**
   - Contact name
   - Phone number
   - Relationship to tenant

6. **Documents** (Optional)
   - ID proof URL (Aadhar, PAN, etc.)
   - Photo URL
   - Rental agreement URL

7. **Additional Notes**
   - Special requirements
   - Preferences
   - Important information

### 2. Quick Booking Card

For rapid data entry, use the Quick Booking Card (`QuickBookingCard`) which provides a simplified booking workflow.

#### Features:

- **Minimal Fields**: Only essential information required
- **Fast Entry**: Create bookings in seconds
- **Smart Defaults**:
  - Auto-fills rent from selected room
  - Sets end date to 1 year from start date
  - Sets security deposit to 2x monthly rent
  - Status defaults to "Pending"
- **Tenant Autocomplete**: Auto-fills phone from existing tenants
- **Compact UI**: Takes minimal screen space

#### Required Fields:

1. Room number
2. Tenant name
3. Phone number
4. Start date
5. Monthly rent

#### Usage:

1. Select an available room from the dropdown
2. Enter tenant name (or select from existing)
3. Phone number is auto-filled if tenant exists
4. Monthly rent is auto-filled from room data
5. Adjust start date if needed
6. Click "Create" to add the booking
7. Edit the booking later for additional details

### 3. Context-Based CRUD Operations

The PG Context now includes dedicated booking operations:

```typescript
// Add a new booking
addBooking(bookingData)

// Update an existing booking
updateBooking(bookingId, updates)

// Delete a booking
deleteBooking(bookingId)
```

These methods automatically handle:
- ID generation
- Timestamps (createdAt, updatedAt)
- Data consistency

## How to Use

### Creating a New Booking

#### Method 1: Full Form (Detailed)

1. Navigate to the Bookings page
2. Click the "Add Booking" button in the top-right
3. Fill in all required fields (marked with *)
4. Optionally add emergency contact and documents
5. Click "Create Booking"

**Best for**: New tenants, detailed record-keeping

#### Method 2: Quick Booking (Fast)

1. Navigate to the Bookings page
2. Use the "Quick Booking" card on the right side
3. Fill in the 5 essential fields
4. Click "Create"
5. Edit later to add more details if needed

**Best for**: Existing tenants, rapid data entry

### Editing a Booking

1. Find the booking in the table
2. Click the three-dot menu (⋮) on the right
3. Select "Edit Booking"
4. Update any fields
5. Click "Update Booking"

### Viewing Booking Details

1. Click the three-dot menu (⋮) on any booking
2. Select "View Details"
3. Review all booking information
4. Click "Edit" button to make changes

### Managing Payments

1. Click the three-dot menu (⋮) on a booking
2. Select "Add Payment"
3. Fill in payment details
4. Payment is linked to the booking

### Cancelling a Booking

1. Click the three-dot menu (⋮) on a booking
2. Select "Cancel Booking"
3. Booking status changes to "Cancelled"
4. Room becomes available again

### Deleting a Booking

1. Click the three-dot menu (⋮) on a booking
2. Select "Delete Booking"
3. Confirm the deletion
4. Booking and all associated payments are removed

## Validation Rules

### Required Fields (Full Form)
- Room number
- Tenant name (minimum 2 characters)
- Start date
- End date
- Monthly rent (must be positive)
- Security deposit (must be positive)

### Optional But Recommended
- Email address
- Phone number
- Emergency contact information
- Document URLs

### Validation Messages

The form provides clear, inline validation messages:
- "Room is required"
- "Tenant name must be at least 2 characters"
- "Invalid email address"
- "Phone number must be at least 10 digits"
- "End date must be after or equal to start date"
- "Monthly rent must be positive"

## Tips and Best Practices

### 1. Use Tenant Autocomplete
When entering a tenant name, start typing to see existing tenants. Selecting one auto-fills their contact information.

### 2. Let Rooms Auto-Fill Financial Data
When you select a room, the monthly rent and security deposit are automatically filled based on the room's configuration.

### 3. Use Quick Booking for Speed
For returning tenants or when you're in a hurry, use the Quick Booking card. You can always edit the booking later to add more details.

### 4. Keep Documents Organized
Store important documents (ID proofs, agreements) in cloud storage and paste the URLs in the booking form for easy access.

### 5. Use Notes Effectively
Add special requirements, parking spots, meal preferences, or any other important information in the notes section.

### 6. Track Payment Status
The bookings table shows payment status for each booking:
- **Paid**: Full payment received
- **Partial**: Some payment received
- **Pending**: No payment received
- **Overdue**: Payment past due date

### 7. Filter and Search
Use the search bar and filters to quickly find specific bookings:
- Search by tenant name, room number, email, or phone
- Filter by booking status (Active, Pending, etc.)
- Filter by payment status

## Keyboard Shortcuts

- **Tab**: Navigate between form fields
- **Enter**: Submit form (when focused on a button)
- **Esc**: Close dialog
- **Arrow Keys**: Navigate dropdown options

## Troubleshooting

### "No available rooms" Message

**Problem**: The room dropdown shows "No available rooms"

**Solutions**:
1. Check if all rooms are occupied (status: "Occupied")
2. Go to Rooms page and mark completed stays as "Available"
3. Add new rooms if property is at capacity

### Tenant Details Not Auto-Filling

**Problem**: Selecting a tenant name doesn't fill email/phone

**Solutions**:
1. Ensure the tenant exists in the Tenants page
2. Type the exact name as stored in the system
3. Check that the tenant belongs to the selected PG property

### Date Validation Error

**Problem**: "End date must be after or equal to start date"

**Solutions**:
1. Ensure end date is same day or later than start date
2. Check for correct year selection
3. Use date picker to avoid manual entry errors

### Form Not Submitting

**Problem**: Clicking "Create Booking" does nothing

**Solutions**:
1. Check for validation error messages in red
2. Ensure all required fields (marked with *) are filled
3. Verify that a PG property is selected
4. Check browser console for errors

## Data Model

### Booking Object Structure

```typescript
{
  id: number,                    // Auto-generated
  pgId: string,                  // Selected PG property
  room: string,                  // Room number
  tenant: string,                // Tenant name
  email?: string,                // Optional email
  phone?: string,                // Optional phone
  startDate: string,             // YYYY-MM-DD format
  endDate: string,               // YYYY-MM-DD format
  status: BookingStatus,         // Pending|Upcoming|Active|Completed|Cancelled
  monthlyRent: number,           // Monthly rent amount
  securityDeposit: number,       // Security deposit
  advance?: number,              // Optional advance payment
  emergencyContact?: {           // Optional emergency contact
    name: string,
    phone: string,
    relation: string
  },
  documents?: {                  // Optional documents
    idProof?: string,            // URL to ID proof
    photoUrl?: string,           // URL to photo
    agreementUrl?: string        // URL to agreement
  },
  notes?: string,                // Optional notes
  payments: Payment[],           // Associated payments
  createdAt: string,             // Auto-generated ISO timestamp
  updatedAt: string              // Auto-updated ISO timestamp
}
```

## Component API

### BookingFormDialog Props

```typescript
interface BookingFormDialogProps {
  open: boolean;                 // Controls dialog visibility
  onOpenChange: (open: boolean) => void;  // Callback when dialog opens/closes
  booking?: Booking;             // Existing booking to edit (optional)
  onSave: (booking: Partial<Booking>) => void;  // Callback when form is submitted
}
```

### QuickBookingCard Props

```typescript
interface QuickBookingCardProps {
  onBookingCreated?: (booking: Partial<Booking>) => void;  // Callback when booking is created
}
```

## Future Enhancements

Planned improvements for booking forms:

1. **File Upload**: Direct file upload instead of URLs
2. **Bulk Booking**: Create multiple bookings at once
3. **Booking Templates**: Save and reuse common booking configurations
4. **SMS/Email Notifications**: Auto-send booking confirmations
5. **Calendar View**: Visual calendar for booking management
6. **Rent Calculator**: Calculate total rent based on duration
7. **Auto Status Updates**: Automatically update status based on dates
8. **Export**: Export booking data to CSV/PDF

## Support

For issues, questions, or feature requests:
- Check this guide first
- Review the inline help text in forms
- Check browser console for technical errors
- Contact your system administrator

---

**Version**: 1.0.0
**Last Updated**: 2025-11-18
**Component Files**:
- `src/components/BookingFormDialog.tsx`
- `src/components/QuickBookingCard.tsx`
- `src/pages/Bookings.tsx`
- `src/context/PGContext.tsx`
