import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { usePGContext } from "@/context/PGContext";
import { Booking } from "@/types/booking";
import { Calendar, Zap } from "lucide-react";
import { toast } from "sonner";

// Quick booking validation schema (minimal required fields)
const quickBookingSchema = z.object({
  room: z.string().min(1, "Room is required"),
  tenant: z.string().min(2, "Tenant name is required"),
  phone: z.string().min(10, "Phone number required"),
  startDate: z.string().min(1, "Start date is required"),
  monthlyRent: z.coerce.number().min(0, "Rent is required"),
});

type QuickBookingData = z.infer<typeof quickBookingSchema>;

interface QuickBookingCardProps {
  onBookingCreated?: (booking: Partial<Booking>) => void;
}

export function QuickBookingCard({ onBookingCreated }: QuickBookingCardProps) {
  const { rooms, selectedPG, tenants } = usePGContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<QuickBookingData>({
    resolver: zodResolver(quickBookingSchema),
    defaultValues: {
      room: "",
      tenant: "",
      phone: "",
      startDate: new Date().toISOString().split("T")[0],
      monthlyRent: 0,
    },
  });

  // Get available rooms
  const availableRooms = rooms.filter(
    (room) => room.pgId === selectedPG?.id && room.status === "Available"
  );

  // Get existing tenants for autocomplete
  const existingTenants = tenants.filter(
    (tenant) => tenant.pgId === selectedPG?.id && tenant.status === "Active"
  );

  const handleRoomChange = (roomNumber: string) => {
    const room = rooms.find((r) => r.number === roomNumber && r.pgId === selectedPG?.id);
    if (room) {
      form.setValue("monthlyRent", room.rent);
    }
  };

  const handleTenantChange = (tenantName: string) => {
    const tenant = existingTenants.find((t) => t.name === tenantName);
    if (tenant) {
      form.setValue("tenant", tenant.name);
      form.setValue("phone", tenant.phone);
    }
  };

  const onSubmit = async (data: QuickBookingData) => {
    setIsSubmitting(true);

    try {
      // Calculate end date (1 year from start by default)
      const startDate = new Date(data.startDate);
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);

      const room = rooms.find((r) => r.number === data.room && r.pgId === selectedPG?.id);

      const bookingData: Partial<Booking> = {
        room: data.room,
        tenant: data.tenant,
        phone: data.phone,
        startDate: data.startDate,
        endDate: endDate.toISOString().split("T")[0],
        status: "Pending",
        monthlyRent: data.monthlyRent,
        securityDeposit: room?.deposit || data.monthlyRent * 2, // Default to 2x rent
        payments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (onBookingCreated) {
        onBookingCreated(bookingData);
      }

      form.reset({
        room: "",
        tenant: "",
        phone: "",
        startDate: new Date().toISOString().split("T")[0],
        monthlyRent: 0,
      });

      toast.success("Quick booking created! You can edit it for more details.");
    } catch (error) {
      toast.error("Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedPG) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Booking
          </CardTitle>
          <CardDescription>
            Please select a PG property to create quick bookings
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5 text-primary" />
          Quick Booking
        </CardTitle>
        <CardDescription>
          Create a booking with essential details - edit later for more info
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Room *</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleRoomChange(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select room" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableRooms.length > 0 ? (
                        availableRooms.map((room) => (
                          <SelectItem key={room.id} value={room.number}>
                            <div className="flex items-center gap-2">
                              <span>Room {room.number}</span>
                              <Badge variant="secondary" className="text-xs">
                                ₹{room.rent}
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tenant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Tenant Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tenant name"
                      className="h-9"
                      {...field}
                      list="quick-existing-tenants"
                      onChange={(e) => {
                        field.onChange(e);
                        handleTenantChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <datalist id="quick-existing-tenants">
                    {existingTenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.name} />
                    ))}
                  </datalist>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Phone *</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="h-9"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Start Date *</FormLabel>
                  <FormControl>
                    <Input type="date" className="h-9" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="monthlyRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Monthly Rent (₹) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5000"
                      className="h-9"
                      min="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex gap-2 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => form.reset()}
            >
              Clear
            </Button>
            <Button
              type="submit"
              size="sm"
              className="flex-1"
              disabled={isSubmitting || availableRooms.length === 0}
            >
              <Calendar className="h-3 w-3 mr-1" />
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
