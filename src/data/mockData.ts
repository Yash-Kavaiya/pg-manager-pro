import { PG, Room, Tenant, Booking, Payment } from '../types';

// Mock PG Properties
export const mockPGs: PG[] = [
  {
    id: 'pg-1',
    name: 'Sunrise Heights PG',
    address: '123 MG Road',
    city: 'Bangalore',
    totalRooms: 12,
    occupiedRooms: 10,
    monthlyRevenue: 120000,
  },
  {
    id: 'pg-2',
    name: 'Green Valley Residency',
    address: '456 Indiranagar',
    city: 'Bangalore',
    totalRooms: 8,
    occupiedRooms: 6,
    monthlyRevenue: 72000,
  },
  {
    id: 'pg-3',
    name: 'Comfort Stay PG',
    address: '789 Koramangala',
    city: 'Bangalore',
    totalRooms: 15,
    occupiedRooms: 12,
    monthlyRevenue: 144000,
  },
];

// Mock Rooms Data
export const mockRooms: Room[] = [
  // Sunrise Heights PG rooms
  { id: 1, pgId: 'pg-1', number: '101', type: 'Single', rent: 10000, deposit: 10000, status: 'Occupied', floor: 1 },
  { id: 2, pgId: 'pg-1', number: '102', type: 'Double', rent: 8000, deposit: 8000, status: 'Occupied', floor: 1 },
  { id: 3, pgId: 'pg-1', number: '103', type: 'Single', rent: 10000, deposit: 10000, status: 'Available', floor: 1 },
  { id: 4, pgId: 'pg-1', number: '201', type: 'Double', rent: 8000, deposit: 8000, status: 'Occupied', floor: 2 },
  { id: 5, pgId: 'pg-1', number: '202', type: 'Single', rent: 10000, deposit: 10000, status: 'Maintenance', floor: 2 },
  { id: 6, pgId: 'pg-1', number: '203', type: 'Triple', rent: 7000, deposit: 7000, status: 'Occupied', floor: 2 },
  { id: 7, pgId: 'pg-1', number: '301', type: 'Single', rent: 11000, deposit: 11000, status: 'Occupied', floor: 3 },
  { id: 8, pgId: 'pg-1', number: '302', type: 'Double', rent: 9000, deposit: 9000, status: 'Occupied', floor: 3 },
  { id: 9, pgId: 'pg-1', number: '303', type: 'Single', rent: 11000, deposit: 11000, status: 'Occupied', floor: 3 },
  { id: 10, pgId: 'pg-1', number: '304', type: 'Double', rent: 9000, deposit: 9000, status: 'Occupied', floor: 3 },
  { id: 11, pgId: 'pg-1', number: '305', type: 'Single', rent: 11000, deposit: 11000, status: 'Occupied', floor: 3 },
  { id: 12, pgId: 'pg-1', number: '306', type: 'Triple', rent: 7500, deposit: 7500, status: 'Occupied', floor: 3 },

  // Green Valley Residency rooms
  { id: 13, pgId: 'pg-2', number: 'A1', type: 'Single', rent: 12000, deposit: 12000, status: 'Occupied', floor: 1 },
  { id: 14, pgId: 'pg-2', number: 'A2', type: 'Double', rent: 9000, deposit: 9000, status: 'Occupied', floor: 1 },
  { id: 15, pgId: 'pg-2', number: 'A3', type: 'Single', rent: 12000, deposit: 12000, status: 'Available', floor: 1 },
  { id: 16, pgId: 'pg-2', number: 'B1', type: 'Double', rent: 9000, deposit: 9000, status: 'Occupied', floor: 2 },
  { id: 17, pgId: 'pg-2', number: 'B2', type: 'Single', rent: 12000, deposit: 12000, status: 'Occupied', floor: 2 },
  { id: 18, pgId: 'pg-2', number: 'B3', type: 'Double', rent: 9000, deposit: 9000, status: 'Available', floor: 2 },
  { id: 19, pgId: 'pg-2', number: 'C1', type: 'Single', rent: 13000, deposit: 13000, status: 'Occupied', floor: 3 },
  { id: 20, pgId: 'pg-2', number: 'C2', type: 'Double', rent: 10000, deposit: 10000, status: 'Occupied', floor: 3 },

  // Comfort Stay PG rooms
  { id: 21, pgId: 'pg-3', number: '1A', type: 'Single', rent: 9500, deposit: 9500, status: 'Occupied', floor: 1 },
  { id: 22, pgId: 'pg-3', number: '1B', type: 'Double', rent: 7500, deposit: 7500, status: 'Occupied', floor: 1 },
  { id: 23, pgId: 'pg-3', number: '1C', type: 'Triple', rent: 6500, deposit: 6500, status: 'Occupied', floor: 1 },
  { id: 24, pgId: 'pg-3', number: '2A', type: 'Single', rent: 9500, deposit: 9500, status: 'Occupied', floor: 2 },
  { id: 25, pgId: 'pg-3', number: '2B', type: 'Double', rent: 7500, deposit: 7500, status: 'Available', floor: 2 },
  { id: 26, pgId: 'pg-3', number: '2C', type: 'Triple', rent: 6500, deposit: 6500, status: 'Occupied', floor: 2 },
  { id: 27, pgId: 'pg-3', number: '3A', type: 'Single', rent: 10000, deposit: 10000, status: 'Occupied', floor: 3 },
  { id: 28, pgId: 'pg-3', number: '3B', type: 'Double', rent: 8000, deposit: 8000, status: 'Occupied', floor: 3 },
  { id: 29, pgId: 'pg-3', number: '3C', type: 'Triple', rent: 7000, deposit: 7000, status: 'Occupied', floor: 3 },
  { id: 30, pgId: 'pg-3', number: '4A', type: 'Single', rent: 10000, deposit: 10000, status: 'Available', floor: 4 },
  { id: 31, pgId: 'pg-3', number: '4B', type: 'Double', rent: 8000, deposit: 8000, status: 'Occupied', floor: 4 },
  { id: 32, pgId: 'pg-3', number: '4C', type: 'Triple', rent: 7000, deposit: 7000, status: 'Occupied', floor: 4 },
  { id: 33, pgId: 'pg-3', number: '5A', type: 'Single', rent: 10500, deposit: 10500, status: 'Occupied', floor: 5 },
  { id: 34, pgId: 'pg-3', number: '5B', type: 'Double', rent: 8500, deposit: 8500, status: 'Occupied', floor: 5 },
  { id: 35, pgId: 'pg-3', number: '5C', type: 'Triple', rent: 7500, deposit: 7500, status: 'Available', floor: 5 },
];

