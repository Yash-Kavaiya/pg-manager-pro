import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, Home, IndianRupee, Activity } from "lucide-react";
import { usePGContext } from "@/context/PGContext";

const Dashboard = () => {
  const { selectedPG } = usePGContext();

  const stats = [
    {
      title: "Total Revenue",
      value: "₹45,231",
      change: "+20.1% from last month",
      icon: IndianRupee,
      trend: "up",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Occupancy Rate",
      value: "85%",
      change: "+4% from last month",
      icon: Users,
      trend: "up",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Active Rooms",
      value: "12",
      change: "-2 from last month",
      icon: Home,
      trend: "down",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Pending Dues",
      value: "₹12,450",
      change: "+15% from last month",
      icon: Activity,
      trend: "down",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
  ];

  const data = [
    { name: "Jan", total: 25000 },
    { name: "Feb", total: 28000 },
    { name: "Mar", total: 35000 },
    { name: "Apr", total: 32000 },
    { name: "May", total: 40000 },
    { name: "Jun", total: 45000 },
  ];

  const recentActivity = [
    {
      user: "Rahul Sharma",
      action: "Paid rent for Room 101",
      time: "2 hours ago",
      amount: "+₹12,000",
      initials: "RS",
    },
    {
      user: "Priya Patel",
      action: "New booking request",
      time: "4 hours ago",
      amount: "",
      initials: "PP",
    },
    {
      user: "Amit Kumar",
      action: "Reported maintenance issue",
      time: "5 hours ago",
      amount: "",
      initials: "AK",
    },
    {
      user: "Sneha Gupta",
      action: "Paid security deposit",
      time: "1 day ago",
      amount: "+₹15,000",
      initials: "SG",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Overview for {selectedPG?.name || "All Properties"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="glass-card border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="mr-1 h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-4 w-4 text-rose-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass-card border-none shadow-lg">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                    formatter={(value) => [`₹${value}`, "Revenue"]}
                  />
                  <Bar
                    dataKey="total"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary hover:fill-primary/80 transition-colors"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 glass-card border-none shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center group">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {item.initials}
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.action}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm">
                    {item.amount ? (
                      <span className="text-emerald-500">{item.amount}</span>
                    ) : (
                      <span className="text-muted-foreground">{item.time}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
