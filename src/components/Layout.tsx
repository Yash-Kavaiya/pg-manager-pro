import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  Building2, 
  LayoutDashboard, 
  Bed, 
  Calendar, 
  DollarSign, 
  Users, 
  Settings as SettingsIcon, 
  LogOut,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PGSelector } from "@/components/PGSelector";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Layout = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Bed, label: "Rooms", path: "/rooms" },
    { icon: Calendar, label: "Bookings", path: "/bookings" },
    { icon: DollarSign, label: "Payments", path: "/payments" },
    { icon: Users, label: "Tenants", path: "/tenants" },
    { icon: SettingsIcon, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border/50">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-lg tracking-tight">PG Manager</h2>
          <p className="text-xs text-sidebar-foreground/60 font-medium">Admin Workspace</p>
        </div>
      </div>

      <div className="p-4">
        <PGSelector />
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        <p className="px-2 text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-2">
          Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link key={item.path} to={item.path} onClick={() => setIsMobileOpen(false)}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start relative overflow-hidden transition-all duration-300",
                  active 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                )}
                <Icon className={cn("h-4 w-4 mr-3", active ? "text-primary" : "text-sidebar-foreground/50")} />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border/50">
        <Link to="/auth">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 fixed inset-y-0 z-50 border-r border-sidebar-border bg-sidebar shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-72 border-r border-sidebar-border bg-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 min-h-screen transition-all duration-300 ease-in-out">
        <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between md:justify-end">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <div className="flex items-center gap-4">
             {/* Add header actions here if needed */}
             <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                A
             </div>
          </div>
        </header>

        <div className="p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
