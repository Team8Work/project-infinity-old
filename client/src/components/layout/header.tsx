import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Settings, Search } from "lucide-react";
import { Link, useLocation } from "wouter";

interface HeaderProps {
  title?: string;
  description?: string;
}

export default function Header({ title = "Dashboard", description = "Overview of your logistics operations" }: HeaderProps) {
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
      <div className="flex items-center justify-between px-6 py-3">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-neutral-light">{description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light h-4 w-4" />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="relative p-2 text-neutral-light hover:text-neutral"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="p-2 text-neutral-light hover:text-neutral"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border-color px-6 overflow-x-auto">
        <Link href="/">
          <a className={`px-4 py-3 text-sm font-medium ${isActiveTab("/") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Overview
          </a>
        </Link>
        <Link href="/performance">
          <a className={`px-4 py-3 text-sm font-medium ${isActiveTab("/performance") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Performance
          </a>
        </Link>
        <Link href="/analytics">
          <a className={`px-4 py-3 text-sm font-medium ${isActiveTab("/analytics") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Analytics
          </a>
        </Link>
        <Link href="/reports">
          <a className={`px-4 py-3 text-sm font-medium ${isActiveTab("/reports") ? "border-b-2 border-primary text-primary" : "text-neutral-light hover:text-neutral"}`}>
            Reports
          </a>
        </Link>
      </div>
    </header>
  );
}
