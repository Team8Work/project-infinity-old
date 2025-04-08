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
      <div className="flex items-center justify-between px-6 py-2">
        <div>
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="text-xs text-neutral-light">{description}</p>
        </div>
        <div className="flex items-center space-x-3">
          <CreateTaskModal 
            triggerElement={
              <Button variant="default" size="sm" className="bg-primary text-white">
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
                  Create Task
                </span>
              </Button>
            }
          />
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search tasks..."
              className="pl-9 pr-4 py-1 h-8 text-sm w-48"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light h-3 w-3" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative p-1.5 text-neutral-light hover:text-neutral"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-1.5 text-neutral-light hover:text-neutral"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border-color px-6 overflow-x-auto">
        <Link href="/">
          <a className={`px-4 py-2 text-sm font-medium ${isActiveTab("/") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Overview
          </a>
        </Link>
        <Link href="/performance">
          <a className={`px-4 py-2 text-sm font-medium ${isActiveTab("/performance") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Performance
          </a>
        </Link>
        <Link href="/analytics">
          <a className={`px-4 py-2 text-sm font-medium ${isActiveTab("/analytics") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Analytics
          </a>
        </Link>
        <Link href="/reports">
          <a className={`px-4 py-2 text-sm font-medium ${isActiveTab("/reports") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Reports
          </a>
        </Link>
        <Link href="/history">
          <a className={`px-4 py-2 text-sm font-medium ${isActiveTab("/history") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            History
          </a>
        </Link>
      </div>
    </header>
  );
}
