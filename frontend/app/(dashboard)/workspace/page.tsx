"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { tasksApi, Task } from "@/lib/api/tasks"

export default function WorkspacePage() {
  const [tasks, setTasks] = React.useState<Task[]>([])

  React.useEffect(() => {
    tasksApi.getTasks().then(res => setTasks(res.data)).catch(console.error)
  }, [])

  const totalTasks = tasks.length
  const inProgressTasks = tasks.filter(t => t.status === "IN_PROGRESS").length
  const completedTasks = tasks.filter(t => t.status === "COMPLETED").length

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s an overview of your activity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
            <CardDescription>Tasks across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>In Progress</CardTitle>
            <CardDescription>Tasks currently being worked on</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{inProgressTasks}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
            <CardDescription>Tasks finished this week</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{completedTasks}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card className="border-dashed shadow-none">
          <EmptyState 
            title="No activity yet" 
            description="When you start working on tasks, your activity will appear here."
          />
        </Card>
      </div>
    </div>
  )
}
