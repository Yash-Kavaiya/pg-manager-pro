import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Booking } from "@/types/booking";
import { format, isSameDay, isWithinInterval, parseISO } from "date-fns";

interface BookingCalendarProps {
  bookings: Booking[];
  onCreateBooking: (date: Date) => void;
  onBookingClick: (booking: Booking) => void;
}

export default function BookingCalendar({
  bookings,
  onCreateBooking,
  onBookingClick,
}: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Get bookings for a specific date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter((booking) => {
      const startDate = parseISO(booking.startDate);
      const endDate = parseISO(booking.endDate);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
  };

  // Get status color for badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "";
    }
  };

  // Get modifiers for days with bookings
  const modifiers = {
    hasBookings: (date: Date) => {
      return getBookingsForDate(date).length > 0;
    },
  };

  // Custom day content to show booking indicators
  const DayContentComponent = ({ date }: { date: Date }) => {
    const dayBookings = getBookingsForDate(date);
    const activeCount = dayBookings.filter((b) => b.status === "Active").length;
    const upcomingCount = dayBookings.filter((b) => b.status === "Upcoming").length;
    const pendingCount = dayBookings.filter((b) => b.status === "Pending").length;

    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span className="text-sm">{format(date, "d")}</span>
        {dayBookings.length > 0 && (
          <div className="flex gap-0.5 mt-0.5">
            {activeCount > 0 && (
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" title={`${activeCount} active`} />
            )}
            {upcomingCount > 0 && (
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" title={`${upcomingCount} upcoming`} />
            )}
            {pendingCount > 0 && (
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" title={`${pendingCount} pending`} />
            )}
          </div>
        )}
      </div>
    );
  };

  // Handle date click
  const handleDateClick = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  // Handle month navigation
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : [];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold min-w-[200px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <div className="flex items-center gap-3 ml-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Upcoming</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex gap-6">
          {/* Main Calendar */}
          <div className="flex-1">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateClick}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={modifiers}
              className="rounded-md border w-full"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center hidden",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center hidden",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent w-full h-16",
                day: "h-full w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground font-semibold",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_hidden: "invisible",
              }}
              components={{
                DayContent: DayContentComponent,
              }}
            />
          </div>

          {/* Selected Date Details */}
          <div className="w-80">
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">
                    {selectedDate
                      ? format(selectedDate, "EEEE, MMMM d, yyyy")
                      : "Select a date"}
                  </h3>
                  {selectedDate && (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => onCreateBooking(selectedDate)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      New Booking
                    </Button>
                  )}
                </div>

                {selectedDateBookings.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Bookings ({selectedDateBookings.length})
                    </h4>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {selectedDateBookings.map((booking) => (
                        <Card
                          key={booking.id}
                          className="p-3 cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => onBookingClick(booking)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{booking.tenant}</p>
                                <p className="text-xs text-muted-foreground">
                                  Room {booking.room}
                                </p>
                              </div>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getStatusColor(booking.status)}`}
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div className="flex items-center justify-between">
                                <span>Check-in:</span>
                                <span>{format(parseISO(booking.startDate), "MMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Check-out:</span>
                                <span>{format(parseISO(booking.endDate), "MMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center justify-between font-medium text-foreground pt-1">
                                <span>Monthly Rent:</span>
                                <span>₹{booking.monthlyRent.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  selectedDate && (
                    <div className="text-sm text-muted-foreground text-center py-8">
                      No bookings on this date
                    </div>
                  )
                )}
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
}
