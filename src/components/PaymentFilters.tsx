import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { PaymentStatus, PaymentMethod, PaymentType } from "@/types";

export interface PaymentFiltersState {
  search: string;
  status: PaymentStatus | "all";
  paymentMethod: PaymentMethod | "all";
  paymentType: PaymentType | "all";
  dateFrom: string;
  dateTo: string;
}

interface PaymentFiltersProps {
  filters: PaymentFiltersState;
  onFilterChange: (filters: PaymentFiltersState) => void;
}

export function PaymentFilters({ filters, onFilterChange }: PaymentFiltersProps) {
  const updateFilter = (key: keyof PaymentFiltersState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      status: "all",
      paymentMethod: "all",
      paymentType: "all",
      dateFrom: "",
      dateTo: "",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.paymentMethod !== "all" ||
    filters.paymentType !== "all" ||
    filters.dateFrom ||
    filters.dateTo;

  return (
    <div className="space-y-4">
      {/* Search and Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenant, room, receipt..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Partial">Partial</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.paymentType}
          onValueChange={(value) => updateFilter("paymentType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Rent">Rent</SelectItem>
            <SelectItem value="Security Deposit">Security Deposit</SelectItem>
            <SelectItem value="Advance">Advance</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
            <SelectItem value="Electricity">Electricity</SelectItem>
            <SelectItem value="Water">Water</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payment Method and Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          value={filters.paymentMethod}
          onValueChange={(value) => updateFilter("paymentMethod", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Methods" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="UPI">UPI</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
            <SelectItem value="Card">Card</SelectItem>
            <SelectItem value="Cheque">Cheque</SelectItem>
            <SelectItem value="Online">Online</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          placeholder="From Date"
          value={filters.dateFrom}
          onChange={(e) => updateFilter("dateFrom", e.target.value)}
        />

        <Input
          type="date"
          placeholder="To Date"
          value={filters.dateTo}
          onChange={(e) => updateFilter("dateTo", e.target.value)}
        />

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
