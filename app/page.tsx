import { PlannerShell } from "@/components/planner-shell"

export default function Page() {
  const now = new Date()
  const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10)

  return <PlannerShell today={localToday} />
}
