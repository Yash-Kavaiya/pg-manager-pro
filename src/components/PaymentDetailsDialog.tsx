import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/types";
import { Calendar, CreditCard, FileText, Receipt, User, Home, Banknote, Tag, AlertCircle, Percent } from "lucide-react";

interface PaymentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  onEdit?: () => void;
}

export function PaymentDetailsDialog({
  open,
  onOpenChange,
  payment,
  onEdit,
}: PaymentDetailsDialogProps) {
  if (!payment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-success/10 text-success";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600";
      case "Overdue":
        return "bg-destructive/10 text-destructive";
      case "Partial":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "₹0";
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Calculate total amount with late fee and discount
  const calculateTotalAmount = () => {
    let total = payment.amount;
    if (payment.late_fee) total += payment.late_fee;
    if (payment.discount) total -= payment.discount;
    return total;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Payment Details</DialogTitle>
              <DialogDescription>
                Complete information about this payment
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(payment.status)}>
              {payment.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tenant and Room Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Tenant</span>
              </div>
              <p className="text-base font-medium">{payment.tenant}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="h-4 w-4" />
                <span>Room</span>
              </div>
              <p className="text-base font-medium">Room {payment.room}</p>
            </div>
          </div>

          {/* Payment Type and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Payment Type</span>
              </div>
              <p className="text-base font-medium">{payment.paymentType}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Banknote className="h-4 w-4" />
                <span>Base Amount</span>
              </div>
              <p className="text-base font-semibold text-foreground">
                {formatCurrency(payment.amount)}
              </p>
            </div>
          </div>

          {/* Late Fee and Discount */}
          {(payment.late_fee || payment.discount) && (
            <div className="grid grid-cols-2 gap-4">
              {payment.late_fee && payment.late_fee > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    <span>Late Fee</span>
                  </div>
                  <p className="text-base font-medium text-destructive">
                    +{formatCurrency(payment.late_fee)}
                  </p>
                </div>
              ) : null}
              {payment.discount && payment.discount > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Percent className="h-4 w-4" />
                    <span>Discount</span>
                  </div>
                  <p className="text-base font-medium text-success">
                    -{formatCurrency(payment.discount)}
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Total Amount */}
          {(payment.late_fee || payment.discount) && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
                <span className="text-xl font-bold">{formatCurrency(calculateTotalAmount())}</span>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Due Date</span>
              </div>
              <p className="text-base font-medium">{formatDate(payment.dueDate)}</p>
            </div>
            {payment.paidDate && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Paid Date</span>
                </div>
                <p className="text-base font-medium">{formatDate(payment.paidDate)}</p>
              </div>
            )}
          </div>

          {/* Payment Method and Details */}
          {(payment.status === 'Paid' || payment.status === 'Partial') && (
            <>
              {payment.paymentMethod && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4" />
                    <span>Payment Method</span>
                  </div>
                  <p className="text-base font-medium">{payment.paymentMethod}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {payment.receiptNumber && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Receipt className="h-4 w-4" />
                      <span>Receipt Number</span>
                    </div>
                    <p className="text-base font-mono font-medium">{payment.receiptNumber}</p>
                  </div>
                )}
                {payment.transactionId && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>Transaction ID</span>
                    </div>
                    <p className="text-base font-mono font-medium">{payment.transactionId}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Notes */}
          {payment.notes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Notes</span>
              </div>
              <p className="text-sm text-foreground bg-muted p-3 rounded-md">
                {payment.notes}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              {payment.createdAt && (
                <div>
                  <span className="font-medium">Created: </span>
                  <span>{formatDateTime(payment.createdAt)}</span>
                </div>
              )}
              {payment.updatedAt && (
                <div>
                  <span className="font-medium">Last Updated: </span>
                  <span>{formatDateTime(payment.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {onEdit && (
            <Button onClick={onEdit}>
              Edit Payment
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
