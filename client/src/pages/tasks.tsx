import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import TaskList from "@/components/tasks/task-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertTriangle, Plus, CalendarDays } from "lucide-react";
import { useState } from "react";

export default function Tasks() {
  const [filter, setFilter] = useState("");
  const [taskType, setTaskType] = useState("all");

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["/api/tasks"],
  });

  const filteredTasks = tasks 
    ? tasks.filter(task => {
        const matchesFilter = filter 
          ? (task.title?.toLowerCase().includes(filter.toLowerCase()) ||
             task.description?.toLowerCase().includes(filter.toLowerCase()))
          : true;
        
        const matchesType = taskType !== "all" 
          ? task.type === taskType
          : true;
        
        return matchesFilter && matchesType;
      })
    : [];

  // Group tasks by status
  const pendingTasks = filteredTasks.filter(task => task.status === "pending");
  const inProgressTasks = filteredTasks.filter(task => task.status === "in-progress");
  const completedTasks = filteredTasks.filter(task => task.status === "completed");

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
          <h2 className="text-xl font-bold">Error loading tasks data</h2>
          <p className="text-neutral-light">Please try again or contact support</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Task Management</h1>
            <p className="text-neutral-light">Organize and track all your tasks</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <Plus size={16} className="mr-2" />
              Create Task
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter tasks by type, due date, or search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Search</label>
                <div className="relative">
                  <Input
                    placeholder="Search tasks..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-9"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light">
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
                      className="lucide lucide-search"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Task Type</label>
                <Select value={taskType} onValueChange={setTaskType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="shipment">Shipment</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="damage">Damage</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Due Date</label>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarDays size={16} className="mr-2" />
                  <span>Select due date</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="pending" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingTasks.length})
              </TabsTrigger>
              <TabsTrigger value="in-progress">
                In Progress ({inProgressTasks.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedTasks.length})
              </TabsTrigger>
            </TabsList>
            <Select defaultValue="date-asc">
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-asc">Due Date (Oldest first)</SelectItem>
                <SelectItem value="date-desc">Due Date (Newest first)</SelectItem>
                <SelectItem value="priority-high">Priority (High to Low)</SelectItem>
                <SelectItem value="priority-low">Priority (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="pending">
            <Card>
              <CardContent className="pt-6">
                {pendingTasks.length > 0 ? (
                  <TaskList tasks={pendingTasks} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-neutral-light">No pending tasks found</p>
                  </div>
                )}
              </CardContent>
              {pendingTasks.length > 0 && (
                <CardFooter className="border-t border-border p-4 flex justify-between">
                  <p className="text-sm text-neutral-light">
                    Showing {pendingTasks.length} tasks
                  </p>
                  <Button variant="outline" size="sm">
                    Load More
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="in-progress">
            <Card>
              <CardContent className="pt-6">
                {inProgressTasks.length > 0 ? (
                  <TaskList tasks={inProgressTasks} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-neutral-light">No in-progress tasks found</p>
                  </div>
                )}
              </CardContent>
              {inProgressTasks.length > 0 && (
                <CardFooter className="border-t border-border p-4 flex justify-between">
                  <p className="text-sm text-neutral-light">
                    Showing {inProgressTasks.length} tasks
                  </p>
                  <Button variant="outline" size="sm">
                    Load More
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardContent className="pt-6">
                {completedTasks.length > 0 ? (
                  <TaskList tasks={completedTasks} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-neutral-light">No completed tasks found</p>
                  </div>
                )}
              </CardContent>
              {completedTasks.length > 0 && (
                <CardFooter className="border-t border-border p-4 flex justify-between">
                  <p className="text-sm text-neutral-light">
                    Showing {completedTasks.length} tasks
                  </p>
                  <Button variant="outline" size="sm">
                    Load More
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
