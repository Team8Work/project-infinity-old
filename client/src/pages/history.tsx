import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/app-shell";
import { Loader2, AlertTriangle, Search, Filter, Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");

  // Get all completed tasks
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ["/api/tasks"],
  });

  // Function to get color based on task priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-amber-100 text-amber-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Apply filters and search
  const filteredTasks = tasks ? tasks.filter((task: any) => {
    // Status filter
    if (filterStatus !== "all" && task.status !== filterStatus) {
      return false;
    }

    // Type filter
    if (filterType !== "all" && task.type !== filterType) {
      return false;
    }

    // Period filter
    if (filterPeriod !== "all") {
      const taskDate = new Date(task.createdAt);
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      const lastQuarter = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);

      if (
        (filterPeriod === "week" && taskDate < lastWeek) ||
        (filterPeriod === "month" && taskDate < lastMonth) ||
        (filterPeriod === "quarter" && taskDate < lastQuarter)
      ) {
        return false;
      }
    }

    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.type?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  }) : [];

  return (
    <AppShell>
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Task History</h2>
            <p className="text-sm text-neutral-light">
              View and search your historical tasks
            </p>
          </div>
          <Button className="bg-primary text-white">
            <Download className="mr-2 h-4 w-4" />
            Export History
          </Button>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Task History</CardTitle>
            <CardDescription>
              View all completed and historical tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-light h-4 w-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="shipment">Shipment</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="damage">Damage</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center my-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center my-8">
                <AlertTriangle className="w-12 h-12 text-danger mb-2" />
                <p className="text-danger">Error loading task history</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-8 text-neutral-light">
                <p>No matching tasks found</p>
                {searchTerm && (
                  <Button
                    variant="ghost"
                    onClick={() => setSearchTerm("")}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Completed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task: any) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">
                          {task.title}
                        </TableCell>
                        <TableCell className="capitalize">
                          {task.type}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              task.status === "completed"
                                ? "success"
                                : task.status === "in-progress"
                                ? "secondary"
                                : task.status === "pending"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatDate(task.createdAt)}
                        </TableCell>
                        <TableCell>
                          {task.completedAt ? formatDate(task.completedAt) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}