import { useState, useEffect, useMemo } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Booking, BookingStatus } from "@/types/booking";
import { usePGContext } from "@/context/PGContext";
import { AlertCircle, Calculator, Home, User, Calendar, DollarSign, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { rooms, tenants, selectedPG } = usePGContext();

  const [formData, setFormData] = useState({
    room: booking?.room || "",
    tenant: booking?.tenant || "",
    email: booking?.email || "",
    phone: booking?.phone || "",
    startDate: booking?.startDate || "",
    endDate: booking?.endDate || "",
    checkInDate: booking?.checkInDate || "",
    status: booking?.status || ("Pending" as BookingStatus),
    monthlyRent: booking?.monthlyRent || 0,
    securityDeposit: booking?.securityDeposit || 0,
    advance: booking?.advance || 0,
    emergencyContactName: booking?.emergencyContact?.name || "",
    emergencyContactPhone: booking?.emergencyContact?.phone || "",
    emergencyContactRelation: booking?.emergencyContact?.relation || "",
    notes: booking?.notes || "",
    idProofUrl: booking?.documents?.idProof || "",
    photoUrl: booking?.documents?.photoUrl || "",
    agreementUrl: booking?.documents?.agreementUrl || "",
  });

  const [useExistingTenant, setUseExistingTenant] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);

  // Filter rooms and tenants for selected PG
  const availableRooms = useMemo(() => {
    return rooms.filter(r => r.pgId === selectedPG?.id && r.status === 'Available');
  }, [rooms, selectedPG]);

  const existingTenants = useMemo(() => {
    return tenants.filter(t => t.pgId === selectedPG?.id);
  }, [tenants, selectedPG]);

  // Calculate booking duration in months
  const bookingDuration = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const months = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months > 0 ? months : 0;
  }, [formData.startDate, formData.endDate]);

  // Calculate expected total rent
  const expectedTotal = useMemo(() => {
    return formData.monthlyRent * bookingDuration;
  }, [formData.monthlyRent, bookingDuration]);

  // Auto-fill room details when room is selected
  useEffect(() => {
    if (formData.room && !booking) {
      const selectedRoom = rooms.find(r => r.number === formData.room && r.pgId === selectedPG?.id);
      if (selectedRoom) {
        setFormData(prev => ({
          ...prev,
          monthlyRent: selectedRoom.rent,
          securityDeposit: selectedRoom.deposit,
        }));
      }
    }
  }, [formData.room, rooms, selectedPG, booking]);

  // Auto-fill tenant details when existing tenant is selected
  useEffect(() => {
    if (selectedTenantId && useExistingTenant) {
      const tenant = existingTenants.find(t => t.id === selectedTenantId);
      if (tenant) {
        setFormData(prev => ({
          ...prev,
          tenant: tenant.name,
          email: tenant.email,
          phone: tenant.phone,
        }));
      }
    }
  }, [selectedTenantId, useExistingTenant, existingTenants]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setUseExistingTenant(false);
      setSelectedTenantId(null);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const bookingData: Partial<Booking> = {
      room: formData.room,
      tenant: formData.tenant,
      email: formData.email,
      phone: formData.phone,
      startDate: formData.startDate,
      endDate: formData.endDate,
      checkInDate: formData.checkInDate || undefined,
      status: formData.status,
      monthlyRent: Number(formData.monthlyRent),
      securityDeposit: Number(formData.securityDeposit),
      advance: Number(formData.advance) || undefined,
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relation: formData.emergencyContactRelation,
      },
      documents: {
        idProof: formData.idProofUrl || undefined,
        photoUrl: formData.photoUrl || undefined,
        agreementUrl: formData.agreementUrl || undefined,
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Home className="h-6 w-6" />
            {booking ? "Edit Booking" : "New Booking"}
          </DialogTitle>
          <DialogDescription>
            {booking
              ? "Update booking information and tenant details"
              : "Create a new booking for a room with complete tenant information"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* Room and Status */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Home className="h-4 w-4" />
                Room Details
              </div>
              <div className="grid grid-cols-2 gap-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="room">Room Number *</Label>
                  {booking ? (
                    <Input
                      id="room"
                      value={formData.room}
                      onChange={(e) => updateField("room", e.target.value)}
                      placeholder="e.g., 101"
                      required
                    />
                  ) : (
                    <Select
                      value={formData.room}
                      onValueChange={(value) => updateField("room", value)}
                      required
                    >
                      <SelectTrigger id="room">
                        <SelectValue placeholder="Select available room" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRooms.length === 0 ? (
                          <SelectItem value="none" disabled>
                            No available rooms
                          </SelectItem>
                        ) : (
                          availableRooms.map((room) => (
                            <SelectItem key={room.id} value={room.number}>
                              Room {room.number} - {room.type} (₹{room.rent}/month)
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Booking Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => updateField("status", value)}
                    required
                  >
                    <SelectTrigger id="status">
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
            </div>

            <Separator />

            {/* Tenant Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <User className="h-4 w-4" />
                  Tenant Information
                </div>
                {!booking && existingTenants.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="useExisting" className="text-xs">Use Existing Tenant</Label>
                    <input
                      type="checkbox"
                      id="useExisting"
                      checked={useExistingTenant}
                      onChange={(e) => setUseExistingTenant(e.target.checked)}
                      className="rounded"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 pl-6">
                {useExistingTenant && !booking ? (
                  <div className="space-y-2">
                    <Label htmlFor="existingTenant">Select Tenant *</Label>
                    <Select
                      value={selectedTenantId?.toString() || ""}
                      onValueChange={(value) => setSelectedTenantId(Number(value))}
                      required
                    >
                      <SelectTrigger id="existingTenant">
                        <SelectValue placeholder="Select existing tenant" />
                      </SelectTrigger>
                      <SelectContent>
                        {existingTenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id.toString()}>
                            {tenant.name} - {tenant.phone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="tenant">Tenant Name *</Label>
                  <Input
                    id="tenant"
                    value={formData.tenant}
                    onChange={(e) => updateField("tenant", e.target.value)}
                    placeholder="Enter tenant full name"
                    required
                    disabled={useExistingTenant && selectedTenantId !== null}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="tenant@example.com"
                      disabled={useExistingTenant && selectedTenantId !== null}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      disabled={useExistingTenant && selectedTenantId !== null}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Booking Period */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4" />
                Booking Period
              </div>
              <div className="grid grid-cols-3 gap-4 pl-6">
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
                    min={formData.startDate}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkInDate">Check-in Date</Label>
                  <Input
                    id="checkInDate"
                    type="date"
                    value={formData.checkInDate}
                    onChange={(e) => updateField("checkInDate", e.target.value)}
                    min={formData.startDate}
                    max={formData.endDate}
                  />
                </div>
              </div>
              {bookingDuration > 0 && (
                <Alert className="ml-6">
                  <Calculator className="h-4 w-4" />
                  <AlertDescription>
                    Booking duration: <strong>{bookingDuration} {bookingDuration === 1 ? 'month' : 'months'}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />

            {/* Financial Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <DollarSign className="h-4 w-4" />
                Financial Details
              </div>
              <div className="grid grid-cols-3 gap-4 pl-6">
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
                  <Label htmlFor="advance">Advance Payment (₹)</Label>
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
              {expectedTotal > 0 && (
                <Alert className="ml-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>Expected total rent for duration:</span>
                    <Badge variant="secondary" className="text-base">
                      ₹{expectedTotal.toLocaleString()}
                    </Badge>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Separator />

            {/* Emergency Contact */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <AlertCircle className="h-4 w-4" />
                Emergency Contact
              </div>
              <div className="grid grid-cols-3 gap-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactName">Contact Name</Label>
                  <Input
                    id="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={(e) => updateField("emergencyContactName", e.target.value)}
                    placeholder="Contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
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
                    placeholder="e.g., Father, Mother"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Documents */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4" />
                Document URLs (Optional)
              </div>
              <div className="grid grid-cols-1 gap-4 pl-6">
                <div className="space-y-2">
                  <Label htmlFor="idProofUrl">ID Proof URL</Label>
                  <Input
                    id="idProofUrl"
                    value={formData.idProofUrl}
                    onChange={(e) => updateField("idProofUrl", e.target.value)}
                    placeholder="https://example.com/id-proof.pdf"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photoUrl">Tenant Photo URL</Label>
                  <Input
                    id="photoUrl"
                    value={formData.photoUrl}
                    onChange={(e) => updateField("photoUrl", e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agreementUrl">Agreement Document URL</Label>
                  <Input
                    id="agreementUrl"
                    value={formData.agreementUrl}
                    onChange={(e) => updateField("agreementUrl", e.target.value)}
                    placeholder="https://example.com/agreement.pdf"
                  />
                </div>
              </div>
              <Alert className="ml-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Upload documents to your preferred storage service and paste the URLs here
                </AlertDescription>
              </Alert>
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="h-4 w-4" />
                Additional Notes
              </div>
              <div className="pl-6">
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Add any additional notes about the booking, special requirements, or agreements..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
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
