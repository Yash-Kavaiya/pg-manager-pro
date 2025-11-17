import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingStatus, PaymentStatus } from "@/types/booking";
import { Search, X, Filter, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface BookingFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusFilterChange: (value: string) => void;
  dateRangeStart?: string;
  onDateRangeStartChange?: (value: string) => void;
  dateRangeEnd?: string;
  onDateRangeEndChange?: (value: string) => void;
  roomFilter?: string;
  onRoomFilterChange?: (value: string) => void;
  onClearFilters: () => void;
}

export function BookingFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  paymentStatusFilter,
  onPaymentStatusFilterChange,
  dateRangeStart,
  onDateRangeStartChange,
  dateRangeEnd,
  onDateRangeEndChange,
  roomFilter,
  onRoomFilterChange,
  onClearFilters,
}: BookingFiltersProps) {
  const hasActiveFilters =
    searchTerm ||
    statusFilter !== "all" ||
    paymentStatusFilter !== "all" ||
    (dateRangeStart && dateRangeStart !== "") ||
    (dateRangeEnd && dateRangeEnd !== "") ||
    (roomFilter && roomFilter !== "all");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Filter className="h-4 w-4" />
          Filter Bookings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by room, tenant, phone, or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Separator />

        {/* Status Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status-filter" className="text-sm font-medium">Booking Status</Label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger id="status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment-filter" className="text-sm font-medium">Payment Status</Label>
            <Select value={paymentStatusFilter} onValueChange={onPaymentStatusFilterChange}>
              <SelectTrigger id="payment-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {onRoomFilterChange && (
            <div className="space-y-2">
              <Label htmlFor="room-filter" className="text-sm font-medium">Room</Label>
              <Input
                id="room-filter"
                placeholder="Filter by room number"
                value={roomFilter || ""}
                onChange={(e) => onRoomFilterChange(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        {onDateRangeStartChange && onDateRangeEndChange && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4" />
                <span>Date Range</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date-start" className="text-sm">Start Date</Label>
                  <Input
                    id="date-start"
                    type="date"
                    value={dateRangeStart || ""}
                    onChange={(e) => onDateRangeStartChange(e.target.value)}
                    placeholder="From date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date-end" className="text-sm">End Date</Label>
                  <Input
                    id="date-end"
                    type="date"
                    value={dateRangeEnd || ""}
                    onChange={(e) => onDateRangeEndChange(e.target.value)}
                    placeholder="To date"
                    min={dateRangeStart}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={onClearFilters} className="gap-2">
              <X className="h-4 w-4" />
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            {searchTerm && (
              <div className="text-xs bg-muted px-2 py-1 rounded-md flex items-center gap-1">
                <Search className="h-3 w-3" />
                <span>Search: {searchTerm}</span>
              </div>
            )}
            {statusFilter !== "all" && (
              <div className="text-xs bg-muted px-2 py-1 rounded-md">
                Status: {statusFilter}
              </div>
            )}
            {paymentStatusFilter !== "all" && (
              <div className="text-xs bg-muted px-2 py-1 rounded-md">
                Payment: {paymentStatusFilter}
              </div>
            )}
            {dateRangeStart && (
              <div className="text-xs bg-muted px-2 py-1 rounded-md flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>From: {dateRangeStart}</span>
              </div>
            )}
            {dateRangeEnd && (
              <div className="text-xs bg-muted px-2 py-1 rounded-md flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>To: {dateRangeEnd}</span>
              </div>
            )}
            {roomFilter && roomFilter !== "all" && (
              <div className="text-xs bg-muted px-2 py-1 rounded-md">
                Room: {roomFilter}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
