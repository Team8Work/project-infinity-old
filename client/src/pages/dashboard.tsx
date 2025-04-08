import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import StatCard from "@/components/dashboard/stat-card";
import ChartCard from "@/components/dashboard/chart-card";
import ShipmentTable from "@/components/shipments/shipment-table";
import TaskList from "@/components/tasks/task-list";
import { Loader2 } from "lucide-react";
import {
  TruckIcon,
  DollarSign,
  AlertTriangle,
  Clock,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Sample chart data
const shipmentVolumeData = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 59 },
  { name: "Mar", value: 80 },
  { name: "Apr", value: 81 },
  { name: "May", value: 56 },
  { name: "Jun", value: 90 },
];

const revenueData = [
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
            title="Active Shipments"
            value={stats?.activeShipments || 0}
            change={8.2}
            changeText="from last month"
            positive={true}
            icon={<TruckIcon />}
            className="bg-primary/10 text-primary"
          />
          <StatCard
            title="Pending Payments"
            value={`$${(stats?.pendingPayments || 0).toLocaleString()}`}
            change={2.5}
            changeText="from last month"
            positive={false}
            icon={<DollarSign />}
            className="bg-warning/10 text-warning"
          />
          <StatCard
            title="Damage Reports"
            value={stats?.damageReports || 0}
            change={3.1}
            changeText="improvement"
            positive={true}
            icon={<AlertTriangle />}
            className="bg-danger/10 text-danger"
          />
          <StatCard
            title="On-Time Delivery"
            value={`${stats?.onTimeDelivery || 0}%`}
            change={1.8}
            changeText="from last month"
            positive={true}
            icon={<Clock />}
            className="bg-secondary/10 text-secondary"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ChartCard title="Shipment Volume">
            <div className="h-[300px]">
              <div className="h-full w-full">
                <div className="chart-container h-full">
                  <div className="h-full w-full">
                    <div className="h-full">
                      <div className="h-full">
                        <div className="h-full">
                          <div className="h-full">
                            <div className="h-full">
                              <div className="h-full">
                                <div className="h-full">
                                  <chart.Chart
                                    type="bar"
                                    data={shipmentVolumeData}
                                    xDataKey="name"
                                    series={[
                                      {
                                        dataKey: "value",
                                        name: "Shipments",
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ChartCard>
          <ChartCard title="Revenue Trends">
            <div className="h-[300px]">
              <chart.Chart
                type="line"
                data={revenueData}
                xDataKey="name"
                series={[
                  {
                    dataKey: "value",
                    name: "Revenue",
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
                  formatter: (value) => `$${value.toLocaleString()}`
                }}
              />
            </div>
          </ChartCard>
        </div>

        {/* Recent Shipments */}
        <div className="mt-6">
          <div className="bg-white rounded-lg border border-border shadow-sm">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="font-semibold">Recent Shipments</h3>
              <div className="flex space-x-2 items-center">
                <div className="relative">
                  <Input 
                    placeholder="Filter shipments..." 
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
            <ShipmentTable
              shipments={stats?.recentShipments || []}
              isLoading={isLoading}
            />
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
              <h3 className="font-semibold">Active Shipment Map</h3>
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
            <div className="p-2">
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
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
                      <line x1="9" y1="3" x2="9" y2="18"></line>
                      <line x1="15" y1="6" x2="15" y2="21"></line>
                    </svg>
                    <p>Interactive logistics map showing<br />global shipment routes</p>
                    <Button className="mt-3">
                      Load Map View
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
