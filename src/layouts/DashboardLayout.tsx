import React, { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  LayoutDashboardIcon, 
  ClipboardListIcon, 
  UsersIcon, 
  FileTextIcon,
  SettingsIcon,
  BellIcon,
  SearchIcon,
  PieChartIcon,
  LogOutIcon,
  MenuIcon,
  XIcon
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const NavItem = ({ to, icon, label, isCollapsed, isActive }: NavItemProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={to}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
              isCollapsed ? "justify-center" : "",
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-600"
            )}
          >
            {icon}
            {!isCollapsed && <span>{label}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right">
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboardIcon size={20} />, label: "Dashboard" },
    { to: "/estimates", icon: <ClipboardListIcon size={20} />, label: "Estimates" },
    { to: "/clients", icon: <UsersIcon size={20} />, label: "Clients" },
    { to: "/templates", icon: <FileTextIcon size={20} />, label: "Templates" },
    { to: "/analytics", icon: <PieChartIcon size={20} />, label: "Analytics" },
    { to: "/settings", icon: <SettingsIcon size={20} />, label: "Settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Sidebar (desktop) */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-20 hidden lg:flex flex-col border-r border-gray-100 bg-white/80 backdrop-blur-md transition-all duration-300",
          isCollapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        <div className={cn("p-4 flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EstimateAI</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500"
          >
            {isCollapsed ? <ChevronRightIcon size={18} /> : <ChevronLeftIcon size={18} />}
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-3">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                isCollapsed={isCollapsed}
                isActive={isActive(item.to)}
              />
            ))}
          </nav>
        </div>
        
        <div className="border-t border-gray-100 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full flex items-center gap-2 px-2",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user?.name || "User"}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[120px]">{user?.email || "user@example.com"}</span>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate('/settings/profile')}>
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/settings/subscription')}>
                Subscription
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onSelect={handleLogout}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
      
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed left-4 top-3 z-20"
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EstimateAI</span>
            </Link>
          </div>
          <div className="py-6 px-3">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                    isActive(item.to)
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-blue-50/50 hover:text-blue-600"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-100 p-4">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-2 justify-start px-2"
              onClick={handleLogout}
            >
              <LogOutIcon size={18} />
              <span>Log out</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main content area */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          "lg:ml-[70px]",
          !isCollapsed && "lg:ml-[240px]"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <div className="relative w-full max-w-md lg:max-w-xs hidden md:block">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search..." 
                  className="w-full pl-9 bg-gray-50 border-gray-100 focus:bg-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <BellIcon className="h-5 w-5 text-gray-600" />
              </Button>
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => navigate('/settings/profile')}>
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate('/settings/subscription')}>
                      Subscription
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" onSelect={handleLogout}>
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;