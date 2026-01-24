import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { usePGContext } from "@/context/PGContext";
import { toast } from "sonner";
import { Building2, MapPin, Phone, Mail, Save } from "lucide-react";

export function PropertySettings() {
  const { selectedPG, updatePG } = usePGContext();
  
  const [formData, setFormData] = useState({
    name: selectedPG?.name || "",
    address: selectedPG?.address || "",
    totalRooms: selectedPG?.totalRooms || 0,
    contactPhone: "",
    contactEmail: "",
    description: "",
    amenities: {
      wifi: true,
      parking: true,
      laundry: false,
      meals: false,
      ac: false,
      powerBackup: true,
    },
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity as keyof typeof prev.amenities],
      },
    }));
  };

  const handleSave = () => {
    if (!selectedPG) return;

    updatePG(selectedPG.id, {
      name: formData.name,
      address: formData.address,
      totalRooms: formData.totalRooms,
    });

    toast.success("Property settings saved successfully!");
  };

  if (!selectedPG) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please select a property to manage settings
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Update your property's basic details and information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="propertyName">Property Name *</Label>
              <Input
                id="propertyName"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter property name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalRooms">Total Rooms *</Label>
              <Input
                id="totalRooms"
                type="number"
                value={formData.totalRooms}
                onChange={(e) => handleInputChange("totalRooms", parseInt(e.target.value) || 0)}
                placeholder="Enter total rooms"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Enter complete address"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Brief description about your property"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>
            Manage contact details for your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                placeholder="contact@property.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities & Facilities</CardTitle>
          <CardDescription>
            Select the amenities available at your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="wifi">WiFi</Label>
                <p className="text-sm text-muted-foreground">High-speed internet</p>
              </div>
              <Switch
                id="wifi"
                checked={formData.amenities.wifi}
                onCheckedChange={() => handleAmenityToggle("wifi")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="parking">Parking</Label>
                <p className="text-sm text-muted-foreground">Vehicle parking space</p>
              </div>
              <Switch
                id="parking"
                checked={formData.amenities.parking}
                onCheckedChange={() => handleAmenityToggle("parking")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="laundry">Laundry</Label>
                <p className="text-sm text-muted-foreground">Washing facilities</p>
              </div>
              <Switch
                id="laundry"
                checked={formData.amenities.laundry}
                onCheckedChange={() => handleAmenityToggle("laundry")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="meals">Meals</Label>
                <p className="text-sm text-muted-foreground">Food service available</p>
              </div>
              <Switch
                id="meals"
                checked={formData.amenities.meals}
                onCheckedChange={() => handleAmenityToggle("meals")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="ac">Air Conditioning</Label>
                <p className="text-sm text-muted-foreground">AC in rooms</p>
              </div>
              <Switch
                id="ac"
                checked={formData.amenities.ac}
                onCheckedChange={() => handleAmenityToggle("ac")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="powerBackup">Power Backup</Label>
                <p className="text-sm text-muted-foreground">Generator/Inverter</p>
              </div>
              <Switch
                id="powerBackup"
                checked={formData.amenities.powerBackup}
                onCheckedChange={() => handleAmenityToggle("powerBackup")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Property Settings
        </Button>
      </div>
    </div>
  );
}
