// PG (Paying Guest) Property Types

export interface PG {
  id: string;
  name: string;
  address: string;
  city: string;
  totalRooms: number;
  occupiedRooms: number;
  monthlyRevenue: number;
}

export interface Room {
  id: number;
  pgId: string;  // Added to link room to specific PG
  number: string;
  type: "Single" | "Double" | "Triple";
  rent: number;
  deposit: number;
  status: "Occupied" | "Available" | "Maintenance";
  floor: number;
}

export interface Tenant {
  id: number;
  pgId: string;  // Added to link tenant to specific PG
  name: string;
  room: string;
  phone: string;
  email: string;
  status: "Active" | "Notice Period" | "Inactive";
  joinDate: string;
}

// Re-export Booking types from booking.ts to avoid duplication
export type { Booking, BookingStatus, BookingFilters } from "./booking";

export type PaymentMethod = "Cash" | "UPI" | "Bank Transfer" | "Card" | "Cheque" | "Online";
export type PaymentStatus = "Paid" | "Pending" | "Overdue" | "Partial";
export type PaymentType = "Rent" | "Security Deposit" | "Advance" | "Maintenance" | "Electricity" | "Water" | "Other";

export interface Payment {
  id: number;
  pgId: string;  // Added to link payment to specific PG
  tenant: string;
  tenantId?: number;
  room: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  paidDate: string | null;
  paymentMethod?: PaymentMethod;
  paymentType: PaymentType;
  receiptNumber?: string;
  transactionId?: string;
  notes?: string;
  late_fee?: number;
  discount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PGOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  pgs: PG[];
}

export interface NotificationPreferences {
  id: string;
  pgId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  daysBefore: number;
  sendOverdueReminders: boolean;
  reminderTime?: string; // HH:mm format, e.g., "09:00"
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationLog {
  id: number;
  paymentId: number;
  tenantId: number;
  type: "email" | "sms";
  status: "sent" | "failed" | "pending";
  sentAt?: string;
  error?: string;
}