// Mock Tenants Data
export const mockTenants: Tenant[] = [
  // Sunrise Heights PG tenants
  { id: 1, pgId: 'pg-1', name: 'Rahul Kumar', room: '101', phone: '+91 9876543210', email: 'rahul@example.com', status: 'Active', joinDate: '2024-01-15' },
  { id: 2, pgId: 'pg-1', name: 'Priya Sharma', room: '102', phone: '+91 9876543211', email: 'priya@example.com', status: 'Active', joinDate: '2024-02-01' },
  { id: 3, pgId: 'pg-1', name: 'Amit Patel', room: '201', phone: '+91 9876543212', email: 'amit@example.com', status: 'Active', joinDate: '2024-01-20' },
  { id: 4, pgId: 'pg-1', name: 'Sneha Reddy', room: '203', phone: '+91 9876543213', email: 'sneha@example.com', status: 'Notice Period', joinDate: '2023-11-10' },
  { id: 5, pgId: 'pg-1', name: 'Vikram Singh', room: '301', phone: '+91 9876543214', email: 'vikram@example.com', status: 'Active', joinDate: '2024-03-01' },
  { id: 6, pgId: 'pg-1', name: 'Anjali Gupta', room: '302', phone: '+91 9876543215', email: 'anjali@example.com', status: 'Active', joinDate: '2024-02-15' },
  { id: 7, pgId: 'pg-1', name: 'Karthik Iyer', room: '303', phone: '+91 9876543216', email: 'karthik@example.com', status: 'Active', joinDate: '2024-01-05' },
  { id: 8, pgId: 'pg-1', name: 'Deepa Nair', room: '304', phone: '+91 9876543217', email: 'deepa@example.com', status: 'Active', joinDate: '2024-02-20' },
  { id: 9, pgId: 'pg-1', name: 'Rohan Mehta', room: '305', phone: '+91 9876543218', email: 'rohan@example.com', status: 'Active', joinDate: '2024-01-25' },
  { id: 10, pgId: 'pg-1', name: 'Pooja Verma', room: '306', phone: '+91 9876543219', email: 'pooja@example.com', status: 'Active', joinDate: '2024-03-10' },

  // Green Valley Residency tenants
  { id: 11, pgId: 'pg-2', name: 'Arun Kumar', room: 'A1', phone: '+91 9876543220', email: 'arun@example.com', status: 'Active', joinDate: '2024-02-01' },
  { id: 12, pgId: 'pg-2', name: 'Divya Krishnan', room: 'A2', phone: '+91 9876543221', email: 'divya@example.com', status: 'Active', joinDate: '2024-01-15' },
  { id: 13, pgId: 'pg-2', name: 'Suresh Babu', room: 'B1', phone: '+91 9876543222', email: 'suresh@example.com', status: 'Active', joinDate: '2024-02-10' },
  { id: 14, pgId: 'pg-2', name: 'Lakshmi Menon', room: 'B2', phone: '+91 9876543223', email: 'lakshmi@example.com', status: 'Active', joinDate: '2024-03-01' },
  { id: 15, pgId: 'pg-2', name: 'Naveen Reddy', room: 'C1', phone: '+91 9876543224', email: 'naveen@example.com', status: 'Active', joinDate: '2024-01-20' },
  { id: 16, pgId: 'pg-2', name: 'Meera Shetty', room: 'C2', phone: '+91 9876543225', email: 'meera@example.com', status: 'Active', joinDate: '2024-02-25' },

  // Comfort Stay PG tenants
  { id: 17, pgId: 'pg-3', name: 'Rajesh Kumar', room: '1A', phone: '+91 9876543226', email: 'rajesh@example.com', status: 'Active', joinDate: '2024-01-10' },
  { id: 18, pgId: 'pg-3', name: 'Kavya Rao', room: '1B', phone: '+91 9876543227', email: 'kavya@example.com', status: 'Active', joinDate: '2024-02-05' },
  { id: 19, pgId: 'pg-3', name: 'Manoj Pillai', room: '1C', phone: '+91 9876543228', email: 'manoj@example.com', status: 'Active', joinDate: '2024-01-18' },
  { id: 20, pgId: 'pg-3', name: 'Swathi Nambiar', room: '2A', phone: '+91 9876543229', email: 'swathi@example.com', status: 'Active', joinDate: '2024-03-05' },
  { id: 21, pgId: 'pg-3', name: 'Ganesh Iyer', room: '2C', phone: '+91 9876543230', email: 'ganesh@example.com', status: 'Active', joinDate: '2024-02-12' },
  { id: 22, pgId: 'pg-3', name: 'Anitha Varma', room: '3A', phone: '+91 9876543231', email: 'anitha@example.com', status: 'Active', joinDate: '2024-01-22' },
  { id: 23, pgId: 'pg-3', name: 'Prakash Hegde', room: '3B', phone: '+91 9876543232', email: 'prakash@example.com', status: 'Active', joinDate: '2024-02-18' },
  { id: 24, pgId: 'pg-3', name: 'Rani Desai', room: '3C', phone: '+91 9876543233', email: 'rani@example.com', status: 'Active', joinDate: '2024-03-08' },
  { id: 25, pgId: 'pg-3', name: 'Sanjay Nair', room: '4B', phone: '+91 9876543234', email: 'sanjay@example.com', status: 'Active', joinDate: '2024-01-28' },
  { id: 26, pgId: 'pg-3', name: 'Uma Shankar', room: '4C', phone: '+91 9876543235', email: 'uma@example.com', status: 'Active', joinDate: '2024-02-22' },
  { id: 27, pgId: 'pg-3', name: 'Vijay Kumar', room: '5A', phone: '+91 9876543236', email: 'vijay@example.com', status: 'Active', joinDate: '2024-03-12' },
  { id: 28, pgId: 'pg-3', name: 'Yamini Reddy', room: '5B', phone: '+91 9876543237', email: 'yamini@example.com', status: 'Notice Period', joinDate: '2023-12-05' },
];

