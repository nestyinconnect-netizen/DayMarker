import { ArrowUpRight, CalendarDays, Plus, Target, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatDateShort } from "@/components/planner-data"
import { EmptyState, SectionHeader } from "@/components/planner-shared"
import type { Goal, GoalPeriod } from "@/components/planner-types"

function GoalCard({
  goal,
  onAdvance,
  onDelete,
}: {
  goal: Goal
  onAdvance: (id: string) => void
  onDelete: (id: string) => void
}) {
  const complete = goal.progress >= 100

  return (
    <Card className="bg-background/70">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Target aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className={`font-medium ${complete ? "text-muted-foreground line-through" : ""}`}>{goal.title}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant={goal.period === "year" ? "outline" : "secondary"}>
                {goal.period === "year" ? "Year-end" : "This month"}
              </Badge>
              <span className="text-xs text-muted-foreground">Target {formatDateShort(goal.targetDate)}</span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            aria-label={`Remove goal: ${goal.title}`}
            onClick={() => onDelete(goal.id)}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium tabular-nums">{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} aria-label={`${goal.title}: ${goal.progress}% complete`} />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          disabled={complete}
          onClick={() => onAdvance(goal.id)}
        >
          <ArrowUpRight data-icon="inline-start" aria-hidden="true" />
          {complete ? "Goal complete" : "Update progress +10%"}
        </Button>
      </CardContent>
    </Card>
  )
}

function GoalGroup({
  period,
  goals,
  onAdvance,
  onDelete,
  onAdd,
}: {
  period: GoalPeriod
  goals: Goal[]
  onAdvance: (id: string) => void
  onDelete: (id: string) => void
  onAdd: () => void
}) {
  const isYearly = period === "year"

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>{isYearly ? "Year-end goals" : "This month"}</CardTitle>
          <CardDescription className="mt-1">
            {isYearly ? "The bigger picture, one step at a time." : "Small wins to work toward before the month closes."}
          </CardDescription>
        </div>
        <Badge variant={isYearly ? "outline" : "secondary"}>{goals.length} goals</Badge>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {goals.length ? goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} onAdvance={onAdvance} onDelete={onDelete} />
        )) : (
          <EmptyState
            icon={isYearly ? CalendarDays : Target}
            title={isYearly ? "Make a year-end goal" : "Choose a focus for this month"}
            description={isYearly ? "Name a longer-term milestone and keep it moving." : "Pick one meaningful thing to move forward."}
            action={<Button size="sm" onClick={onAdd}><Plus data-icon="inline-start" aria-hidden="true" />Create goal</Button>}
          />
        )}
      </CardContent>
    </Card>
  )
}

export function PlannerGoals({
  goals,
  onAdd,
  onAdvance,
  onDelete,
}: {
  goals: Goal[]
  onAdd: () => void
  onAdvance: (id: string) => void
  onDelete: (id: string) => void
}) {
  const monthlyGoals = goals.filter((goal) => goal.period === "month")
  const yearlyGoals = goals.filter((goal) => goal.period === "year")
  const average = goals.length ? Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length) : 0

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Progress with a purpose"
        description="A monthly focus and a year-end view make progress easier to notice."
        action={<Button onClick={onAdd}><Plus data-icon="inline-start" aria-hidden="true" />Create goal</Button>}
      />
      <Card className="overflow-hidden border-0 bg-sidebar text-sidebar-foreground">
        <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sidebar-accent text-sidebar-primary">
              <Target aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-sm text-sidebar-foreground/65">Across all active goals</p>
              <p className="mt-1 text-2xl font-semibold">{average}% average progress</p>
            </div>
          </div>
          <Button variant="secondary" onClick={onAdd}><Plus data-icon="inline-start" aria-hidden="true" />Add a goal</Button>
        </CardContent>
      </Card>
      <div className="grid gap-4 xl:grid-cols-2">
        <GoalGroup period="month" goals={monthlyGoals} onAdvance={onAdvance} onDelete={onDelete} onAdd={onAdd} />
        <GoalGroup period="year" goals={yearlyGoals} onAdvance={onAdvance} onDelete={onDelete} onAdd={onAdd} />
      </div>
    </div>
  )
}
