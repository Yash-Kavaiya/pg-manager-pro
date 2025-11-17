import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Bed, Users, DollarSign, Eye, Pencil, Trash2, Search } from "lucide-react";
import { usePGContext } from "@/context/PGContext";
import { Room } from "@/types";

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
  const rooms = useMemo(() => {
    let filtered = allRooms.filter(room => room.pgId === selectedPG?.id);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter(room => room.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "All") {
      filtered = filtered.filter(room => room.type === typeFilter);
    }

    return filtered;
  }, [allRooms, selectedPG, searchTerm, statusFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-success/10 text-success";
      case "Occupied": return "bg-primary/10 text-primary";
      case "Maintenance": return "bg-warning/10 text-warning";
      default: return "bg-muted text-muted-foreground";
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
      <div className="flex justify-between items-center">
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

      {/* Search and Filter Section */}
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

      {/* Room Cards Grid */}
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
              <div className="pt-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openViewDialog(room)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(room)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDeleteDialog(room)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {selectedPG
              ? "No rooms found. Add your first room to get started."
              : "Please select a PG property to view rooms."}
          </p>
        </div>
      )}

      {/* Add/Edit Room Dialog */}
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

      {/* View Room Details Dialog */}
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
                  <Badge className={getStatusColor(selectedRoom.status)}>
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

      {/* Delete Confirmation Dialog */}
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
