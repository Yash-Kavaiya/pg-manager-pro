import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone, Mail } from "lucide-react";

const Tenants = () => {
  const tenants = [
    { id: 1, name: "Rajesh Kumar", room: "101", phone: "+91 98765 43210", email: "rajesh@email.com", status: "Active", joinDate: "2024-01-15" },
    { id: 2, name: "Priya Sharma", room: "205", phone: "+91 98765 43211", email: "priya@email.com", status: "Active", joinDate: "2024-01-10" },
    { id: 3, name: "Amit Patel", room: "302", phone: "+91 98765 43212", email: "amit@email.com", status: "Notice Period", joinDate: "2024-01-08" },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tenant Management</h1>
          <p className="text-muted-foreground">Manage tenant profiles and information</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(tenant.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{tenant.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Room {tenant.room}</p>
                  </div>
                </div>
                <Badge variant={tenant.status === "Active" ? "default" : "secondary"}>
                  {tenant.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{tenant.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="truncate">{tenant.email}</span>
              </div>
              <p className="text-xs text-muted-foreground">Joined: {tenant.joinDate}</p>
              <div className="pt-2 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">View</Button>
                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tenants;
