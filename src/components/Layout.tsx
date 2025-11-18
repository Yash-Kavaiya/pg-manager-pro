import { Outlet, Link, useLocation } from "react-router-dom";
import { Building2, LayoutDashboard, Bed, Calendar, DollarSign, Users, Settings as SettingsIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PGSelector } from "@/components/PGSelector";

const Layout = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Bed, label: "Rooms", path: "/rooms" },
    { icon: Calendar, label: "Bookings", path: "/bookings" },
    { icon: DollarSign, label: "Payments", path: "/payments" },
    { icon: Users, label: "Tenants", path: "/tenants" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r bg-card">
        <div className="flex items-center gap-2 p-6 border-b">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h2 className="font-bold text-lg">PG Manager</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>

        <div className="p-4 border-b">
          <PGSelector />
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <Link to="/auth">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
