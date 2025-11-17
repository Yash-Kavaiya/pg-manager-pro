import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Payment, PaymentStatus, PaymentMethod, PaymentType } from "@/types";
import { usePGContext } from "@/context/PGContext";

interface PaymentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: Payment;
  onSave: (payment: Partial<Payment>) => void;
}

export function PaymentFormDialog({
  open,
  onOpenChange,
  payment,
  onSave,
}: PaymentFormDialogProps) {
  const { tenants, rooms, selectedPG } = usePGContext();
  const [formData, setFormData] = useState({
    tenant: payment?.tenant || "",
    tenantId: payment?.tenantId || undefined,
    room: payment?.room || "",
    amount: payment?.amount || 0,
    dueDate: payment?.dueDate || "",
    status: payment?.status || ("Pending" as PaymentStatus),
    paidDate: payment?.paidDate || "",
    paymentMethod: payment?.paymentMethod || ("" as PaymentMethod),
    paymentType: payment?.paymentType || ("Rent" as PaymentType),
    receiptNumber: payment?.receiptNumber || "",
    transactionId: payment?.transactionId || "",
    notes: payment?.notes || "",
    late_fee: payment?.late_fee || 0,
    discount: payment?.discount || 0,
  });

  // Filter tenants and rooms for the selected PG
  const filteredTenants = tenants.filter(t => t.pgId === selectedPG?.id);
  const filteredRooms = rooms.filter(r => r.pgId === selectedPG?.id);

  // Update tenant and room when tenant is selected
  useEffect(() => {
    if (formData.tenantId) {
      const tenant = filteredTenants.find(t => t.id === formData.tenantId);
      if (tenant) {
        setFormData(prev => ({
          ...prev,
          tenant: tenant.name,
          room: tenant.room,
        }));
      }
    }
  }, [formData.tenantId, filteredTenants]);

  // Auto-set paidDate when status changes to Paid
  useEffect(() => {
    if (formData.status === 'Paid' && !formData.paidDate) {
      setFormData(prev => ({
        ...prev,
        paidDate: new Date().toISOString().split('T')[0],
      }));
    }
  }, [formData.status, formData.paidDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paymentData: Partial<Payment> = {
      pgId: selectedPG?.id || "",
      tenant: formData.tenant,
      tenantId: formData.tenantId,
      room: formData.room,
      amount: Number(formData.amount),
      dueDate: formData.dueDate,
      status: formData.status,
      paidDate: formData.status === 'Paid' || formData.status === 'Partial' ? formData.paidDate : null,
      paymentMethod: formData.paymentMethod || undefined,
      paymentType: formData.paymentType,
      receiptNumber: formData.receiptNumber || undefined,
      transactionId: formData.transactionId || undefined,
      notes: formData.notes || undefined,
      late_fee: Number(formData.late_fee) || undefined,
      discount: Number(formData.discount) || undefined,
      updatedAt: new Date().toISOString(),
    };

    if (!payment) {
      paymentData.createdAt = new Date().toISOString();
    }

    onSave(paymentData);
    onOpenChange(false);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {payment ? "Edit Payment" : "Record New Payment"}
          </DialogTitle>
          <DialogDescription>
            {payment
              ? "Update payment information"
              : "Record a new payment transaction"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Tenant and Room Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenantId">Tenant *</Label>
                <Select
                  value={formData.tenantId?.toString() || ""}
                  onValueChange={(value) => updateField("tenantId", Number(value))}
                  required
                >
                  <SelectTrigger id="tenantId">
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredTenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id.toString()}>
                        {tenant.name} - Room {tenant.room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room *</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => updateField("room", e.target.value)}
                  placeholder="Room number"
                  required
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Payment Type and Amount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type *</Label>
                <Select
                  value={formData.paymentType}
                  onValueChange={(value) => updateField("paymentType", value as PaymentType)}
                  required
                >
                  <SelectTrigger id="paymentType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
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
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹) *</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => updateField("amount", e.target.value)}
                  placeholder="0"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Due Date and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => updateField("dueDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Payment Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField("status", value as PaymentStatus)}
                  required
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Paid Date and Payment Method */}
            {(formData.status === 'Paid' || formData.status === 'Partial') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paidDate">Paid Date *</Label>
                  <Input
                    id="paidDate"
                    type="date"
                    value={formData.paidDate}
                    onChange={(e) => updateField("paidDate", e.target.value)}
                    required={formData.status === 'Paid' || formData.status === 'Partial'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => updateField("paymentMethod", value as PaymentMethod)}
                    required={formData.status === 'Paid' || formData.status === 'Partial'}
                  >
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Receipt and Transaction ID */}
            {(formData.status === 'Paid' || formData.status === 'Partial') && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiptNumber">Receipt Number</Label>
                  <Input
                    id="receiptNumber"
                    value={formData.receiptNumber}
                    onChange={(e) => updateField("receiptNumber", e.target.value)}
                    placeholder="REC-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    value={formData.transactionId}
                    onChange={(e) => updateField("transactionId", e.target.value)}
                    placeholder="TXN-123456"
                  />
                </div>
              </div>
            )}

            {/* Late Fee and Discount */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="late_fee">Late Fee (₹)</Label>
                <Input
                  id="late_fee"
                  type="number"
                  value={formData.late_fee}
                  onChange={(e) => updateField("late_fee", e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (₹)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => updateField("discount", e.target.value)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Additional notes or comments..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {payment ? "Update Payment" : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
