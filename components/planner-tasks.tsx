import { useState } from "react"
import { ListTodo, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState, SectionHeader, TaskRow } from "@/components/planner-shared"
import type { PlannerTask } from "@/components/planner-types"

type TaskFilter = "all" | "open" | "done"

export function PlannerTasks({
  tasks,
  today,
  onAdd,
  onToggle,
  onDelete,
}: {
  tasks: PlannerTask[]
  today: string
  onAdd: () => void
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}) {
  const [filter, setFilter] = useState<TaskFilter>("all")
  const completedCount = tasks.filter((task) => task.completed).length
  const openCount = tasks.length - completedCount
  const visibleTasks = tasks
    .filter((task) => filter === "all" || (filter === "open" ? !task.completed : task.completed))
    .sort((a, b) => Number(a.completed) - Number(b.completed) || a.dueDate.localeCompare(b.dueDate))

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Your next steps"
        description="Keep the list small, clear, and easy to act on."
        action={<Button onClick={onAdd}><Plus data-icon="inline-start" aria-hidden="true" />Add task</Button>}
      />

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription className="mt-1">{openCount} open · {completedCount} completed</CardDescription>
          </div>
          <Select value={filter} onValueChange={(value) => {
            if (value === "all" || value === "open" || value === "done") setFilter(value)
          }}>
            <SelectTrigger className="w-full sm:w-40" aria-label="Filter tasks">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All tasks</SelectItem>
                <SelectItem value="open">Open only</SelectItem>
                <SelectItem value="done">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-0">
          {tasks.length ? (
            <>
              <div className="mb-5 flex items-center justify-between gap-4 rounded-xl bg-muted/50 p-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium">Overall progress</p>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%
                    </span>
                  </div>
                  <Progress value={tasks.length ? (completedCount / tasks.length) * 100 : 0} aria-label="Task completion progress" />
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
                  <ListTodo aria-hidden="true" className="size-4" />
                </span>
              </div>
              {visibleTasks.length ? (
                <div className="divide-y divide-border/70">
                  {visibleTasks.map((task) => (
                    <TaskRow key={task.id} task={task} today={today} onToggle={onToggle} onDelete={onDelete} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={ListTodo}
                  title={filter === "done" ? "Nothing completed yet" : "All clear for now"}
                  description={filter === "done" ? "Completed tasks will collect here." : "There are no open tasks in this list."}
                  action={filter === "done" ? undefined : <Button size="sm" onClick={onAdd}>Add a task</Button>}
                />
              )}
            </>
          ) : (
            <EmptyState
              icon={ListTodo}
              title="Start with one next step"
              description="Add a task, choose a due date, and check it off when it’s done."
              action={<Button size="sm" onClick={onAdd}><Plus data-icon="inline-start" aria-hidden="true" />Add task</Button>}
            />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="sm:col-span-1">
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-xs text-muted-foreground">Open</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{openCount}</p>
            </div>
            <Badge variant="secondary">in motion</Badge>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1">
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-xs text-muted-foreground">Due today</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {tasks.filter((task) => !task.completed && task.dueDate === today).length}
              </p>
            </div>
            <Badge variant="outline">today</Badge>
          </CardContent>
        </Card>
        <Card className="sm:col-span-1">
          <CardContent className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{completedCount}</p>
            </div>
            <Badge variant="secondary">done</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
