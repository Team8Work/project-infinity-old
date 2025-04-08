import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@shared/schema";
import { format, isToday, isTomorrow } from "date-fns";
import { Paperclip, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Task type badge styles
const taskTypeStyles = {
  "shipment": { color: "bg-danger/10 text-danger" },
  "payment": { color: "bg-warning/10 text-warning" },
  "damage": { color: "bg-danger/10 text-danger" },
  "complaint": { color: "bg-neutral/10 text-neutral" },
};

interface TaskListProps {
  tasks: Task[];
}

export default function TaskList({ tasks }: TaskListProps) {
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/tasks/${id}`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
    },
  });

  const handleStatusChange = (task: Task, checked: boolean) => {
    updateTaskMutation.mutate({
      id: task.id,
      status: checked ? "completed" : "pending"
    });
  };

  // Format due date in human-readable format
  const formatDueDate = (date: Date | string | undefined) => {
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

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-neutral-light">No tasks available</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li key={task.id} className="p-3 border border-border rounded-md hover:bg-background">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3 mt-1">
              <Checkbox 
                checked={task.status === "completed"}
                onCheckedChange={(checked) => handleStatusChange(task, checked as boolean)}
                className="rounded border-gray-300 text-primary focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={cn(
                    "font-medium",
                    task.status === "completed" && "line-through text-neutral-light"
                  )}>
                    {task.title}
                  </h4>
                  <p className="text-sm text-neutral-light mt-1">
                    {task.assignedTo ? `Assigned to: User #${task.assignedTo}` : "Unassigned"} | Due: {formatDueDate(task.dueDate)}
                  </p>
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs",
                  taskTypeStyles[task.type as keyof typeof taskTypeStyles]?.color
                )}>
                  {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                </span>
              </div>
              {task.description && (
                <p className="text-sm text-neutral mt-2 max-w-md">
                  {task.description}
                </p>
              )}
              <div className="flex items-center mt-2 text-sm">
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
