import { Task } from "@shared/schema";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { 
  Paperclip, 
  MessageSquare, 
  Timer, 
  CheckCircle, 
  CheckCircle2, 
  XCircle, 
  CircleAlert,
  UserCircle,
  CalendarClock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useAutoRefresh, refreshQueries } from "@/hooks/use-auto-refresh";

// Task type badge styles
const taskTypeStyles = {
  "shipment": { color: "bg-blue-100 text-blue-600", icon: "📦" },
  "payment": { color: "bg-amber-100 text-amber-600", icon: "💰" },
  "damage": { color: "bg-rose-100 text-rose-600", icon: "🛠️" },
  "complaint": { color: "bg-gray-100 text-gray-600", icon: "📝" },
  "client": { color: "bg-green-100 text-green-600", icon: "👤" },
  "report": { color: "bg-purple-100 text-purple-600", icon: "📊" },
  "general": { color: "bg-slate-100 text-slate-600", icon: "📎" },
};

// Status styles
const statusStyles = {
  "pending": { color: "bg-amber-100 text-amber-600", icon: <Timer className="h-4 w-4" /> },
  "in-progress": { color: "bg-blue-100 text-blue-600", icon: <CircleAlert className="h-4 w-4" /> },
  "completed": { color: "bg-green-100 text-green-600", icon: <CheckCircle className="h-4 w-4" /> },
  "cancelled": { color: "bg-red-100 text-red-600", icon: <XCircle className="h-4 w-4" /> },
}

// Priority styles
const priorityStyles = {
  "low": { color: "bg-blue-100 text-blue-600" },
  "medium": { color: "bg-amber-100 text-amber-600" },
  "high": { color: "bg-orange-100 text-orange-600" },
  "urgent": { color: "bg-red-100 text-red-600" },
}

interface TaskListProps {
  tasks: Task[];
  taskType?: string;
  compact?: boolean;
}

