import { useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { useLocation } from "wouter";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [location] = useLocation();

  // Set header title and description based on current route
  const getHeaderInfo = () => {
    switch (true) {
      case location === "/":
        return {
          title: "Dashboard",
          description: "Overview of your logistics operations"
        };
      case location.includes("/shipments"):
        return {
          title: "Shipments",
          description: "Manage and track all shipments"
        };
      case location.includes("/finances"):
        return {
          title: "Finances",
          description: "Manage payments, invoices, and financial reports"
        };
      case location.includes("/tasks"):
        return {
          title: "Task Management",
          description: "Organize and track all your tasks"
        };
      case location.includes("/tracking"):
        return {
          title: "Tracking",
          description: "Real-time tracking of active shipments"
        };
      case location.includes("/clients"):
        return {
          title: "Clients",
          description: "Manage client information and relationships"
        };
      case location.includes("/users"):
        return {
          title: "Users & Roles",
          description: "Manage user accounts and permissions"
        };
      case location.includes("/reports"):
        return {
          title: "Reports",
          description: "Generate and view business reports"
        };
      case location.includes("/settings"):
        return {
          title: "Settings",
          description: "Configure system preferences"
        };
      default:
        return {
          title: "Dashboard",
          description: "Overview of your logistics operations"
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <Header 
          title={headerInfo.title} 
          description={headerInfo.description} 
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
