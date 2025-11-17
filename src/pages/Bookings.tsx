import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";
import { usePGContext } from "@/context/PGContext";

const Bookings = () => {
  const { selectedPG, bookings: allBookings } = usePGContext();

  // Filter bookings for selected PG
  const bookings = useMemo(() =>
    allBookings.filter(booking => booking.pgId === selectedPG?.id),
    [allBookings, selectedPG]
  );

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
          <p className="text-muted-foreground">
            {selectedPG ? `${selectedPG.name} - ${bookings.length} bookings` : 'Select a property to view bookings'}
          </p>
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