export default function TaskList({ tasks, taskType, compact = false }: TaskListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Setup automatic data refreshing
  useAutoRefresh(["/api/tasks", "/api/dashboard/stats"], 5000);
  
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/tasks/${id}`, { status });
      return await res.json();
    },
    onSuccess: (data) => {
      // Immediately refresh data
      refreshQueries(["/api/tasks", "/api/dashboard/stats"]);
      
      // Show success toast based on status
      const statusMessages = {
        'completed': "Task marked as completed",
        'in-progress': "Task started",
        'pending': "Task reopened"
      };
      
      toast({
        title: statusMessages[data.status as keyof typeof statusMessages] || "Task updated",
        description: `Task #${data.id} has been updated`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating task",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });

  // Filter tasks by type if taskType is provided
  const filteredTasks = taskType ? 
    tasks.filter(task => task.type === taskType) : 
    tasks;

  // Mark task as complete
  const completeTask = (task: Task) => {
    updateTaskMutation.mutate({
      id: task.id,
      status: 'completed'
    });
  };
  
  // Mark task as in progress
  const startTask = (task: Task) => {
    updateTaskMutation.mutate({
      id: task.id,
      status: 'in-progress'
    });
  };
  
  // Mark task as pending
  const resetTask = (task: Task) => {
    updateTaskMutation.mutate({
      id: task.id,
      status: 'pending'
    });
  };

  // Format due date in human-readable format
  const formatDueDate = (date: Date | string | null) => {
    if (!date) return "No due date";
    
    const dueDate = new Date(date);
    
    if (isToday(dueDate)) {
      return "Today";
    } else if (isTomorrow(dueDate)) {
      return "Tomorrow";
    } else {
      return format(dueDate, "MMM d");
    }
  };
  
  // Check if task is overdue
  const isOverdue = (task: Task) => {
    if (!task.dueDate) return false;
    return isPast(new Date(task.dueDate)) && task.status !== 'completed';
  };

  // Get user name from ID
  const getUserName = (userId: number | null) => {
    if (!userId) return "Unassigned";
    return `User #${userId}`;
  };

  if (!filteredTasks || filteredTasks.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-neutral-light">No tasks available</p>
      </div>
    );
  }

  // Compact view for dashboard
  if (compact) {
    return (
      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li key={task.id} className={cn(
            "p-3 border rounded-md transition-all",
            isOverdue(task) ? "border-red-300 bg-red-50" : "border-border hover:bg-background"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  task.status === "completed" ? "bg-green-100" : 
                  task.status === "in-progress" ? "bg-blue-100" : 
                  isOverdue(task) ? "bg-red-100" : "bg-amber-100"
                )}>
                  {task.status === "completed" ? 
                    <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
                    task.status === "in-progress" ? 
                    <Timer className="h-5 w-5 text-blue-600" /> :
                    isOverdue(task) ? 
                    <CircleAlert className="h-5 w-5 text-red-600" /> :
                    <Timer className="h-5 w-5 text-amber-600" />
                  }
                </div>
                <div>
                  <h4 className={cn(
                    "font-medium text-sm",
                    task.status === "completed" && "line-through text-neutral-light"
                  )}>
                    {task.title}
                  </h4>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <CalendarClock className="h-3 w-3 mr-1" /> 
                    <span className={isOverdue(task) ? "text-red-600 font-medium" : ""}>
                      {formatDueDate(task.dueDate)}
                    </span>
                    <span className="mx-1">•</span>
                    <UserCircle className="h-3 w-3 mr-1" /> 
                    <span>{getUserName(task.assignedTo)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Badge className={cn(
                  "text-xs mr-2", 
                  taskTypeStyles[task.type as keyof typeof taskTypeStyles]?.color
                )}>
                  {taskTypeStyles[task.type as keyof typeof taskTypeStyles]?.icon} {task.type}
                </Badge>
                
                {/* Status buttons (only show for assignee or admin/manager) */}
                {(user?.role === 'admin' || user?.role === 'manager' || user?.id === task.assignedTo) && (
                  <div className="flex space-x-1">
                    {task.status !== 'completed' && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                        onClick={() => completeTask(task)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    {task.status !== 'in-progress' && task.status !== 'completed' && (
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                        onClick={() => startTask(task)}
                      >
                        <Timer className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  // Full view for task page
  return (
    <ul className="space-y-3">
      {filteredTasks.map((task) => (
        <li key={task.id} className={cn(
          "p-4 border rounded-lg transition-all",
          isOverdue(task) ? "border-red-300 bg-red-50" : "border-border hover:bg-background"
        )}>
          <div className="flex items-start">
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={cn(
                    "font-medium",
                    task.status === "completed" && "line-through text-neutral-light"
                  )}>
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className={cn(
                      statusStyles[task.status as keyof typeof statusStyles]?.color,
                      "gap-1"
                    )}>
                      {statusStyles[task.status as keyof typeof statusStyles]?.icon}
                      {task.status.replace('-', ' ')}
                    </Badge>
                    
                    <Badge variant="outline" className={cn(
                      taskTypeStyles[task.type as keyof typeof taskTypeStyles]?.color,
                    )}>
                      {taskTypeStyles[task.type as keyof typeof taskTypeStyles]?.icon} {task.type}
                    </Badge>
                    
                    <Badge variant="outline" className={cn(
                      priorityStyles[task.priority as keyof typeof priorityStyles]?.color,
                    )}>
                      Priority: {task.priority}
                    </Badge>
                    
                    <Badge variant="outline" className={cn(
                      isOverdue(task) ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600",
                    )}>
                      <CalendarClock className="h-3 w-3 mr-1" />
                      {formatDueDate(task.dueDate)}
                    </Badge>
                    
                    <Badge variant="outline" className="bg-gray-100 text-gray-600">
                      <UserCircle className="h-3 w-3 mr-1" />
                      {getUserName(task.assignedTo)}
                    </Badge>
                  </div>
                </div>
                
                {/* Task actions */}
                <div className="flex space-x-2">
                  {(user?.role === 'admin' || user?.role === 'manager' || user?.id === task.assignedTo) && (
                    <>
                      {task.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                          onClick={() => completeTask(task)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      {task.status !== 'in-progress' && task.status !== 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
                          onClick={() => startTask(task)}
                        >
                          <Timer className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      {task.status === 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100"
                          onClick={() => resetTask(task)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reopen
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mt-3 max-w-xl">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center mt-3 text-xs">
                <div className="flex items-center text-neutral-light mr-4">
                  <Paperclip className="mr-1 h-3 w-3" />
                  <span>0 files</span>
                </div>
                <div className="flex items-center text-neutral-light">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  <span>0 comments</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
