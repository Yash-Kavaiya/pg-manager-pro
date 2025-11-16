import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, DollarSign, Calendar } from "lucide-react";
import { usePGContext } from "@/context/PGContext";
import { useMemo } from "react";

const Dashboard = () => {
  const { selectedPG, rooms, bookings, payments, tenants } = usePGContext();

  // Filter data for selected PG
  const filteredRooms = useMemo(() =>
    rooms.filter(room => room.pgId === selectedPG?.id),
    [rooms, selectedPG]
  );

  const filteredBookings = useMemo(() =>
    bookings.filter(booking => booking.pgId === selectedPG?.id),
    [bookings, selectedPG]
  );

  const filteredPayments = useMemo(() =>
    payments.filter(payment => payment.pgId === selectedPG?.id),
    [payments, selectedPG]
  );

  const filteredTenants = useMemo(() =>
    tenants.filter(tenant => tenant.pgId === selectedPG?.id),
    [tenants, selectedPG]
  );

  // Calculate stats
  const totalRooms = filteredRooms.length;
  const occupiedRooms = filteredRooms.filter(room => room.status === "Occupied").length;
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  const totalRevenue = filteredRooms
    .filter(room => room.status === "Occupied")
    .reduce((sum, room) => sum + room.rent, 0);

  const pendingPayments = filteredPayments
    .filter(payment => payment.status === "Pending" || payment.status === "Overdue")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const tenantsInNoticePeriod = filteredTenants.filter(
    tenant => tenant.status === "Notice Period"
  ).length;

  const stats = [
    {
      title: "Total Rooms",
      value: totalRooms.toString(),
      subtitle: `${occupiedRooms} Occupied`,
      icon: Building2,
      color: "text-primary"
    },
    {
      title: "Occupancy Rate",
      value: `${occupancyRate}%`,
      subtitle: `${totalRooms - occupiedRooms} Available`,
      icon: Users,
      color: "text-accent"
    },
    {
      title: "Monthly Revenue",
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      subtitle: `₹${pendingPayments.toLocaleString('en-IN')} pending`,
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Notice Period",
      value: tenantsInNoticePeriod.toString(),
      subtitle: "Tenants leaving soon",
      icon: Calendar,
      color: "text-warning"
    }
  ];

  // Get recent bookings (last 3)
  const recentBookings = filteredBookings
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          {selectedPG ? `${selectedPG.name} - Overview` : 'Select a property to view dashboard'}
        </p>
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
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{booking.tenant}</p>
                    <p className="text-sm text-muted-foreground">Room {booking.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{booking.startDate}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === "Active"
                        ? "bg-success/10 text-success"
                        : booking.status === "Upcoming"
                        ? "bg-warning/10 text-warning"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No bookings found for this property
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
