import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PG, Room, Tenant, Booking, Payment } from '../types';
import { mockPGs, mockRooms, mockTenants, mockBookings, mockPayments } from '../data/mockData';

interface PGContextType {
  selectedPG: PG | null;
  setSelectedPG: (pg: PG) => void;
  pgs: PG[];
  setPGs: (pgs: PG[]) => void;
  // Data for the selected PG
  rooms: Room[];
  setRooms: (rooms: Room[]) => void;
  tenants: Tenant[];
  setTenants: (tenants: Tenant[]) => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  // Payment CRUD operations
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePayment: (id: number, payment: Partial<Payment>) => void;
  deletePayment: (id: number) => void;
}

const PGContext = createContext<PGContextType | undefined>(undefined);

export const usePGContext = () => {
  const context = useContext(PGContext);
  if (!context) {
    throw new Error('usePGContext must be used within a PGProvider');
  }
  return context;
};

interface PGProviderProps {
  children: ReactNode;
}

export const PGProvider: React.FC<PGProviderProps> = ({ children }) => {
  const [selectedPG, setSelectedPGState] = useState<PG | null>(null);
  const [pgs, setPGs] = useState<PG[]>(mockPGs);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [tenants, setTenants] = useState<Tenant[]>(mockTenants);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);

  // Initialize with the first PG on mount
  useEffect(() => {
    if (mockPGs.length > 0 && !selectedPG) {
      const savedPGId = localStorage.getItem('selectedPGId');
      const pgToSelect = savedPGId
        ? mockPGs.find(pg => pg.id === savedPGId) || mockPGs[0]
        : mockPGs[0];
      setSelectedPGState(pgToSelect);
    }
  }, []);

  const setSelectedPG = (pg: PG) => {
    setSelectedPGState(pg);
    // Store the selected PG ID in localStorage for persistence
    localStorage.setItem('selectedPGId', pg.id);
  };

  // Payment CRUD operations
  const addPayment = (payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPayment: Payment = {
      ...payment,
      id: Math.max(...payments.map(p => p.id), 0) + 1,
      createdAt: now,
      updatedAt: now,
    };
    setPayments([...payments, newPayment]);
  };

  const updatePayment = (id: number, updatedPayment: Partial<Payment>) => {
    setPayments(payments.map(payment =>
      payment.id === id
        ? { ...payment, ...updatedPayment, updatedAt: new Date().toISOString() }
        : payment
    ));
  };

  const deletePayment = (id: number) => {
    setPayments(payments.filter(payment => payment.id !== id));
  };

  const value: PGContextType = {
    selectedPG,
    setSelectedPG,
    pgs,
    setPGs,
    rooms,
    setRooms,
    tenants,
    setTenants,
    bookings,
    setBookings,
    payments,
    setPayments,
    addPayment,
    updatePayment,
    deletePayment,
  };

  return <PGContext.Provider value={value}>{children}</PGContext.Provider>;
};
