import { Link, useLocation } from "wouter";
import { 
  BarChart, 
  Truck, 
  CreditCard, 
  CheckSquare, 
  Route, 
  Users, 
  ShieldCheck, 
  FolderOpen, 
  Settings, 
  HelpCircle, 
  LogOut 
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const SidebarLink = ({ href, icon, children, active, onClick }: SidebarLinkProps) => {
  return (
    <Link href={href}>
      <button
        onClick={onClick}
        className={cn(
          "flex items-center space-x-1.5 px-3 py-1 text-neutral-light hover:bg-background w-full text-left transition-colors",
          active && "bg-primary/5 text-primary border-l-2 border-primary font-medium"
        )}
      >
        <span className="w-4 text-center">{icon}</span>
        <span className="text-[10px]">{children}</span>
      </button>
    </Link>
  );
};

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for the avatar
  const getInitials = () => {
    if (!user?.fullName) return "U";
    return user.fullName
      .split(" ")
      .map(name => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <aside className={cn(
      "bg-white border-r border-border-color transition-all flex flex-col h-full",
      collapsed ? "w-16" : "w-52" // Reduced width from w-20/w-64 to w-16/w-52
    )}>
      {/* Logo Area */}
      <div className="pt-3 px-3 border-b border-border-color pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white font-bold">
              <Truck size={14} />
            </div>
            {!collapsed && <span className="ml-2 font-semibold text-[11px]">Task Manager</span>}
          </div>
          <button 
            onClick={onToggle}
            className="text-neutral-light hover:text-neutral p-0.5 rounded-md hover:bg-gray-100"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="py-2 px-3 border-b border-border-color">
          <div className="flex items-center space-x-1.5">
            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-[10px]">
              {getInitials()}
            </div>
            <div>
              <div className="font-medium text-[10px]">{user?.fullName}</div>
              <div className="text-[10px] flex items-center">
                <span className={cn(
                  "text-white text-[8px] px-1 py-0.5 rounded-full",
                  user?.role === "admin" && "bg-primary",
                  user?.role === "manager" && "bg-secondary",
                  user?.role === "employee" && "bg-blue-500"
                )}>
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul>
          <li className={cn("px-3 py-0.5 text-[10px] text-neutral-light font-medium", collapsed && "text-center")}>
            {!collapsed ? "NAVIGATION" : "-"}
          </li>
          <li>
            <SidebarLink 
              href="/" 
              icon={<BarChart size={collapsed ? 18 : 16} />} 
              active={location === "/"}
            >
              {!collapsed && "Dashboard"}
            </SidebarLink>
          </li>
          <li>
            <SidebarLink 
              href="/shipments" 
              icon={<Truck size={collapsed ? 18 : 16} />} 
              active={location === "/shipments"}
            >
              {!collapsed && "Shipments"}
            </SidebarLink>
          </li>
          <li>
            <SidebarLink 
              href="/payments" 
              icon={<CreditCard size={collapsed ? 18 : 16} />} 
              active={location === "/payments"}
            >
              {!collapsed && "Payments"}
            </SidebarLink>
          </li>
          <li>
            <SidebarLink 
              href="/tracking" 
              icon={<Route size={collapsed ? 18 : 16} />} 
              active={location === "/tracking"}
            >
              {!collapsed && "Tracking"}
            </SidebarLink>
          </li>
          <li>
            <SidebarLink 
              href="/history" 
              icon={<FolderOpen size={collapsed ? 18 : 16} />} 
              active={location === "/history"}
            >
              {!collapsed && "History"}
            </SidebarLink>
          </li>

          {(user?.role === "admin" || user?.role === "manager") && (
            <>
              <li className={cn("px-3 py-0.5 mt-4 text-[10px] text-neutral-light font-medium", collapsed && "text-center")}>
                {!collapsed ? "MANAGEMENT" : "-"}
              </li>
              
              <li>
                <SidebarLink 
                  href="/clients" 
                  icon={<Users size={collapsed ? 18 : 16} />} 
                  active={location === "/clients"}
                >
                  {!collapsed && "Clients"}
                </SidebarLink>
              </li>
              <li>
                <SidebarLink 
                  href="/tasks" 
                  icon={<CheckSquare size={collapsed ? 18 : 16} />} 
                  active={location === "/tasks"}
                >
                  {!collapsed && "Tasks"}
                </SidebarLink>
              </li>
              <li>
                <SidebarLink 
                  href="/users" 
                  icon={<ShieldCheck size={collapsed ? 18 : 16} />} 
                  active={location === "/users"}
                >
                  {!collapsed && "Users & Roles"}
                </SidebarLink>
              </li>
              <li>
                <SidebarLink 
                  href="/settings" 
                  icon={<Settings size={collapsed ? 18 : 16} />} 
                  active={location === "/settings"}
                >
                  {!collapsed && "Settings"}
                </SidebarLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Footer */}
      <div className="py-1.5 px-2 border-t border-border-color">
        {!collapsed ? (
          <div className="flex items-center justify-between text-[10px] text-neutral-light">
            <Button 
              variant="ghost" 
              className="hover:text-primary p-0 h-auto flex items-center text-[10px] font-normal" 
              onClick={handleLogout}
            >
              <LogOut size={10} className="mr-1" />
              <span>Log out</span>
            </Button>
            <a href="#" className="hover:text-primary flex items-center">
              <HelpCircle size={10} className="mr-1" />
              <span>Help</span>
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-1.5 text-neutral-light">
            <Button 
              variant="ghost" 
              className="hover:text-primary p-0 h-auto" 
              onClick={handleLogout}
            >
              <LogOut size={12} />
            </Button>
            <a href="#" className="hover:text-primary">
              <HelpCircle size={12} />
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
