import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Eye, Edit, DollarSign, TrendingUp, Users, FileText } from "lucide-react";
import { Booking } from "@/types/booking";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { BookingDetailsDialog } from "@/components/BookingDetailsDialog";
import { BookingFilters } from "@/components/BookingFilters";
import { AddPaymentDialog } from "@/components/AddPaymentDialog";

const Bookings = () => {
  // Sample data with enhanced details
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      room: "101",
      tenant: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+91 98765 43210",
      startDate: "2024-01-15",
      endDate: "2024-07-15",
      status: "Active",
      monthlyRent: 5000,
      securityDeposit: 10000,
      advance: 5000,
      payments: [
        {
          id: "p1",
          amount: 5000,
          date: "2024-01-15",
          method: "UPI",
          status: "Paid",
          receiptNumber: "RCP001",
        },
        {
          id: "p2",
          amount: 5000,
          date: "2024-02-15",
          method: "Cash",
          status: "Paid",
        },
        {
          id: "p3",
          amount: 5000,
          date: "2024-03-15",
          method: "UPI",
          status: "Paid",
        },
      ],
      emergencyContact: {
        name: "Suresh Kumar",
        phone: "+91 98765 00000",
        relation: "Father",
      },
      checkInDate: "2024-01-15",
      notes: "Prefers ground floor. Vegetarian.",
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-03-15T14:30:00Z",
    },
    {
      id: 2,
      room: "205",
      tenant: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 98765 43211",
      startDate: "2024-01-10",
      endDate: "2024-06-10",
      status: "Active",
      monthlyRent: 6000,
      securityDeposit: 12000,
      payments: [
        {
          id: "p4",
          amount: 6000,
          date: "2024-01-10",
          method: "Bank Transfer",
          status: "Paid",
          receiptNumber: "RCP002",
        },
        {
          id: "p5",
          amount: 6000,
          date: "2024-02-10",
          method: "UPI",
          status: "Paid",
        },
        {
          id: "p6",
          amount: 3000,
          date: "2024-03-10",
          method: "Cash",
          status: "Partial",
          notes: "Partial payment, remaining 3000 pending",
        },
      ],
      emergencyContact: {
        name: "Ramesh Sharma",
        phone: "+91 98765 11111",
        relation: "Father",
      },
      checkInDate: "2024-01-10",
      notes: "Working professional. Quiet tenant.",
      createdAt: "2024-01-05T09:00:00Z",
      updatedAt: "2024-03-10T16:00:00Z",
    },
    {
      id: 3,
      room: "302",
      tenant: "Amit Patel",
      email: "amit.patel@example.com",
      phone: "+91 98765 43212",
      startDate: "2024-04-01",
      endDate: "2024-10-01",
      status: "Upcoming",
      monthlyRent: 5500,
      securityDeposit: 11000,
      advance: 5500,
      payments: [
        {
          id: "p7",
          amount: 5500,
          date: "2024-03-20",
          method: "UPI",
          status: "Paid",
          receiptNumber: "RCP003",
          notes: "Advance payment",
        },
      ],
      emergencyContact: {
        name: "Kiran Patel",
        phone: "+91 98765 22222",
        relation: "Mother",
      },
      notes: "Student. Move-in scheduled for April 1st.",
      createdAt: "2024-03-15T11:00:00Z",
      updatedAt: "2024-03-20T10:00:00Z",
    },
  ]);

  // Dialog states
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>(undefined);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        booking.room.toLowerCase().includes(searchLower) ||
        booking.tenant.toLowerCase().includes(searchLower) ||
        booking.email?.toLowerCase().includes(searchLower) ||
        booking.phone?.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

      // Payment status filter
      let matchesPaymentStatus = true;
      if (paymentStatusFilter !== "all") {
        const hasPaymentStatus = booking.payments.some(
          (p) => p.status === paymentStatusFilter
        );
        matchesPaymentStatus = hasPaymentStatus;
      }

      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });
  }, [bookings, searchTerm, statusFilter, paymentStatusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status === "Active").length;
    const totalRevenue = bookings.reduce((sum, booking) => {
      const paid = booking.payments
        .filter((p) => p.status === "Paid")
        .reduce((s, p) => s + p.amount, 0);
      return sum + paid;
    }, 0);
    const pendingPayments = bookings.filter((b) =>
      b.payments.some((p) => p.status === "Pending" || p.status === "Overdue")
    ).length;

    return { active, totalRevenue, pendingPayments };
  }, [bookings]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: "bg-success/10 text-success",
      Upcoming: "bg-primary/10 text-primary",
      Completed: "bg-muted text-muted-foreground",
      Cancelled: "bg-destructive/10 text-destructive",
      Pending: "bg-yellow-500/10 text-yellow-600",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getPaymentStatusBadge = (booking: Booking) => {
    const hasOverdue = booking.payments.some((p) => p.status === "Overdue");
    const hasPending = booking.payments.some((p) => p.status === "Pending");
    const hasPartial = booking.payments.some((p) => p.status === "Partial");

    if (hasOverdue) {
      return (
        <Badge variant="outline" className="bg-destructive/10 text-destructive">
          Overdue
        </Badge>
      );
    }
    if (hasPartial) {
      return (
        <Badge variant="outline" className="bg-orange-500/10 text-orange-600">
          Partial
        </Badge>
      );
    }
    if (hasPending) {
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">
          Payment Pending
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-success/10 text-success">
        Paid
      </Badge>
    );
  };

  const handleSaveBooking = (bookingData: Partial<Booking>) => {
    if (editingBooking) {
      // Update existing booking
      setBookings((prev) =>
        prev.map((b) => (b.id === editingBooking.id ? { ...b, ...bookingData } : b))
      );
    } else {
      // Create new booking
      const newBooking: Booking = {
        id: Math.max(...bookings.map((b) => b.id)) + 1,
        ...bookingData,
        payments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Booking;
      setBookings((prev) => [...prev, newBooking]);
    }
    setEditingBooking(undefined);
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsDialogOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setIsFormDialogOpen(true);
  };

  const handleAddPayment = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsPaymentDialogOpen(true);
  };

  const handleSavePayment = (payment: Omit<any, "id">) => {
    if (!selectedBooking) return;

    const newPayment = {
      ...payment,
      id: `p${Date.now()}`,
    };

    setBookings((prev) =>
      prev.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              payments: [...b.payments, newPayment],
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentStatusFilter("all");
  };

  const handleEditFromDetails = () => {
    if (selectedBooking) {
      setIsDetailsDialogOpen(false);
      setEditingBooking(selectedBooking);
      setIsFormDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground">Manage current and future bookings</p>
        </div>
        <Button onClick={() => setIsFormDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {bookings.length} total bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <BookingFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        paymentStatusFilter={paymentStatusFilter}
        onPaymentStatusFilterChange={setPaymentStatusFilter}
        onClearFilters={handleClearFilters}
      />

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            All Bookings ({filteredBookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No bookings found matching your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">Room {booking.room}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      {getPaymentStatusBadge(booking)}
                    </div>
                    <p className="text-sm font-medium">{booking.tenant}</p>
                    <div className="flex gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {booking.startDate} to {booking.endDate}
                      </p>
                      {booking.phone && (
                        <p className="text-xs text-muted-foreground">
                          {booking.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4 mt-1">
                      <p className="text-xs text-muted-foreground">
                        Rent: ₹{booking.monthlyRent.toLocaleString()}/month
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Payments: {booking.payments.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(booking)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditBooking(booking)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddPayment(booking)}
                    >
                      <DollarSign className="h-4 w-4 mr-1" />
                      Payment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <BookingFormDialog
        open={isFormDialogOpen}
        onOpenChange={(open) => {
          setIsFormDialogOpen(open);
          if (!open) setEditingBooking(undefined);
        }}
        booking={editingBooking}
        onSave={handleSaveBooking}
      />

      <BookingDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        booking={selectedBooking}
        onEdit={handleEditFromDetails}
      />

      {selectedBooking && (
        <AddPaymentDialog
          open={isPaymentDialogOpen}
          onOpenChange={setIsPaymentDialogOpen}
          onSave={handleSavePayment}
          bookingDetails={{
            tenant: selectedBooking.tenant,
            room: selectedBooking.room,
            monthlyRent: selectedBooking.monthlyRent,
          }}
        />
      )}
    </div>
  );
};

export default Bookings;
