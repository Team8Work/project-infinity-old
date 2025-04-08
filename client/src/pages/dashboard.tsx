import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import StatCard from "@/components/dashboard/stat-card";
import TaskList from "@/components/tasks/task-list";
import CreateTaskModal from "@/components/tasks/create-task-modal";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Filter, 
  ClipboardCheck,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sample chart data
const taskCompletionData = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 59 },
  { name: "Mar", value: 80 },
  { name: "Apr", value: 81 },
  { name: "May", value: 56 },
  { name: "Jun", value: 90 },
];

const taskCategoryData = [
  { name: "Jan", value: 31000 },
  { name: "Feb", value: 40000 },
  { name: "Mar", value: 28000 },
  { name: "Apr", value: 51000 },
  { name: "May", value: 42000 },
  { name: "Jun", value: 82000 },
];

export default function Dashboard() {
  const [dateRange, setDateRange] = useState("last30days");

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/dashboard/stats"],
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
          <h2 className="text-lg font-semibold">Summary Statistics</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 Days
            </Button>
            <Button size="sm">
              Export
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <StatCard
            title="Total Tasks"
            value={stats?.tasks?.total || 0}
            change={5.2}
            changeText="from last month"
            positive={true}
            icon={<ClipboardCheck />}
            className="bg-primary/10 text-primary"
          />
          <StatCard
            title="Pending Tasks"
            value={stats?.tasks?.pending || 0}
            change={2.5}
            changeText="from last month"
            positive={false}
            icon={<Clock />}
            className="bg-warning/10 text-warning"
          />
          <StatCard
            title="Completed Tasks"
            value={stats?.tasks?.completed || 0}
            change={3.1}
            changeText="improvement"
            positive={true}
            icon={<ClipboardCheck />}
            className="bg-success/10 text-success"
          />
          <StatCard
            title="Completion Rate"
            value={`${stats?.tasks?.completionRate || 0}%`}
            change={1.8}
            changeText="from last month"
            positive={true}
            icon={<Clock />}
            className="bg-secondary/10 text-secondary"
          />
        </div>

        {/* Task Management Section - Moved up */}
        <div className="mt-6">
          <div className="bg-white rounded-lg border border-border shadow-sm">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold">Task Management</h3>
              <CreateTaskModal 
                triggerElement={
                  <Button size="sm" className="bg-primary text-white">
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
                    New Task
                  </Button>
                }
              />
            </div>
            <div className="p-5">
              {/* Task Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm text-primary">Pending</h4>
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">{stats?.tasks?.pending || 0}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Tasks waiting to be started</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm text-blue-600">In Progress</h4>
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">{stats?.tasks?.inProgress || 0}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Tasks currently in progress</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm text-green-600">Completed</h4>
                    <span className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">{stats?.tasks?.completed || 0}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Tasks successfully completed</div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm text-red-600">Overdue</h4>
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">{stats?.tasks?.overdue || 0}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Tasks past their due date</div>
                </div>
              </div>
              
              {/* Task Filters */}
              <div className="flex space-x-2 mb-4 overflow-x-auto">
                <Button variant="default" size="sm" className="rounded-full text-xs">
                  All Tasks
                </Button>
                <Button variant="outline" size="sm" className="rounded-full text-xs">
                  Shipment
                </Button>
                <Button variant="outline" size="sm" className="rounded-full text-xs">
                  Payment
                </Button>
                <Button variant="outline" size="sm" className="rounded-full text-xs">
                  Damage
                </Button>
                <Button variant="outline" size="sm" className="rounded-full text-xs">
                  Complaint
                </Button>
              </div>

              <TaskList tasks={stats?.pendingTasks || []} />
            </div>
            <div className="p-4 border-t border-border text-center">
              <Button variant="link">View All Tasks</Button>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="mt-6">
          <div className="bg-white rounded-lg border border-border shadow-sm">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold">Recent Tasks</h3>
              <div className="flex space-x-2 items-center">
                <div className="relative">
                  <Input 
                    placeholder="Filter tasks..." 
                    className="pl-9 h-9 text-sm" 
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
                <Button variant="outline" size="sm">
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-white">
                  View All
                </Button>
              </div>
            </div>
            <div className="p-5">
              <TaskList tasks={stats?.recentTasks || []} />
            </div>
          </div>
        </div>

        {/* Recent Shipments Section */}
        <div className="mt-6">
          <div className="bg-white rounded-lg border border-border shadow-sm">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold">Recent Shipments</h3>
              <div className="flex space-x-2 items-center">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-white">
                  View All
                </Button>
              </div>
            </div>
            <div className="p-5">
              {stats?.recentShipments && stats.recentShipments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="text-left p-3 font-medium">Tracking ID</th>
                        <th className="text-left p-3 font-medium">Origin</th>
                        <th className="text-left p-3 font-medium">Destination</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Due Date</th>
                        <th className="text-right p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stats.recentShipments.map((shipment: any) => (
                        <tr key={shipment.id} className="hover:bg-muted/50">
                          <td className="p-3">{shipment.trackingId}</td>
                          <td className="p-3">{shipment.origin}</td>
                          <td className="p-3">{shipment.destination}</td>
                          <td className="p-3">
                            <Badge variant={
                              shipment.status === 'delivered' ? 'outline' : 
                              shipment.status === 'delayed' ? 'destructive' : 
                              'default'
                            }>
                              {shipment.status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {shipment.dueDate ? new Date(shipment.dueDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="outline" size="sm">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="mb-2">
                    <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No recent shipments</h3>
                  <p className="text-muted-foreground mb-4">Recent shipments will appear here when created</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
