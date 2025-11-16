import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";
import { usePGContext } from "@/context/PGContext";

const Bookings = () => {
  const { selectedPG, bookings: allBookings } = usePGContext();

  // Filter bookings for selected PG
  const bookings = useMemo(() =>
    allBookings.filter(booking => booking.pgId === selectedPG?.id),
    [allBookings, selectedPG]
  );

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-success/10 text-success" : "bg-primary/10 text-primary";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-muted-foreground">
            {selectedPG ? `${selectedPG.name} - ${bookings.length} bookings` : 'Select a property to view bookings'}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            All Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">Room {booking.room}</h3>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{booking.tenant}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {booking.startDate} to {booking.endDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bookings;
