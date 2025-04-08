import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import StatCard from "@/components/dashboard/stat-card";
import ChartCard from "@/components/dashboard/chart-card";
import ShipmentTable from "@/components/shipments/shipment-table";
import TaskList from "@/components/tasks/task-list";
import { Loader2 } from "lucide-react";
import {
  TruckIcon,
  ClipboardCheck,
  AlertTriangle,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chart } from "@/components/ui/chart";

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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ChartCard title="Task Completion Trends">
            <div className="h-[300px]">
              <Chart
                type="bar"
                data={taskCompletionData}
                xDataKey="name"
                series={[
                  {
                    dataKey: "value",
                    name: "Completed Tasks",
                    color: "hsl(var(--primary))"
                  }
                ]}
                className="h-full"
                options={{
                  grid: true,
                  legend: false,
                  tooltip: true,
                  xAxis: true,
                  yAxis: true
                }}
              />
            </div>
          </ChartCard>
          <ChartCard title="Task Distribution by Type">
            <div className="h-[300px]">
              <Chart
                type="line"
                data={taskCategoryData}
                xDataKey="name"
                series={[
                  {
                    dataKey: "value",
                    name: "Tasks Count",
                    color: "hsl(var(--secondary))"
                  }
                ]}
                className="h-full"
                options={{
                  grid: true,
                  legend: false,
                  tooltip: true,
                  xAxis: true,
                  yAxis: true,
                  formatter: (value: number) => `${value.toLocaleString()}`
                }}
              />
            </div>
          </ChartCard>
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

        {/* Task Management and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-lg border border-border shadow-sm">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold">Task Management</h3>
              <Button size="sm">
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
            </div>
            <div className="p-5">
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

          <div className="bg-white rounded-lg border border-border shadow-sm">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold">Task Distribution by Team</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
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
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="p-2">
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
                  >
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14L21 3"></path>
                    <path d="M9 21H3v-6"></path>
                    <path d="M3 3l6 6"></path>
                  </svg>
                </Button>
              </div>
            </div>
            <div className="p-5">
              <div className="h-80 bg-gray-100 rounded-md relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-neutral-light">
                  <div className="text-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="48" 
                      height="48" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="mx-auto mb-3"
                    >
                      <rect x="18" y="3" width="4" height="18"></rect>
                      <rect x="10" y="8" width="4" height="13"></rect>
                      <rect x="2" y="13" width="4" height="8"></rect>
                    </svg>
                    <p>Task distribution by team<br />and completion metrics</p>
                    <Button className="mt-3">
                      View Detailed Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
