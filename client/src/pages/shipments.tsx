import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import ShipmentTable from "@/components/shipments/shipment-table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertTriangle, Plus, Filter, Calendar, CheckCircle2, Clock8, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateTaskModal from "@/components/tasks/create-task-modal";

export default function Shipments() {
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("shipments");

  const { data: shipments, isLoading: shipmentsLoading, error: shipmentsError } = useQuery({
    queryKey: ["/api/shipments"],
  });

  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ["/api/tasks"],
  });

  // Filter shipment tasks - tasks with type "shipment"
  const shipmentTasks = tasks ? tasks.filter(task => task.type === "shipment") : [];

  // Filter shipments based on user-selected filters
  const filteredShipments = shipments 
    ? shipments.filter(shipment => {
        const matchesFilter = filter 
          ? (shipment.trackingId?.toLowerCase().includes(filter.toLowerCase()) ||
             shipment.origin?.toLowerCase().includes(filter.toLowerCase()) ||
             shipment.destination?.toLowerCase().includes(filter.toLowerCase()))
          : true;
        
        const matchesStatus = status !== "all" 
          ? shipment.status === status
          : true;
        
        return matchesFilter && matchesStatus;
      })
    : [];

  if (shipmentsLoading && tasksLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (shipmentsError && tasksError) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-screen">
          <AlertTriangle className="w-12 h-12 text-danger mb-4" />
          <h2 className="text-xl font-bold">Error loading data</h2>
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
            <h1 className="text-2xl font-bold">Shipments</h1>
            <p className="text-neutral-light">Manage and track all your shipments</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <Plus size={16} className="mr-2" />
              Create Shipment
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter shipments by status, date range, or search by ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Search</label>
                <div className="relative">
                  <Input
                    placeholder="Search by ID, origin, or destination"
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
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Date Range</label>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar size={16} className="mr-2" />
                  <span>Select date range</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="shipments" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center border-b mb-4">
            <TabsList className="mb-4">
              <TabsTrigger value="shipments">Shipments</TabsTrigger>
              <TabsTrigger value="tasks">Shipment Tasks</TabsTrigger>
            </TabsList>
            <div className="mb-4">
              {activeTab === "tasks" && (
                <CreateTaskModal 
                  triggerElement={
                    <Button size="sm" className="bg-primary text-white">
                      <Plus size={16} className="mr-1" />
                      Create Shipment Task
                    </Button>
                  } 
                />
              )}
            </div>
          </div>

          <TabsContent value="shipments" className="mt-0">
            <div className="bg-white rounded-lg border border-border shadow-sm">
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold">
                  Shipments ({filteredShipments.length})
                </h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter size={16} className="mr-2" />
                    Advanced Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
              
              <ShipmentTable
                shipments={filteredShipments}
                isLoading={shipmentsLoading}
                isDetailView={true}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            <div className="bg-white rounded-lg border border-border shadow-sm">
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold">
                  Shipment Tasks ({shipmentTasks.length})
                </h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <div className="divide-y">
                {tasksLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : shipmentTasks.length === 0 ? (
                  <div className="text-center p-8">
                    <div className="mb-2">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No shipment tasks found</h3>
                    <p className="text-muted-foreground mb-4">Create your first shipment task to get started.</p>
                    <CreateTaskModal />
                  </div>
                ) : (
                  shipmentTasks.map((task) => (
                    <div key={task.id} className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{task.title}</h4>
                            <Badge variant={task.status === 'completed' ? 'outline' : task.priority === 'high' || task.priority === 'urgent' ? 'destructive' : 'default'}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {task.status === 'pending' && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock8 className="h-3 w-3" /> Pending
                            </Badge>
                          )}
                          {task.status === 'in-progress' && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse" /> In Progress
                            </Badge>
                          )}
                          {task.status === 'completed' && (
                            <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-600">
                              <CheckCircle2 className="h-3 w-3" /> Completed
                            </Badge>
                          )}
                          
                          <Button variant="outline" size="sm">View Details</Button>
                        </div>
                      </div>
                      {task.dueDate && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
