import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Settings, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import CreateTaskModal from "@/components/tasks/create-task-modal";

interface HeaderProps {
  title?: string;
  description?: string;
}

export default function Header({ title = "Dashboard", description = "Task Management System" }: HeaderProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  // Determine active tab based on location
  const isActiveTab = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-border-color">
      <div className="flex items-center justify-between px-4 py-1">
        <div className="flex items-center">
          <h1 className="text-base font-semibold mr-2">{title}</h1>
          <p className="text-xs text-neutral-light hidden md:block">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <CreateTaskModal 
            triggerElement={
              <Button variant="default" size="sm" className="bg-primary text-white h-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span className="text-xs">New Task</span>
              </Button>
            }
          />
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-7 pr-2 h-8 text-xs w-40"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-light h-3 w-3" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative p-1 text-neutral-light hover:text-neutral h-8 w-8"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-danger rounded-full"></span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-1 text-neutral-light hover:text-neutral h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex px-4 overflow-x-auto">
        <Link href="/">
          <a className={`px-3 py-1.5 text-xs font-medium ${isActiveTab("/") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Dashboard
          </a>
        </Link>
        <Link href="/shipments">
          <a className={`px-3 py-1.5 text-xs font-medium ${isActiveTab("/shipments") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Shipments
          </a>
        </Link>
        <Link href="/payments">
          <a className={`px-3 py-1.5 text-xs font-medium ${isActiveTab("/payments") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Payments
          </a>
        </Link>
        <Link href="/tracking">
          <a className={`px-3 py-1.5 text-xs font-medium ${isActiveTab("/tracking") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Tracking
          </a>
        </Link>
        <Link href="/history">
          <a className={`px-3 py-1.5 text-xs font-medium ${isActiveTab("/history") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            History
          </a>
        </Link>
      </div>
    </header>
  );
}
