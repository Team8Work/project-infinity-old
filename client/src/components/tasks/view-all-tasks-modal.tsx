import { useState } from "react";
import { Task } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskList from "./task-list";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ViewAllTasksModalProps {
  trigger: React.ReactNode;
  tasks: Task[];
}

export default function ViewAllTasksModal({ trigger, tasks }: ViewAllTasksModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filter tasks based on search query and status
  const filteredTasks = tasks.filter(task => {
    // Apply search query filter
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = !statusFilter || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter tasks based on tab selection
  const getTasksByType = (type: string) => {
    if (type === "all") return filteredTasks;
    return filteredTasks.filter(task => task.type === type);
  };

  // Get task counts for tabs
  const getCountByType = (type: string) => {
    if (type === "all") return filteredTasks.length;
    return filteredTasks.filter(task => task.type === type).length;
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };
  
  // Clear filters
  const clearFilters = () => {
    setStatusFilter(null);
  };
  
  // Get display name for a status
  const getStatusDisplayName = (status: string | null) => {
    if (!status) return "All Statuses";
    
    const statusMap: Record<string, string> = {
      "pending": "Pending",
      "in-progress": "In Progress",
      "completed": "Completed",
      "cancelled": "Cancelled"
    };
    
    return statusMap[status] || status;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[85vw] md:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>All Tasks</DialogTitle>
          <DialogDescription>
            View and manage all tasks in the system
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-3 mb-4 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search tasks..."
              className="pl-9 pr-9 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1 h-7 w-7" 
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {statusFilter && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 text-xs flex items-center gap-1" 
                onClick={clearFilters}
              >
                <Badge className="px-1.5 py-0 gap-1 text-xs font-normal">
                  Status: {getStatusDisplayName(statusFilter)}
                  <X className="h-3 w-3" />
                </Badge>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 h-9 whitespace-nowrap">
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter(null)}
                    className={statusFilter === null ? "bg-accent text-accent-foreground" : ""}
                  >
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("pending")}
                    className={statusFilter === "pending" ? "bg-accent text-accent-foreground" : ""}
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("in-progress")}
                    className={statusFilter === "in-progress" ? "bg-accent text-accent-foreground" : ""}
                  >
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("completed")}
                    className={statusFilter === "completed" ? "bg-accent text-accent-foreground" : ""}
                  >
                    Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("cancelled")}
                    className={statusFilter === "cancelled" ? "bg-accent text-accent-foreground" : ""}
                  >
                    Cancelled
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="mb-4 overflow-x-auto pb-1 -mx-1">
            <TabsList className="inline-flex min-w-full px-1 w-auto grid-cols-7 grid-rows-1 sm:grid">
              <TabsTrigger value="all" className="relative">
                All
                <Badge variant="secondary" className="ml-1 absolute -right-1.5 -top-1.5 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {getCountByType("all")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="shipment" className="relative">
                Shipment
                <Badge variant="secondary" className="ml-1 absolute -right-1.5 -top-1.5 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {getCountByType("shipment")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="payment" className="relative">
                Payment
                <Badge variant="secondary" className="ml-1 absolute -right-1.5 -top-1.5 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {getCountByType("payment")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="damage" className="relative">
                Damage
                <Badge variant="secondary" className="ml-1 absolute -right-1.5 -top-1.5 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {getCountByType("damage")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="complaint" className="relative">
                Complaint
                <Badge variant="secondary" className="ml-1 absolute -right-1.5 -top-1.5 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {getCountByType("complaint")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="general" className="relative">
                General
                <Badge variant="secondary" className="ml-1 absolute -right-1.5 -top-1.5 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {getCountByType("general")}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="report" className="relative">
                Report
                <Badge variant="secondary" className="ml-1 absolute -right-1.5 -top-1.5 text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {getCountByType("report")}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 pb-2">
            <TabsContent value="all" className="mt-0">
              <TaskList tasks={getTasksByType("all")} />
            </TabsContent>
            <TabsContent value="shipment" className="mt-0">
              <TaskList tasks={getTasksByType("shipment")} taskType="shipment" />
            </TabsContent>
            <TabsContent value="payment" className="mt-0">
              <TaskList tasks={getTasksByType("payment")} taskType="payment" />
            </TabsContent>
            <TabsContent value="damage" className="mt-0">
              <TaskList tasks={getTasksByType("damage")} taskType="damage" />
            </TabsContent>
            <TabsContent value="complaint" className="mt-0">
              <TaskList tasks={getTasksByType("complaint")} taskType="complaint" />
            </TabsContent>
            <TabsContent value="general" className="mt-0">
              <TaskList tasks={getTasksByType("general")} taskType="general" />
            </TabsContent>
            <TabsContent value="report" className="mt-0">
              <TaskList tasks={getTasksByType("report")} taskType="report" />
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}