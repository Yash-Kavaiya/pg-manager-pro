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

export interface Booking {
  id: number;
  pgId: string;  // Added to link booking to specific PG
  room: string;
  tenant: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Upcoming" | "Completed";
}

export interface Payment {
  id: number;
  pgId: string;  // Added to link payment to specific PG
  tenant: string;
  room: string;
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  paidDate: string | null;
}

export interface PGOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  pgs: PG[];
}
