import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Bed, Users, IndianRupee, Eye, Pencil, Trash2 } from "lucide-react";
import { usePGContext } from "@/context/PGContext";
import { Room } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const Rooms = () => {
  const { selectedPG, rooms: allRooms, setRooms } = usePGContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");

  // Form state
  const [formData, setFormData] = useState({
    number: "",
    type: "Single" as "Single" | "Double" | "Triple",
    rent: "",
    deposit: "",
    status: "Available" as "Occupied" | "Available" | "Maintenance",
    floor: "",
  });

  // Filter rooms for selected PG
  const rooms = allRooms.filter(room => {
    if (selectedPG && room.pgId !== selectedPG.id) return false;

    const matchesSearch = room.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || room.status === statusFilter;
    const matchesType = typeFilter === "All" || room.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Occupied": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Maintenance": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const resetForm = () => {
    setFormData({
      number: "",
      type: "Single",
      rent: "",
      deposit: "",
      status: "Available",
      floor: "",
    });
  };

  const handleAddRoom = () => {
    if (!selectedPG) return;

    const newRoom: Room = {
      id: Math.max(...allRooms.map(r => r.id), 0) + 1,
      pgId: selectedPG.id,
      number: formData.number,
      type: formData.type,
      rent: parseFloat(formData.rent),
      deposit: parseFloat(formData.deposit),
      status: formData.status,
      floor: parseInt(formData.floor),
    };

    setRooms([...allRooms, newRoom]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditRoom = () => {
    if (!selectedRoom) return;

    const updatedRooms = allRooms.map(room =>
      room.id === selectedRoom.id
        ? {
          ...room,
          number: formData.number,
          type: formData.type,
          rent: parseFloat(formData.rent),
          deposit: parseFloat(formData.deposit),
          status: formData.status,
          floor: parseInt(formData.floor),
        }
        : room
    );

    setRooms(updatedRooms);
    setIsEditDialogOpen(false);
    setSelectedRoom(null);
    resetForm();
  };

  const handleDeleteRoom = () => {
    if (!selectedRoom) return;

    const updatedRooms = allRooms.filter(room => room.id !== selectedRoom.id);
    setRooms(updatedRooms);
    setIsDeleteDialogOpen(false);
    setSelectedRoom(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      number: room.number,
      type: room.type,
      rent: room.rent.toString(),
      deposit: room.deposit.toString(),
      status: room.status,
      floor: room.floor.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (room: Room) => {
    setSelectedRoom(room);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteDialogOpen(true);
  };

  const isFormValid = () => {
    return (
      formData.number.trim() !== "" &&
      formData.rent !== "" &&
      parseFloat(formData.rent) > 0 &&
      formData.deposit !== "" &&
      parseFloat(formData.deposit) > 0 &&
      formData.floor !== "" &&
      parseInt(formData.floor) > 0
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Room Management</h1>
          <p className="text-muted-foreground">
            {selectedPG ? `${selectedPG.name} - ${rooms.length} rooms` : 'Select a property to view rooms'}
          </p>
        </div>
        <Button onClick={openAddDialog} disabled={!selectedPG}>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Occupied">Occupied</SelectItem>
            <SelectItem value="Maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Types</SelectItem>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="Double">Double</SelectItem>
            <SelectItem value="Triple">Triple</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rooms.map((room) => (
          <Card key={room.id} className="glass-card hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold">Room {room.number}</CardTitle>
                  <p className="text-sm text-muted-foreground">Floor {room.floor}</p>
                </div>
                <Badge variant="outline" className={getStatusColor(room.status)}>
                  {room.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-2">
              <div className="flex items-center text-sm">
                <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{room.type} Occupancy</span>
              </div>
              <div className="flex items-center text-sm">
                <IndianRupee className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>₹{room.rent.toLocaleString()}/month</span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Deposit: ₹{room.deposit.toLocaleString()}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-8"
                onClick={() => openViewDialog(room)}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => openEditDialog(room)}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                onClick={() => openDeleteDialog(room)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {selectedPG
              ? "No rooms found matching your filters."
              : "Please select a PG property to view rooms."}
          </p>
        </div>
      )}

      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? "Add New Room" : "Edit Room"}</DialogTitle>
            <DialogDescription>
              {isAddDialogOpen
                ? "Fill in the details to add a new room to your property."
                : "Update the room details below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="number">Room Number</Label>
              <Input
                id="number"
                placeholder="e.g., 101, A-1, etc."
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Room Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "Single" | "Double" | "Triple") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Double">Double</SelectItem>
                  <SelectItem value="Triple">Triple</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                placeholder="e.g., 1, 2, 3"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rent">Monthly Rent (₹)</Label>
              <Input
                id="rent"
                type="number"
                placeholder="e.g., 8000"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deposit">Security Deposit (₹)</Label>
              <Input
                id="deposit"
                type="number"
                placeholder="e.g., 16000"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "Occupied" | "Available" | "Maintenance") =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Occupied">Occupied</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isAddDialogOpen ? handleAddRoom : handleEditRoom}
              disabled={!isFormValid()}
            >
              {isAddDialogOpen ? "Add Room" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Room Details</DialogTitle>
            <DialogDescription>
              Complete information about Room {selectedRoom?.number}
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Room Number</Label>
                  <p className="text-lg font-semibold">{selectedRoom.number}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Floor</Label>
                  <p className="text-lg font-semibold">{selectedRoom.floor}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="text-lg font-semibold">{selectedRoom.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant="outline" className={getStatusColor(selectedRoom.status)}>
                    {selectedRoom.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Monthly Rent</Label>
                  <p className="text-lg font-semibold">₹{selectedRoom.rent.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Security Deposit</Label>
                  <p className="text-lg font-semibold">₹{selectedRoom.deposit.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false);
              if (selectedRoom) openEditDialog(selectedRoom);
            }}>
              <Pencil className="h-3 w-3 mr-2" />
              Edit Room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete Room {selectedRoom?.number}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoom} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Rooms;
