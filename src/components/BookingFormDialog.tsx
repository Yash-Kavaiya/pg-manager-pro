import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { Calendar, Upload, X } from "lucide-react";
import { toast } from "sonner";

// Validation schema
const bookingFormSchema = z.object({
  room: z.string().min(1, "Room is required"),
  tenant: z.string().min(2, "Tenant name must be at least 2 characters"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional().or(z.literal("")),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["Pending", "Upcoming", "Active", "Completed", "Cancelled"] as const),
  monthlyRent: z.coerce.number().min(0, "Monthly rent must be positive"),
  securityDeposit: z.coerce.number().min(0, "Security deposit must be positive"),
  advance: z.coerce.number().min(0, "Advance must be positive").optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelation: z.string().optional(),
  notes: z.string().optional(),
  idProof: z.string().optional(),
  photoUrl: z.string().optional(),
  agreementUrl: z.string().optional(),
}).refine((data) => {
  // Ensure end date is after start date
  if (data.startDate && data.endDate) {
    return new Date(data.endDate) >= new Date(data.startDate);
  }
  return true;
}, {
  message: "End date must be after or equal to start date",
  path: ["endDate"],
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

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
  const { rooms, selectedPG, tenants } = usePGContext();
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  // Get available rooms for the selected PG
  const availableRooms = rooms.filter(
    (room) => room.pgId === selectedPG?.id && (room.status === "Available" || room.number === booking?.room)
  );

  // Get existing tenants for autocomplete
  const existingTenants = tenants.filter((tenant) => tenant.pgId === selectedPG?.id);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      room: booking?.room || "",
      tenant: booking?.tenant || "",
      email: booking?.email || "",
      phone: booking?.phone || "",
      startDate: booking?.startDate || "",
      endDate: booking?.endDate || "",
      status: booking?.status || "Pending",
      monthlyRent: booking?.monthlyRent || 0,
      securityDeposit: booking?.securityDeposit || 0,
      advance: booking?.advance || 0,
      emergencyContactName: booking?.emergencyContact?.name || "",
      emergencyContactPhone: booking?.emergencyContact?.phone || "",
      emergencyContactRelation: booking?.emergencyContact?.relation || "",
      notes: booking?.notes || "",
      idProof: booking?.documents?.idProof || "",
      photoUrl: booking?.documents?.photoUrl || "",
      agreementUrl: booking?.documents?.agreementUrl || "",
    },
  });

  // Update form when booking changes
  useEffect(() => {
    if (booking) {
      form.reset({
        room: booking.room,
        tenant: booking.tenant,
        email: booking.email || "",
        phone: booking.phone || "",
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
        monthlyRent: booking.monthlyRent,
        securityDeposit: booking.securityDeposit,
        advance: booking.advance || 0,
        emergencyContactName: booking.emergencyContact?.name || "",
        emergencyContactPhone: booking.emergencyContact?.phone || "",
        emergencyContactRelation: booking.emergencyContact?.relation || "",
        notes: booking.notes || "",
        idProof: booking.documents?.idProof || "",
        photoUrl: booking.documents?.photoUrl || "",
        agreementUrl: booking.documents?.agreementUrl || "",
      });
    } else {
      form.reset({
        room: "",
        tenant: "",
        email: "",
        phone: "",
        startDate: "",
        endDate: "",
        status: "Pending",
        monthlyRent: 0,
        securityDeposit: 0,
        advance: 0,
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelation: "",
        notes: "",
        idProof: "",
        photoUrl: "",
        agreementUrl: "",
      });
    }
  }, [booking, form]);

  // When a room is selected, auto-fill rent and deposit
  const handleRoomChange = (roomNumber: string) => {
    setSelectedRoom(roomNumber);
    const room = rooms.find((r) => r.number === roomNumber && r.pgId === selectedPG?.id);
    if (room && !booking) {
      form.setValue("monthlyRent", room.rent);
      form.setValue("securityDeposit", room.deposit);
    }
  };

  // When a tenant is selected from existing tenants
  const handleTenantSelect = (tenantName: string) => {
    const tenant = existingTenants.find((t) => t.name === tenantName);
    if (tenant) {
      form.setValue("tenant", tenant.name);
      form.setValue("email", tenant.email);
      form.setValue("phone", tenant.phone);
      toast.info("Tenant details auto-filled");
    }
  };

  const onSubmit = (data: BookingFormData) => {
    const bookingData: Partial<Booking> = {
      room: data.room,
      tenant: data.tenant,
      email: data.email || undefined,
      phone: data.phone || undefined,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      monthlyRent: data.monthlyRent,
      securityDeposit: data.securityDeposit,
      advance: data.advance || undefined,
      emergencyContact: data.emergencyContactName || data.emergencyContactPhone || data.emergencyContactRelation
        ? {
            name: data.emergencyContactName || "",
            phone: data.emergencyContactPhone || "",
            relation: data.emergencyContactRelation || "",
          }
        : undefined,
      notes: data.notes || undefined,
      documents: data.idProof || data.photoUrl || data.agreementUrl
        ? {
            idProof: data.idProof || undefined,
            photoUrl: data.photoUrl || undefined,
            agreementUrl: data.agreementUrl || undefined,
          }
        : undefined,
      payments: booking?.payments || [],
      updatedAt: new Date().toISOString(),
    };

    if (!booking) {
      bookingData.createdAt = new Date().toISOString();
    }

    onSave(bookingData);
    onOpenChange(false);
    form.reset();
    toast.success(booking ? "Booking updated successfully" : "Booking created successfully");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {booking ? "Edit Booking" : "New Booking"}
          </DialogTitle>
          <DialogDescription>
            {booking
              ? "Update booking information and tenant details"
              : "Create a new booking for a room with complete tenant information"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Room and Status Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-sm font-medium text-muted-foreground">Room Details</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="room"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Number *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleRoomChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRooms.length > 0 ? (
                            availableRooms.map((room) => (
                              <SelectItem key={room.id} value={room.number}>
                                <div className="flex items-center justify-between gap-4">
                                  <span>Room {room.number}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {room.type} - ₹{room.rent}/mo
                                  </Badge>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-rooms" disabled>
                              No available rooms
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>Select an available room</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Upcoming">Upcoming</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Current booking status</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Tenant Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-sm font-medium text-muted-foreground">Tenant Information</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <FormField
                control={form.control}
                name="tenant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenant Name *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter tenant name"
                          {...field}
                          list="existing-tenants"
                          onChange={(e) => {
                            field.onChange(e);
                            handleTenantSelect(e.target.value);
                          }}
                        />
                        <datalist id="existing-tenants">
                          {existingTenants.map((tenant) => (
                            <option key={tenant.id} value={tenant.name} />
                          ))}
                        </datalist>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Type to search existing tenants or enter a new name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="tenant@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Booking Period Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-sm font-medium text-muted-foreground">Booking Period</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>Check-in date</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>Expected check-out date</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Financial Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-sm font-medium text-muted-foreground">Financial Details</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="monthlyRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Rent (₹) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5000"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securityDeposit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Deposit (₹) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10000"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="advance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Advance Payment (₹)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          min="0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-sm font-medium text-muted-foreground">Emergency Contact</span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Father, Mother" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px bg-border flex-1" />
                <span className="text-sm font-medium text-muted-foreground">
                  <Upload className="h-4 w-4 inline mr-2" />
                  Document URLs (Optional)
                </span>
                <div className="h-px bg-border flex-1" />
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="idProof"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Proof URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/id-proof.pdf"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Link to Aadhar, PAN, or any government ID
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="photoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Photo URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/photo.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Tenant's photograph</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreementUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agreement URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/agreement.pdf"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Rental agreement</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about the booking..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Special requirements, preferences, or important information
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {booking ? "Update Booking" : "Create Booking"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
