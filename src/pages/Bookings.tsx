import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Users, TrendingUp, Plus, MoreVertical, Eye, Pencil, Trash2, DollarSign, IndianRupee, CalendarDays, TableIcon } from "lucide-react";
import { usePGContext } from "@/context/PGContext";
import { BookingFormDialog } from "@/components/BookingFormDialog";
import { BookingDetailsDialog } from "@/components/BookingDetailsDialog";
import { BookingFilters } from "@/components/BookingFilters";
import { AddPaymentDialog } from "@/components/AddPaymentDialog";
import BookingCalendar from "@/components/BookingCalendar";
import { Booking, BookingStatus, Payment } from "@/types/booking";

const Bookings = () => {
  const { selectedPG, bookings: allBookings, setBookings } = usePGContext();

  // View mode state
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  // Filter bookings for selected PG and apply filters
  const bookings = useMemo(() => {
    let filtered = allBookings.filter(booking => booking.pgId === selectedPG?.id);

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(booking =>
        booking.tenant.toLowerCase().includes(term) ||
        booking.room.toLowerCase().includes(term) ||
        booking.email?.toLowerCase().includes(term) ||
        booking.phone?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Apply payment status filter
    if (paymentStatusFilter !== "all") {
      filtered = filtered.filter(booking => {
        if (booking.payments.length === 0) {
          return paymentStatusFilter === "Pending";
        }
        const hasStatus = booking.payments.some(p => p.status === paymentStatusFilter);
        return hasStatus;
      });
    }

    return filtered;
  }, [allBookings, selectedPG, searchTerm, statusFilter, paymentStatusFilter]);

  // Calculate stats
  const stats = {
    total: bookings.length,
    active: bookings.filter((b) => b.status === "Active").length,
    upcoming: bookings.filter((b) => b.status === "Upcoming").length,
    pending: bookings.filter((b) => b.status === "Pending").length,
  };

  const getStatusColor = (status: BookingStatus) => {
    const colors: Record<BookingStatus, string> = {
      Active: "bg-success/10 text-success border-success/20",
      Upcoming: "bg-primary/10 text-primary border-primary/20",
      Completed: "bg-muted text-muted-foreground border-muted",
      Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
      Pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Paid: "bg-success/10 text-success",
      Pending: "bg-yellow-500/10 text-yellow-600",
      Overdue: "bg-destructive/10 text-destructive",
      Partial: "bg-orange-500/10 text-orange-600",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const handleAddBooking = (bookingData: Partial<Booking>) => {
    if (!selectedPG) return;

    const newBooking: Booking = {
      id: Math.max(...allBookings.map(b => b.id), 0) + 1,
      pgId: selectedPG.id,
      ...bookingData,
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Booking;

    setBookings([...allBookings, newBooking]);
  };

  const handleEditBooking = (bookingData: Partial<Booking>) => {
    if (!selectedBooking) return;

    const updatedBookings = allBookings.map(booking =>
      booking.id === selectedBooking.id
        ? { ...booking, ...bookingData, updatedAt: new Date().toISOString() }
        : booking
    );

    setBookings(updatedBookings);
    setSelectedBooking(null);
  };

  const handleDeleteBooking = () => {
    if (!selectedBooking) return;

    const updatedBookings = allBookings.filter(booking => booking.id !== selectedBooking.id);
    setBookings(updatedBookings);
    setIsDeleteDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleCancelBooking = (booking: Booking) => {
    const updatedBookings = allBookings.map(b =>
      b.id === booking.id
        ? { ...b, status: "Cancelled" as BookingStatus, updatedAt: new Date().toISOString() }
        : b
    );
    setBookings(updatedBookings);
  };

  const handleAddPayment = (payment: Omit<Payment, "id">) => {
    if (!selectedBooking) return;

    const newPayment: Payment = {
      ...payment,
      id: `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedBookings = allBookings.map(booking =>
      booking.id === selectedBooking.id
        ? {
            ...booking,
            payments: [...booking.payments, newPayment],
            updatedAt: new Date().toISOString(),
          }
        : booking
    );

    setBookings(updatedBookings);
    setSelectedBooking(null);
  };

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteDialogOpen(true);
  };

  const openPaymentDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsPaymentDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentStatusFilter("all");
  };

  const getTotalPaid = (booking: Booking) => {
    return booking.payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getBookingDuration = (booking: Booking) => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const months = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground">
            {selectedPG ? `${selectedPG.name} - Manage your bookings` : 'Select a property to view bookings'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              <TableIcon className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button
              variant={viewMode === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="rounded-l-none"
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
          <Button onClick={openAddDialog} disabled={!selectedPG}>
            <Plus className="h-4 w-4 mr-2" />
            Add Booking
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All bookings for this property
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Bookings
            </CardTitle>
            <Users className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently occupied rooms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Bookings
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Future check-ins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Bookings
            </CardTitle>
            <Calendar className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters - Only show in table view */}
      {viewMode === "table" && (
        <BookingFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          paymentStatusFilter={paymentStatusFilter}
          onPaymentStatusFilterChange={setPaymentStatusFilter}
          onClearFilters={clearFilters}
        />
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && selectedPG && (
        <BookingCalendar
          bookings={bookings}
          onCreateBooking={(date) => {
            // Pre-fill the date in the booking form
            setIsAddDialogOpen(true);
            // Store the selected date for pre-filling (we'll handle this in the form)
          }}
          onBookingClick={(booking) => {
            openViewDialog(booking);
          }}
        />
      )}

      {/* Bookings Table - Only show in table view */}
      {viewMode === "table" && (
        <Card>
          <CardHeader>
            <CardTitle>All Bookings ({bookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
          {bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Monthly Rent</TableHead>
                    <TableHead>Total Paid</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    const totalPaid = getTotalPaid(booking);
                    const duration = getBookingDuration(booking);
                    const expectedTotal = booking.monthlyRent * duration;
                    const paymentStatus = totalPaid >= expectedTotal ? "Paid" : totalPaid > 0 ? "Partial" : "Pending";

                    return (
                      <TableRow key={booking.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium">{booking.tenant}</div>
                          {booking.email && (
                            <div className="text-xs text-muted-foreground">{booking.email}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">Room {booking.room}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {booking.startDate}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            to {booking.endDate}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ({duration} {duration === 1 ? 'month' : 'months'})
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)} variant="outline">
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IndianRupee className="h-3 w-3 mr-1" />
                            {booking.monthlyRent.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <IndianRupee className="h-3 w-3 mr-1" />
                              <span className="font-medium">{totalPaid.toLocaleString()}</span>
                            </div>
                            <Badge className={getPaymentStatusColor(paymentStatus)} variant="outline" size="sm">
                              {paymentStatus}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {booking.phone && (
                            <div className="text-sm">{booking.phone}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openViewDialog(booking)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(booking)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Booking
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openPaymentDialog(booking)}>
                                <DollarSign className="h-4 w-4 mr-2" />
                                Add Payment
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {booking.status !== "Cancelled" && booking.status !== "Completed" && (
                                <DropdownMenuItem
                                  onClick={() => handleCancelBooking(booking)}
                                  className="text-orange-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Cancel Booking
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(booking)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {selectedPG
                  ? searchTerm || statusFilter !== "all" || paymentStatusFilter !== "all"
                    ? "No bookings match your filters. Try adjusting your search criteria."
                    : "No bookings found. Add your first booking to get started."
                  : "Please select a PG property to view bookings."}
              </p>
              {selectedPG && bookings.length === 0 && !searchTerm && statusFilter === "all" && paymentStatusFilter === "all" && (
                <Button onClick={openAddDialog} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Booking
                </Button>
              )}
            </div>
          )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Booking Dialog */}
      <BookingFormDialog
        open={isAddDialogOpen || isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            setSelectedBooking(null);
          }
        }}
        booking={isEditDialogOpen ? selectedBooking || undefined : undefined}
        onSave={isAddDialogOpen ? handleAddBooking : handleEditBooking}
      />

      {/* View Booking Details Dialog */}
      <BookingDetailsDialog
        open={isViewDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsViewDialogOpen(false);
            setSelectedBooking(null);
          }
        }}
        booking={selectedBooking}
        onEdit={() => {
          if (selectedBooking) {
            setIsViewDialogOpen(false);
            openEditDialog(selectedBooking);
          }
        }}
      />

      {/* Add Payment Dialog */}
      {selectedBooking && (
        <AddPaymentDialog
          open={isPaymentDialogOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsPaymentDialogOpen(false);
              setSelectedBooking(null);
            }
          }}
          onSave={handleAddPayment}
          bookingDetails={{
            tenant: selectedBooking.tenant,
            room: selectedBooking.room,
            monthlyRent: selectedBooking.monthlyRent,
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the booking for {selectedBooking?.tenant} in Room {selectedBooking?.room}.
              This action cannot be undone and will remove all associated payment records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedBooking(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBooking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Bookings;
