import { useState } from "react";
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
import { Booking, BookingStatus } from "@/types/booking";

interface BookingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: Booking;
  onSave: (booking: Partial<Booking>) => void;
}

export function BookingFormDialog({
  open,
  onOpenChange,
  booking,
  onSave,
}: BookingFormDialogProps) {
  const [formData, setFormData] = useState({
    room: booking?.room || "",
    tenant: booking?.tenant || "",
    email: booking?.email || "",
    phone: booking?.phone || "",
    startDate: booking?.startDate || "",
    endDate: booking?.endDate || "",
    status: booking?.status || ("Pending" as BookingStatus),
    monthlyRent: booking?.monthlyRent || 0,
    securityDeposit: booking?.securityDeposit || 0,
    advance: booking?.advance || 0,
    emergencyContactName: booking?.emergencyContact?.name || "",
    emergencyContactPhone: booking?.emergencyContact?.phone || "",
    emergencyContactRelation: booking?.emergencyContact?.relation || "",
    notes: booking?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData: Partial<Booking> = {
      room: formData.room,
      tenant: formData.tenant,
      email: formData.email,
      phone: formData.phone,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      monthlyRent: Number(formData.monthlyRent),
      securityDeposit: Number(formData.securityDeposit),
      advance: Number(formData.advance),
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relation: formData.emergencyContactRelation,
      },
      notes: formData.notes,
      payments: booking?.payments || [],
      updatedAt: new Date().toISOString(),
    };

    if (!booking) {
      bookingData.createdAt = new Date().toISOString();
    }

    onSave(bookingData);
    onOpenChange(false);
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {booking ? "Edit Booking" : "New Booking"}
          </DialogTitle>
          <DialogDescription>
            {booking
              ? "Update booking information"
              : "Create a new booking for a room"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room">Room Number *</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => updateField("room", e.target.value)}
                  placeholder="e.g., 101"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tenant Information */}
            <div className="space-y-2">
              <Label htmlFor="tenant">Tenant Name *</Label>
              <Input
                id="tenant"
                value={formData.tenant}
                onChange={(e) => updateField("tenant", e.target.value)}
                placeholder="Enter tenant name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="tenant@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Booking Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => updateField("startDate", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => updateField("endDate", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Financial Information */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rent (₹) *</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => updateField("monthlyRent", e.target.value)}
                  placeholder="5000"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit (₹) *</Label>
                <Input
                  id="securityDeposit"
                  type="number"
                  value={formData.securityDeposit}
                  onChange={(e) => updateField("securityDeposit", e.target.value)}
                  placeholder="10000"
                  min="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="advance">Advance (₹)</Label>
                <Input
                  id="advance"
                  type="number"
                  value={formData.advance}
                  onChange={(e) => updateField("advance", e.target.value)}
                  placeholder="5000"
                  min="0"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Emergency Contact</Label>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Name</Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => updateField("emergencyContactName", e.target.value)}
                  placeholder="Contact name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Phone</Label>
                <Input
                  id="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">Relation</Label>
                <Input
                  id="emergencyContactRelation"
                  value={formData.emergencyContactRelation}
                  onChange={(e) => updateField("emergencyContactRelation", e.target.value)}
                  placeholder="e.g., Father"
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
                placeholder="Additional notes about the booking..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {booking ? "Update Booking" : "Create Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