// Mock Bookings Data
export const mockBookings: Booking[] = [
  // Sunrise Heights PG bookings
  { id: 1, pgId: 'pg-1', room: '101', tenant: 'Rahul Kumar', startDate: '2024-01-15', endDate: '2025-01-14', status: 'Active' },
  { id: 2, pgId: 'pg-1', room: '102', tenant: 'Priya Sharma', startDate: '2024-02-01', endDate: '2025-01-31', status: 'Active' },
  { id: 3, pgId: 'pg-1', room: '201', tenant: 'Amit Patel', startDate: '2024-01-20', endDate: '2025-01-19', status: 'Active' },
  { id: 4, pgId: 'pg-1', room: '203', tenant: 'Sneha Reddy', startDate: '2023-11-10', endDate: '2024-11-09', status: 'Active' },
  { id: 5, pgId: 'pg-1', room: '301', tenant: 'Vikram Singh', startDate: '2024-03-01', endDate: '2025-02-28', status: 'Active' },
  { id: 6, pgId: 'pg-1', room: '103', tenant: 'New Tenant', startDate: '2024-04-01', endDate: '2025-03-31', status: 'Upcoming' },

  // Green Valley Residency bookings
  { id: 7, pgId: 'pg-2', room: 'A1', tenant: 'Arun Kumar', startDate: '2024-02-01', endDate: '2025-01-31', status: 'Active' },
  { id: 8, pgId: 'pg-2', room: 'A2', tenant: 'Divya Krishnan', startDate: '2024-01-15', endDate: '2025-01-14', status: 'Active' },
  { id: 9, pgId: 'pg-2', room: 'B1', tenant: 'Suresh Babu', startDate: '2024-02-10', endDate: '2025-02-09', status: 'Active' },
  { id: 10, pgId: 'pg-2', room: 'B2', tenant: 'Lakshmi Menon', startDate: '2024-03-01', endDate: '2025-02-28', status: 'Active' },

  // Comfort Stay PG bookings
  { id: 11, pgId: 'pg-3', room: '1A', tenant: 'Rajesh Kumar', startDate: '2024-01-10', endDate: '2025-01-09', status: 'Active' },
  { id: 12, pgId: 'pg-3', room: '1B', tenant: 'Kavya Rao', startDate: '2024-02-05', endDate: '2025-02-04', status: 'Active' },
  { id: 13, pgId: 'pg-3', room: '2A', tenant: 'Swathi Nambiar', startDate: '2024-03-05', endDate: '2025-03-04', status: 'Active' },
  { id: 14, pgId: 'pg-3', room: '3A', tenant: 'Anitha Varma', startDate: '2024-01-22', endDate: '2025-01-21', status: 'Active' },
  { id: 15, pgId: 'pg-3', room: '4A', tenant: 'Potential Tenant', startDate: '2024-04-15', endDate: '2025-04-14', status: 'Upcoming' },
];

