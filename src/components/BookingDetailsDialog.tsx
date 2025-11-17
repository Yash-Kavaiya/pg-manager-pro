import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Booking } from "@/types/booking";
import {
  Calendar,
  User,
  Phone,
  Mail,
  Home,
  DollarSign,
  FileText,
  AlertCircle,
  CreditCard,
} from "lucide-react";

interface BookingDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onEdit?: () => void;
}

export function BookingDetailsDialog({
  open,
  onOpenChange,
  booking,
  onEdit,
}: BookingDetailsDialogProps) {
  if (!booking) return null;

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

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Paid: "bg-success/10 text-success",
      Pending: "bg-yellow-500/10 text-yellow-600",
      Overdue: "bg-destructive/10 text-destructive",
      Partial: "bg-orange-500/10 text-orange-600",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  const totalPaid = booking.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const duration = Math.ceil(
    (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
      (1000 * 60 * 60 * 24 * 30)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">Booking Details</DialogTitle>
              <DialogDescription>
                Complete information about this booking
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={onEdit}>
                  Edit
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Room and Tenant Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Home className="h-4 w-4" />
                Room Information
              </div>
              <div className="pl-6">
                <div className="text-2xl font-bold">Room {booking.room}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <User className="h-4 w-4" />
                Tenant Information
              </div>
              <div className="pl-6 space-y-1">
                <div className="font-semibold">{booking.tenant}</div>
                {booking.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {booking.email}
                  </div>
                )}
                {booking.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {booking.phone}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Duration */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Booking Period
            </div>
            <div className="pl-6 grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Start Date</div>
                <div className="font-medium">{booking.startDate}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">End Date</div>
                <div className="font-medium">{booking.endDate}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="font-medium">{duration} months</div>
              </div>
            </div>
            {booking.checkInDate && (
              <div className="pl-6 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Check-in Date</div>
                  <div className="font-medium">{booking.checkInDate}</div>
                </div>
                {booking.checkOutDate && (
                  <div>
                    <div className="text-xs text-muted-foreground">Check-out Date</div>
                    <div className="font-medium">{booking.checkOutDate}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Financial Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              Financial Details
            </div>
            <div className="pl-6 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Rent:</span>
                  <span className="font-semibold">₹{booking.monthlyRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Security Deposit:</span>
                  <span className="font-semibold">₹{booking.securityDeposit.toLocaleString()}</span>
                </div>
                {booking.advance && booking.advance > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Advance:</span>
                    <span className="font-semibold">₹{booking.advance.toLocaleString()}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Paid:</span>
                  <span className="font-semibold text-success">₹{totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Expected Total:</span>
                  <span className="font-semibold">₹{(booking.monthlyRent * duration).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment History */}
          {booking.payments && booking.payments.length > 0 && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Payment History ({booking.payments.length} payments)
                </div>
                <div className="pl-6 space-y-2">
                  {booking.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">₹{payment.amount.toLocaleString()}</span>
                          <Badge className={getPaymentStatusColor(payment.status)} variant="outline">
                            {payment.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {payment.date} • {payment.method}
                          {payment.receiptNumber && ` • Receipt: ${payment.receiptNumber}`}
                        </div>
                        {payment.notes && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {payment.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Emergency Contact */}
          {booking.emergencyContact && booking.emergencyContact.name && (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  Emergency Contact
                </div>
                <div className="pl-6 space-y-1">
                  <div className="font-medium">{booking.emergencyContact.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {booking.emergencyContact.relation}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {booking.emergencyContact.phone}
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <FileText className="h-4 w-4" />
                Notes
              </div>
              <div className="pl-6 text-sm text-muted-foreground whitespace-pre-wrap">
                {booking.notes}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
            <div>Created: {new Date(booking.createdAt).toLocaleString()}</div>
            <div>Last Updated: {new Date(booking.updatedAt).toLocaleString()}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
