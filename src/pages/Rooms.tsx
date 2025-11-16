import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Bed, Users, DollarSign } from "lucide-react";
import { usePGContext } from "@/context/PGContext";

const Rooms = () => {
  const { selectedPG, rooms: allRooms } = usePGContext();

  // Filter rooms for selected PG
  const rooms = useMemo(() =>
    allRooms.filter(room => room.pgId === selectedPG?.id),
    [allRooms, selectedPG]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-success/10 text-success";
      case "Occupied": return "bg-primary/10 text-primary";
      case "Maintenance": return "bg-warning/10 text-warning";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Room Management</h1>
          <p className="text-muted-foreground">
            {selectedPG ? `${selectedPG.name} - ${rooms.length} rooms` : 'Select a property to view rooms'}
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Room {room.number}</CardTitle>
                  <p className="text-sm text-muted-foreground">Floor {room.floor}</p>
                </div>
                <Badge className={getStatusColor(room.status)}>
                  {room.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{room.type} Occupancy</span>
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>₹{room.rent.toLocaleString()}/month</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Deposit: ₹{room.deposit.toLocaleString()}</span>
              </div>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