// Mock Payments Data
export const mockPayments: Payment[] = [
  // Sunrise Heights PG payments
  { id: 1, pgId: 'pg-1', tenant: 'Rahul Kumar', room: '101', amount: 10000, dueDate: '2024-03-01', status: 'Paid', paidDate: '2024-02-28' },
  { id: 2, pgId: 'pg-1', tenant: 'Priya Sharma', room: '102', amount: 8000, dueDate: '2024-03-01', status: 'Pending', paidDate: null },
  { id: 3, pgId: 'pg-1', tenant: 'Amit Patel', room: '201', amount: 8000, dueDate: '2024-03-01', status: 'Paid', paidDate: '2024-03-01' },
  { id: 4, pgId: 'pg-1', tenant: 'Sneha Reddy', room: '203', amount: 7000, dueDate: '2024-02-20', status: 'Overdue', paidDate: null },
  { id: 5, pgId: 'pg-1', tenant: 'Vikram Singh', room: '301', amount: 11000, dueDate: '2024-03-01', status: 'Paid', paidDate: '2024-02-29' },
  { id: 6, pgId: 'pg-1', tenant: 'Anjali Gupta', room: '302', amount: 9000, dueDate: '2024-03-01', status: 'Pending', paidDate: null },

  // Green Valley Residency payments
  { id: 7, pgId: 'pg-2', tenant: 'Arun Kumar', room: 'A1', amount: 12000, dueDate: '2024-03-01', status: 'Paid', paidDate: '2024-02-28' },
  { id: 8, pgId: 'pg-2', tenant: 'Divya Krishnan', room: 'A2', amount: 9000, dueDate: '2024-03-01', status: 'Paid', paidDate: '2024-02-29' },
  { id: 9, pgId: 'pg-2', tenant: 'Suresh Babu', room: 'B1', amount: 9000, dueDate: '2024-03-01', status: 'Pending', paidDate: null },
  { id: 10, pgId: 'pg-2', tenant: 'Lakshmi Menon', room: 'B2', amount: 12000, dueDate: '2024-03-01', status: 'Pending', paidDate: null },

  // Comfort Stay PG payments
  { id: 11, pgId: 'pg-3', tenant: 'Rajesh Kumar', room: '1A', amount: 9500, dueDate: '2024-03-01', status: 'Paid', paidDate: '2024-02-27' },
  { id: 12, pgId: 'pg-3', tenant: 'Kavya Rao', room: '1B', amount: 7500, dueDate: '2024-03-01', status: 'Paid', paidDate: '2024-02-28' },
  { id: 13, pgId: 'pg-3', tenant: 'Swathi Nambiar', room: '2A', amount: 9500, dueDate: '2024-03-01', status: 'Pending', paidDate: null },
  { id: 14, pgId: 'pg-3', tenant: 'Anitha Varma', room: '3A', amount: 10000, dueDate: '2024-03-01', status: 'Paid', paidDate: '2024-03-01' },
  { id: 15, pgId: 'pg-3', tenant: 'Prakash Hegde', room: '3B', amount: 8000, dueDate: '2024-03-01', status: 'Pending', paidDate: null },
];
