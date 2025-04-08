import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
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

export default function Payments() {
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("payments");

  const { data: payments = [], isLoading: paymentsLoading, error: paymentsError } = useQuery({
    queryKey: ["/api/payments"],
  });

  const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useQuery({
    queryKey: ["/api/tasks"],
  });

  // Filter payment tasks - tasks with type "payment"
  const paymentTasks = tasks ? tasks.filter((task: any) => task.type === "payment") : [];

  if (paymentsLoading && tasksLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (paymentsError && tasksError) {
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
            <h1 className="text-2xl font-bold">Payments</h1>
            <p className="text-neutral-light">Manage and track all your payments</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>
              <Plus size={16} className="mr-2" />
              Create Payment
            </Button>
          </div>
        </div>

        <Tabs defaultValue="payments" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center border-b mb-4">
            <TabsList className="mb-4">
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="tasks">Payment Tasks</TabsTrigger>
            </TabsList>
            <div className="mb-4">
              {activeTab === "tasks" && (
                <CreateTaskModal 
                  triggerElement={
                    <Button size="sm" className="bg-primary text-white">
                      <Plus size={16} className="mr-1" />
                      Create Payment Task
                    </Button>
                  } 
                />
              )}
            </div>
          </div>

          <TabsContent value="payments" className="mt-0">
            <div className="bg-white rounded-lg border border-border shadow-sm">
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold">
                  Payments ({payments.length})
                </h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
              
              <div className="p-5">
                {payments.length === 0 ? (
                  <div className="text-center p-8">
                    <div className="mb-2">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No payments found</h3>
                    <p className="text-muted-foreground mb-4">Create your first payment to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">ID</th>
                          <th className="text-left p-3 font-medium">Amount</th>
                          <th className="text-left p-3 font-medium">Status</th>
                          <th className="text-left p-3 font-medium">Shipment</th>
                          <th className="text-left p-3 font-medium">Due Date</th>
                          <th className="text-right p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {payments.map((payment: any) => (
                          <tr key={payment.id} className="hover:bg-muted/50">
                            <td className="p-3">#{payment.id}</td>
                            <td className="p-3">${payment.amount}</td>
                            <td className="p-3">
                              <Badge variant={
                                payment.status === 'paid' ? 'outline' : 
                                payment.status === 'overdue' ? 'destructive' : 
                                'default'
                              }>
                                {payment.status}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {payment.shipmentId ? `#${payment.shipmentId}` : 'N/A'}
                            </td>
                            <td className="p-3">
                              {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="p-3 text-right">
                              <Button variant="outline" size="sm">View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            <div className="bg-white rounded-lg border border-border shadow-sm">
              <div className="p-5 border-b border-border flex justify-between items-center">
                <h3 className="font-semibold">
                  Payment Tasks ({paymentTasks.length})
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
                ) : paymentTasks.length === 0 ? (
                  <div className="text-center p-8">
                    <div className="mb-2">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No payment tasks found</h3>
                    <p className="text-muted-foreground mb-4">Create your first payment task to get started.</p>
                    <CreateTaskModal />
                  </div>
                ) : (
                  paymentTasks.map((task: any) => (
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