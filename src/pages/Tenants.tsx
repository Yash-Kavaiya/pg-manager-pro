import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Phone, Mail, Eye, Pencil, Trash2, Calendar, Home, Users, LayoutGrid, List, UserCheck, UserX, Clock, Filter } from "lucide-react";
import { usePGContext } from "@/context/PGContext";
import { Tenant } from "@/types";
import { toast } from "sonner";

const Tenants = () => {
  const { selectedPG, tenants: allTenants, rooms: allRooms, addTenant, updateTenant, deleteTenant } = usePGContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    room: "",
    phone: "",
    email: "",
    status: "Active" as "Active" | "Notice Period" | "Inactive",
    joinDate: new Date().toISOString().split('T')[0],
  });

  // Filter tenants for selected PG
  const tenants = useMemo(() => {
    return allTenants.filter(tenant => {
      if (selectedPG && tenant.pgId !== selectedPG.id) return false;

      const matchesSearch =
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.phone.includes(searchTerm) ||
        tenant.room.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || tenant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allTenants, selectedPG, searchTerm, statusFilter]);

  // Get available rooms for current PG
  const availableRooms = useMemo(() => {
    if (!selectedPG) return [];
    return allRooms.filter(room =>
      room.pgId === selectedPG.id &&
      (room.status === "Available" || (selectedTenant && room.number === selectedTenant.room))
    );
  }, [allRooms, selectedPG, selectedTenant]);

  // Stats
  const stats = useMemo(() => {
    const pgTenants = allTenants.filter(t => t.pgId === selectedPG?.id);
    return {
      total: pgTenants.length,
      active: pgTenants.filter(t => t.status === "Active").length,
      noticePeriod: pgTenants.filter(t => t.status === "Notice Period").length,
      inactive: pgTenants.filter(t => t.status === "Inactive").length,
    };
  }, [allTenants, selectedPG]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Notice Period": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Inactive": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getAvatarColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-gradient-to-br from-violet-500 to-indigo-600";
      case "Notice Period": return "bg-gradient-to-br from-amber-500 to-orange-600";
      case "Inactive": return "bg-gradient-to-br from-slate-400 to-slate-600";
      default: return "bg-primary";
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      room: "",
      phone: "",
      email: "",
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleAddTenant = () => {
    if (!selectedPG) return;

    addTenant({
      pgId: selectedPG.id,
      name: formData.name,
      room: formData.room,
      phone: formData.phone,
      email: formData.email,
      status: formData.status,
      joinDate: formData.joinDate,
    });

    toast.success("Tenant added successfully", {
      description: `${formData.name} has been added to Room ${formData.room}.`,
    });

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditTenant = () => {
    if (!selectedTenant) return;

    updateTenant(selectedTenant.id, {
      name: formData.name,
      room: formData.room,
      phone: formData.phone,
      email: formData.email,
      status: formData.status,
      joinDate: formData.joinDate,
    });

    toast.success("Tenant updated successfully", {
      description: `${formData.name}'s information has been updated.`,
    });

    setIsEditDialogOpen(false);
    setSelectedTenant(null);
    resetForm();
  };

  const handleDeleteTenant = () => {
    if (!selectedTenant) return;

    deleteTenant(selectedTenant.id);

    toast.success("Tenant removed", {
      description: `${selectedTenant.name} has been removed from the system.`,
    });

    setIsDeleteDialogOpen(false);
    setSelectedTenant(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      room: tenant.room,
      phone: tenant.phone,
      email: tenant.email,
      status: tenant.status,
      joinDate: tenant.joinDate,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsViewDialogOpen(true);
  };

  const openDeleteDialog = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setIsDeleteDialogOpen(true);
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.room.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.joinDate !== ""
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tenant Management</h1>
          <p className="text-muted-foreground">
            {selectedPG ? `${selectedPG.name} - ${tenants.length} tenants` : 'Select a property to view tenants'}
          </p>
        </div>
        <Button onClick={openAddDialog} disabled={!selectedPG} className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Stats Cards */}
      {selectedPG && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Users className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <UserCheck className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Notice Period</p>
                  <p className="text-2xl font-bold">{stats.noticePeriod}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-500/10">
                  <UserX className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold">{stats.inactive}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Notice Period">Notice Period</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8 w-8 p-0"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="h-8 w-8 p-0"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tenants Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tenants.map((tenant) => (
            <Card key={tenant.id} className="glass-card hover:shadow-lg transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 ring-2 ring-background shadow-md">
                      <AvatarFallback className={`${getAvatarColor(tenant.status)} text-white font-semibold`}>
                        {getInitials(tenant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-semibold">{tenant.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Home className="h-3 w-3" />
                        Room {tenant.room}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(tenant.status)}>
                    {tenant.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pb-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{tenant.phone}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  <span className="truncate">{tenant.email}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Joined: {formatDate(tenant.joinDate)}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex gap-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8"
                  onClick={() => openViewDialog(tenant)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => openEditDialog(tenant)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => openDeleteDialog(tenant)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Tenants Table View */}
      {viewMode === "table" && (
        <Card className="glass-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`${getAvatarColor(tenant.status)} text-white text-xs`}>
                            {getInitials(tenant.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{tenant.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{tenant.room}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                          {tenant.phone}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[150px]">{tenant.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(tenant.joinDate)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(tenant.status)}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openViewDialog(tenant)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditDialog(tenant)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => openDeleteDialog(tenant)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {tenants.length === 0 && (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No tenants found</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              {selectedPG
                ? searchTerm || statusFilter !== "All"
                  ? "No tenants match your search criteria. Try adjusting your filters."
                  : "Get started by adding your first tenant to this property."
                : "Please select a PG property to view and manage tenants."}
            </p>
            {selectedPG && !searchTerm && statusFilter === "All" && (
              <Button onClick={openAddDialog} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Tenant
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedTenant(null);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isAddDialogOpen ? "Add New Tenant" : "Edit Tenant"}</DialogTitle>
            <DialogDescription>
              {isAddDialogOpen
                ? "Fill in the details to add a new tenant to your property."
                : "Update the tenant information below."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter tenant's full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="room">Room</Label>
                <Select
                  value={formData.room}
                  onValueChange={(value) => setFormData({ ...formData, room: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {isEditDialogOpen && selectedTenant && (
                      <SelectItem value={selectedTenant.room}>
                        Room {selectedTenant.room} (Current)
                      </SelectItem>
                    )}
                    {availableRooms
                      .filter(room => !(isEditDialogOpen && selectedTenant && room.number === selectedTenant.room))
                      .map(room => (
                        <SelectItem key={room.id} value={room.number}>
                          Room {room.number} - {room.type}
                        </SelectItem>
                      ))}
                    {availableRooms.length === 0 && !isEditDialogOpen && (
                      <SelectItem value="" disabled>No rooms available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "Active" | "Notice Period" | "Inactive") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Notice Period">Notice Period</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+91 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="tenant@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setIsEditDialogOpen(false);
                setSelectedTenant(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isAddDialogOpen ? handleAddTenant : handleEditTenant}
              disabled={!isFormValid()}
              className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700"
            >
              {isAddDialogOpen ? "Add Tenant" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tenant Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedTenant?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedTenant && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16 ring-2 ring-background shadow-lg">
                  <AvatarFallback className={`${getAvatarColor(selectedTenant.status)} text-white text-xl font-semibold`}>
                    {getInitials(selectedTenant.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedTenant.name}</h3>
                  <Badge variant="outline" className={`${getStatusColor(selectedTenant.status)} mt-1`}>
                    {selectedTenant.status}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <Label className="text-muted-foreground text-xs uppercase">Room</Label>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Home className="h-4 w-4 text-primary" />
                      {selectedTenant.room}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <Label className="text-muted-foreground text-xs uppercase">Join Date</Label>
                    <p className="text-lg font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {formatDate(selectedTenant.joinDate)}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <Label className="text-muted-foreground text-xs uppercase">Phone</Label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    {selectedTenant.phone}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-muted/50">
                  <Label className="text-muted-foreground text-xs uppercase">Email</Label>
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    {selectedTenant.email}
                  </p>
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
              if (selectedTenant) openEditDialog(selectedTenant);
            }}>
              <Pencil className="h-3 w-3 mr-2" />
              Edit Tenant
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
              This will permanently remove <strong>{selectedTenant?.name}</strong> from the system.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTenant}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Tenant
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tenants;
