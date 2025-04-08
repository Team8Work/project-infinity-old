import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import StatCard from "@/components/dashboard/stat-card";
import TaskList from "@/components/tasks/task-list";
import ViewAllTasksModal from "@/components/tasks/view-all-tasks-modal";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Filter, 
  ClipboardCheck,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useAutoRefresh, refreshQueries } from "@/hooks/use-auto-refresh";
import { Task } from "@shared/schema";

export default function EmployeeDashboard() {
  const [activeTaskType, setActiveTaskType] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Set up auto-refresh for dashboard data
  useAutoRefresh(["/api/dashboard/stats", "/api/tasks"], 10000);

  // Manual refresh handler
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshQueries(["/api/dashboard/stats", "/api/tasks"]);
    
    // Show toast and reset refreshing state after a short delay
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dashboard refreshed",
        description: "Latest data has been loaded"
      });
    }, 500);
  };

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // All tasks from the API are already filtered to show only those assigned to the current user for employees
  const assignedTasks = tasks && Array.isArray(tasks) ? tasks : [];
  
  const pendingAssignedTasks = assignedTasks.filter((task) => task.status === "pending" || task.status === "in-progress");
  const completedAssignedTasks = assignedTasks.filter((task) => task.status === "completed");
  const overdueAssignedTasks = assignedTasks.filter((task) => {
    if (task.status !== "completed" && task.dueDate) {
      const dueDate = new Date(task.dueDate);
      return dueDate < new Date();
    }
    return false;
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-screen">
          <AlertTriangle className="w-12 h-12 text-danger mb-4" />
          <h2 className="text-xl font-bold">Error loading dashboard data</h2>
          <p className="text-neutral-light">Please try again or contact support</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-6 py-4">
        <div className="flex justify-between">
          <div>
            <h2 className="text-lg font-semibold">Employee Dashboard</h2>
            <p className="text-sm text-neutral-light">Welcome back, {user?.fullName}!</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* My Tasks Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <StatCard
            title="My Tasks"
            value={assignedTasks.length}
            icon={<ClipboardCheck />}
            className="bg-primary/10 text-primary"
          />
          <StatCard
            title="Pending Tasks"
            value={pendingAssignedTasks.length}
            icon={<Clock />}
            className="bg-warning/10 text-warning"
          />
          <StatCard
            title="Completed Tasks"
            value={completedAssignedTasks.length}
            icon={<CheckCircle />}
            className="bg-success/10 text-success"
          />
        </div>

        {/* Task Management Section - Focused on employee's tasks */}
        <div className="mt-6">
          <div className="bg-white rounded-lg border border-border shadow-sm">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold">My Tasks</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Today
                </Button>
                <Button variant="outline" size="sm">
                  This Week
                </Button>
                <Button variant="outline" size="sm" className="bg-primary/10 text-primary border-primary/20">
                  All
                </Button>
              </div>
            </div>
            <div className="p-5">
              {/* Task Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm text-primary">Pending</h4>
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                      {pendingAssignedTasks.filter((t) => t.status === "pending").length}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Tasks waiting to be started</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm text-blue-600">In Progress</h4>
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {pendingAssignedTasks.filter((t) => t.status === "in-progress").length}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Tasks currently in progress</div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm text-red-600">Overdue</h4>
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {overdueAssignedTasks.length}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Tasks past their due date</div>
                </div>
              </div>
              
              {/* Task Filters */}
              <div className="flex space-x-2 mb-4 overflow-x-auto">
                {/* Task filters with improved styling and click handling */}
                <Button 
                  variant={activeTaskType === null ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full text-xs"
                  onClick={() => setActiveTaskType(null)}
                >
                  All Tasks
                </Button>
                <Button 
                  variant={activeTaskType === "shipment" ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full text-xs"
                  onClick={() => setActiveTaskType("shipment")}
                >
                  <span className="mr-1">📦</span> Shipment
                </Button>
                <Button 
                  variant={activeTaskType === "payment" ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full text-xs"
                  onClick={() => setActiveTaskType("payment")}
                >
                  <span className="mr-1">💰</span> Payment
                </Button>
                <Button 
                  variant={activeTaskType === "damage" ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full text-xs"
                  onClick={() => setActiveTaskType("damage")}
                >
                  <span className="mr-1">🛠️</span> Damage
                </Button>
                <Button 
                  variant={activeTaskType === "complaint" ? "default" : "outline"} 
                  size="sm" 
                  className="rounded-full text-xs"
                  onClick={() => setActiveTaskType("complaint")}
                >
                  <span className="mr-1">📝</span> Complaint
                </Button>
              </div>

              {/* Display the employee's assigned tasks */}
              {pendingAssignedTasks.length > 0 ? (
                <TaskList 
                  tasks={pendingAssignedTasks} 
                  taskType={activeTaskType || undefined}
                  compact={false}
                />
              ) : (
                <div className="text-center py-10 border border-dashed rounded-md bg-muted/20">
                  <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium text-muted-foreground">No pending tasks!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You've completed all your assigned tasks. Great job!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="mt-6">
          <div className="bg-white rounded-lg border border-border shadow-sm">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold">Recently Completed</h3>
              <div className="flex space-x-2 items-center">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <ViewAllTasksModal 
                  trigger={
                    <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-white">
                      View All
                    </Button>
                  }
                  tasks={completedAssignedTasks || []}
                />
              </div>
            </div>
            <div className="p-5">
              {completedAssignedTasks.length > 0 ? (
                <TaskList 
                  tasks={completedAssignedTasks.slice(0, 5)} 
                  taskType={activeTaskType || undefined}
                  compact={true}
                />
              ) : (
                <div className="text-center py-6 border border-dashed rounded-md bg-muted/20">
                  <p className="text-sm text-muted-foreground">No completed tasks yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}