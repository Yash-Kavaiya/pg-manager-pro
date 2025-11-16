import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Bed, Users, DollarSign } from "lucide-react";

const Rooms = () => {
  const [rooms] = useState([
    { id: 1, number: "101", type: "Single", rent: 8000, deposit: 16000, status: "Occupied", floor: 1 },
    { id: 2, number: "102", type: "Double", rent: 12000, deposit: 24000, status: "Available", floor: 1 },
    { id: 3, number: "201", type: "Single", rent: 8500, deposit: 17000, status: "Occupied", floor: 2 },
    { id: 4, number: "202", type: "Double", rent: 12500, deposit: 25000, status: "Available", floor: 2 },
    { id: 5, number: "301", type: "Single", rent: 9000, deposit: 18000, status: "Maintenance", floor: 3 },
    { id: 6, number: "302", type: "Double", rent: 13000, deposit: 26000, status: "Occupied", floor: 3 },
  ]);

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
          <p className="text-muted-foreground">Manage your PG room inventory</p>
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
