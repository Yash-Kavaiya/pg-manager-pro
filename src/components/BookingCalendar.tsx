import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePGContext } from '@/context/PGContext';
import { Booking } from '@/types/booking';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { BookingDetailsDialog } from './BookingDetailsDialog';
import { BookingFormDialog } from './BookingFormDialog';

interface DayBooking {
  date: Date;
  bookings: Booking[];
  available: boolean;
}

export function BookingCalendar() {
  const { bookings, selectedPG } = usePGContext();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newBookingDate, setNewBookingDate] = useState<Date | null>(null);

  // Filter bookings for selected PG
  const filteredBookings = selectedPG
    ? bookings.filter(b => b.pgId === selectedPG.id)
    : bookings;

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date): Booking[] => {
    return filteredBookings.filter(booking => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };

  // Get all days in current month with booking info
  const getDaysInMonth = (): DayBooking[] => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    return days.map(date => ({
      date,
      bookings: getBookingsForDate(date),
      available: getBookingsForDate(date).length === 0
    }));
  };

  // Get bookings for selected date
  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  // Calculate statistics for current month
  const monthDays = getDaysInMonth();
  const occupiedDays = monthDays.filter(d => !d.available).length;
  const availableDays = monthDays.filter(d => d.available).length;

  // Get booking count for a date
  const getBookingCount = (date: Date): number => {
    return getBookingsForDate(date).length;
  };

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleNewBooking = () => {
    setNewBookingDate(selectedDate || new Date());
    setIsFormOpen(true);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar Section */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Booking Calendar
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="min-w-[140px] text-center font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                  </div>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Month Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{monthDays.length}</div>
                  <p className="text-xs text-muted-foreground">Total Days</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{occupiedDays}</div>
                  <p className="text-xs text-muted-foreground">Occupied Days</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{availableDays}</div>
                  <p className="text-xs text-muted-foreground">Available Days</p>
                </CardContent>
              </Card>
            </div>

            {/* Calendar */}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md border w-full"
              modifiers={{
                booked: (date) => {
                  const bookings = getBookingsForDate(date);
                  return bookings.some(b => b.status === 'Active' || b.status === 'Upcoming');
                },
                available: (date) => getBookingsForDate(date).length === 0,
              }}
              modifiersClassNames={{
                booked: 'bg-green-100 dark:bg-green-950 font-semibold border-green-300 dark:border-green-700',
                available: 'hover:bg-blue-50 dark:hover:bg-blue-950',
              }}
            />

            {/* Booking Summary Below Calendar */}
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-3">Monthly Overview</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Active Bookings:</span>
                  <span className="ml-2 font-semibold">
                    {filteredBookings.filter(b => b.status === 'Active').length}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Upcoming:</span>
                  <span className="ml-2 font-semibold">
                    {filteredBookings.filter(b => b.status === 'Upcoming').length}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Occupancy Rate:</span>
                  <span className="ml-2 font-semibold">
                    {monthDays.length > 0 ? Math.round((occupiedDays / monthDays.length) * 100) : 0}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Bookings:</span>
                  <span className="ml-2 font-semibold">{filteredBookings.length}</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Active Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Upcoming Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span>Other Status</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Details Section */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </CardTitle>
            {selectedDate && (
              <Button
                onClick={handleNewBooking}
                size="sm"
                className="w-full mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {selectedDate && selectedDateBookings.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground">
                  {selectedDateBookings.length} Booking{selectedDateBookings.length > 1 ? 's' : ''}
                </p>
                {selectedDateBookings.map((booking) => (
                  <Card
                    key={booking.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleBookingClick(booking)}
                  >
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold">{booking.tenant}</p>
                            <p className="text-sm text-muted-foreground">
                              Room {booking.room}
                            </p>
                          </div>
                          <Badge
                            variant={
                              booking.status === 'Active'
                                ? 'default'
                                : booking.status === 'Upcoming'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <p>
                            {format(new Date(booking.startDate), 'MMM d')} -{' '}
                            {format(new Date(booking.endDate), 'MMM d, yyyy')}
                          </p>
                          <p className="font-semibold text-foreground mt-1">
                            ₹{booking.monthlyRent.toLocaleString()}/month
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : selectedDate ? (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No bookings for this date</p>
                <p className="text-xs mt-1">Click "New Booking" to schedule</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Select a date to view bookings</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      {selectedBooking && (
        <BookingDetailsDialog
          booking={selectedBooking}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}

      <BookingFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={
          newBookingDate
            ? {
                startDate: format(newBookingDate, 'yyyy-MM-dd'),
              }
            : undefined
        }
      />
    </div>
  );
}
