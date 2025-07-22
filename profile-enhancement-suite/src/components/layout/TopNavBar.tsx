import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Settings,
  User,
  LogOut,
  HelpCircle,
  CreditCard,
  ChevronDown,
  ArrowLeft,
  Home
} from "lucide-react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function TopNavBar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Helper function to get user initials
  const getUserInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };
  
  // Check if we're in a route that has sidebar (dashboard routes)
  const hasSidebar = location.pathname.startsWith('/dashboard');
  
  // Only use useSidebar hook if we're in a sidebar context
  let sidebarState = null;
  try {
    if (hasSidebar) {
      sidebarState = useSidebar();
    }
  } catch {
    // Ignore error if not in sidebar context
  }

  const notifications = [
    { id: 1, message: "Resume optimization completed", type: "success", unread: true },
    { id: 2, message: "New job match found", type: "info", unread: true },
    { id: 3, message: "ATS score improved to 85%", type: "success", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {hasSidebar ? (
          <SidebarTrigger />
        ) : (
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
        )}
        <div className="hidden sm:block">
          {hasSidebar ? (
            <>
              <h1 className="text-lg font-semibold text-foreground">Resume AI Dashboard</h1>
              <p className="text-sm text-muted-foreground">Optimize your career potential</p>
            </>
          ) : (
            <Link to="/dashboard" className="block hover:opacity-80 transition-opacity">
              <h1 className="text-lg font-semibold text-foreground">Resume AI Dashboard</h1>
              <p className="text-sm text-muted-foreground">← Back to Dashboard</p>
            </Link>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Help Button */}
        <Button variant="ghost" size="icon" asChild>
          <Link to="/help">
            <HelpCircle className="w-5 h-5" />
          </Link>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                <div className="flex items-center gap-2 w-full">
                  <div className={`w-2 h-2 rounded-full ${
                    notification.type === 'success' ? 'bg-success' : 'bg-primary'
                  }`} />
                  <span className="text-sm flex-1">{notification.message}</span>
                  {notification.unread && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center">
              <span className="text-sm text-muted-foreground">View all notifications</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user ? getUserInitials(user.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium">{user?.full_name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.is_active ? 'Active' : 'Inactive'}</p>
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/billing" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="flex items-center gap-2 text-destructive cursor-pointer"
              onClick={() => logout()}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}