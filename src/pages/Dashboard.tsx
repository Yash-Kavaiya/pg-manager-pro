import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, DollarSign, Calendar } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Rooms",
      value: "24",
      subtitle: "18 Occupied",
      icon: Building2,
      color: "text-primary"
    },
    {
      title: "Occupancy Rate",
      value: "75%",
      subtitle: "+5% from last month",
      icon: Users,
      color: "text-accent"
    },
    {
      title: "Monthly Revenue",
      value: "₹2,45,000",
      subtitle: "₹15k pending",
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Upcoming Vacates",
      value: "3",
      subtitle: "This month",
      icon: Calendar,
      color: "text-warning"
    }
  ];

  const recentBookings = [
    { id: 1, tenant: "Rajesh Kumar", room: "101", date: "2024-01-15", status: "Active" },
    { id: 2, tenant: "Priya Sharma", room: "205", date: "2024-01-10", status: "Active" },
    { id: 3, tenant: "Amit Patel", room: "302", date: "2024-01-08", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your property overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{booking.tenant}</p>
                  <p className="text-sm text-muted-foreground">Room {booking.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{booking.date}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    booking.status === "Active" 
                      ? "bg-success/10 text-success" 
                      : "bg-warning/10 text-warning"
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
