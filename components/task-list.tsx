"use client"

import { Task } from "@/db/schema"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { updateTaskStatusAction, deleteTaskAction } from "@/actions/task"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TaskWithProject = typeof Task.$inferSelect

export function TaskList({ tasks, projectId: initialProjectId }: { tasks: TaskWithProject[], projectId: string }) {
  async function toggleStatus(task: TaskWithProject) {
    const newStatus = task.status === "done" ? "todo" : "done"
    // Use task's own projectId if initialProjectId is empty (global view)
    await updateTaskStatusAction(task.id, initialProjectId || task.projectId, newStatus)
  }

  async function deleteTask(id: string, taskProjectId: string) {
    await deleteTaskAction(id, initialProjectId || taskProjectId)
  }

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-muted-foreground">No tasks found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className="flex items-start justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-start gap-3">
            <Checkbox 
              checked={task.status === "done"} 
              onCheckedChange={() => toggleStatus(task)}
              className="mt-1"
            />
            <div className="grid gap-1">
              <span className={cn(
                "font-medium leading-none",
                task.status === "done" && "text-muted-foreground line-through"
              )}>
                {task.name}
              </span>
              {task.description && (
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline" className={cn("text-[10px] uppercase", priorityColors[task.priority as keyof typeof priorityColors])}>
                  {task.priority}
                </Badge>
                {task.status !== "todo" && (
                    <Badge variant="secondary" className="text-[10px] uppercase">
                        {task.status.replace("-", " ")}
                    </Badge>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon-sm" 
            onClick={() => deleteTask(task.id, task.projectId)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
