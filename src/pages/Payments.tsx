import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DollarSign,
  Plus,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  Download,
  Filter,
} from "lucide-react";
import { usePGContext } from "@/context/PGContext";
import { Payment } from "@/types";
import { PaymentFormDialog } from "@/components/PaymentFormDialog";
import { PaymentDetailsDialog } from "@/components/PaymentDetailsDialog";
import { PaymentFilters, PaymentFiltersState } from "@/components/PaymentFilters";
import { useToast } from "@/hooks/use-toast";

const Payments = () => {
  const { selectedPG, payments: allPayments, addPayment, updatePayment, deletePayment } = usePGContext();
  const { toast } = useToast();

  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editingPayment, setEditingPayment] = useState<Payment | undefined>(undefined);

  const [filters, setFilters] = useState<PaymentFiltersState>({
    search: "",
    status: "all",
    paymentMethod: "all",
    paymentType: "all",
    dateFrom: "",
    dateTo: "",
  });

  // Filter payments for selected PG
  const pgPayments = useMemo(() =>
    allPayments.filter(payment => payment.pgId === selectedPG?.id),
    [allPayments, selectedPG]
  );

  // Apply filters
  const filteredPayments = useMemo(() => {
    return pgPayments.filter(payment => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          payment.tenant.toLowerCase().includes(searchLower) ||
          payment.room.toLowerCase().includes(searchLower) ||
          payment.receiptNumber?.toLowerCase().includes(searchLower) ||
          payment.transactionId?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== "all" && payment.status !== filters.status) {
        return false;
      }

      // Payment method filter
      if (filters.paymentMethod !== "all" && payment.paymentMethod !== filters.paymentMethod) {
        return false;
      }

      // Payment type filter
      if (filters.paymentType !== "all" && payment.paymentType !== filters.paymentType) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom && payment.dueDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && payment.dueDate > filters.dateTo) {
        return false;
      }

      return true;
    });
  }, [pgPayments, filters]);

  // Calculate payment stats
  const stats = useMemo(() => {
    const paid = pgPayments.filter(p => p.status === "Paid");
    const pending = pgPayments.filter(p => p.status === "Pending");
    const overdue = pgPayments.filter(p => p.status === "Overdue");
    const partial = pgPayments.filter(p => p.status === "Partial");

    const totalCollected = paid.reduce((sum, p) => {
      let amount = p.amount;
      if (p.late_fee) amount += p.late_fee;
      if (p.discount) amount -= p.discount;
      return sum + amount;
    }, 0);

    const totalPending = pending.reduce((sum, p) => sum + p.amount, 0);
    const totalOverdue = overdue.reduce((sum, p) => {
      let amount = p.amount;
      if (p.late_fee) amount += p.late_fee;
      return sum + amount;
    }, 0);
    const totalPartial = partial.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalCollected,
      totalPending,
      totalOverdue,
      totalPartial,
      paidCount: paid.length,
      pendingCount: pending.length,
      overdueCount: overdue.length,
      partialCount: partial.length,
      totalPayments: pgPayments.length,
    };
  }, [pgPayments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-success/10 text-success";
      case "Pending": return "bg-yellow-500/10 text-yellow-600";
      case "Overdue": return "bg-destructive/10 text-destructive";
      case "Partial": return "bg-blue-500/10 text-blue-600";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleAddPayment = () => {
    setEditingPayment(undefined);
    setShowFormDialog(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setShowFormDialog(true);
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetailsDialog(true);
  };

  const handleDeleteClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPayment) {
      deletePayment(selectedPayment.id);
      toast({
        title: "Payment Deleted",
        description: "Payment record has been successfully deleted.",
      });
      setShowDeleteDialog(false);
      setSelectedPayment(null);
    }
  };

  const handleSavePayment = (paymentData: Partial<Payment>) => {
    if (editingPayment) {
      updatePayment(editingPayment.id, paymentData);
      toast({
        title: "Payment Updated",
        description: "Payment record has been successfully updated.",
      });
    } else {
      addPayment(paymentData as Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>);
      toast({
        title: "Payment Recorded",
        description: "New payment has been successfully recorded.",
      });
    }
  };

  const handleEditFromDetails = () => {
    if (selectedPayment) {
      setShowDetailsDialog(false);
      handleEditPayment(selectedPayment);
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Tenant", "Room", "Type", "Amount", "Status", "Method", "Receipt"];
    const rows = filteredPayments.map(p => [
      p.dueDate,
      p.tenant,
      p.room,
      p.paymentType,
      p.amount,
      p.status,
      p.paymentMethod || "",
      p.receiptNumber || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-${selectedPG?.name}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: "Payment data has been exported to CSV.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
          <p className="text-muted-foreground">
            {selectedPG ? `${selectedPG.name} - Track and manage payments` : 'Select a property to view payments'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
          <Button
            variant="outline"
            onClick={exportToCSV}
            className="gap-2"
            disabled={filteredPayments.length === 0}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleAddPayment} className="gap-2">
            <Plus className="h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Collected
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(stats.totalCollected)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.paidCount} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending
              </CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(stats.totalPending)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.pendingCount} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overdue
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(stats.totalOverdue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.overdueCount} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Partial
              </CardTitle>
              <Receipt className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.totalPartial)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.partialCount} payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentFilters filters={filters} onFilterChange={setFilters} />
          </CardContent>
        </Card>
      )}

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Records
            </CardTitle>
            <Badge variant="secondary">
              {filteredPayments.length} of {pgPayments.length} payments
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.tenant}</TableCell>
                      <TableCell>{payment.room}</TableCell>
                      <TableCell>{payment.paymentType}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(payment.amount)}
                        {payment.late_fee && payment.late_fee > 0 && (
                          <span className="text-xs text-destructive ml-1">
                            +{formatCurrency(payment.late_fee)}
                          </span>
                        )}
                        {payment.discount && payment.discount > 0 && (
                          <span className="text-xs text-success ml-1">
                            -{formatCurrency(payment.discount)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(payment.dueDate)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.paymentMethod || "-"}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {payment.receiptNumber || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewPayment(payment)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditPayment(payment)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit Payment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(payment)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Payment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PaymentFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        payment={editingPayment}
        onSave={handleSavePayment}
      />

      <PaymentDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        payment={selectedPayment}
        onEdit={handleEditFromDetails}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this payment record for{" "}
              <strong>{selectedPayment?.tenant}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Payments;
