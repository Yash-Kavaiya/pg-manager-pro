export type BookingStatus = "Active" | "Upcoming" | "Completed" | "Cancelled" | "Pending";

export type PaymentStatus = "Paid" | "Pending" | "Overdue" | "Partial";

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: "Cash" | "UPI" | "Bank Transfer" | "Card";
  status: PaymentStatus;
  receiptNumber?: string;
  notes?: string;
}

export interface Booking {
  id: number;
  room: string;
  tenant: string;
  email?: string;
  phone?: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  monthlyRent: number;
  securityDeposit: number;
  advance?: number;
  payments: Payment[];
  documents?: {
    idProof?: string;
    photoUrl?: string;
    agreementUrl?: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relation: string;
  };
  checkInDate?: string;
  checkOutDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFilters {
  status?: BookingStatus[];
  room?: string;
  tenant?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  paymentStatus?: PaymentStatus[];
}
