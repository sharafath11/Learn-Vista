"use client"
import {  Calendar, CheckCircle2, Clock, Trophy } from "lucide-react"
import { Alert, AlertDescription } from "@/src/components/shared/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { DailyTaskCard } from "./DailyTaskCard"
import Link from "next/link"
import { useUserContext } from "@/src/context/userAuthContext"


export default function DailyTaskPage() {
 const {dailyTask}=useUserContext()
 

  if (!dailyTask) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Alert className="max-w-md mx-auto mt-20">
            <Calendar className="h-4 w-4" />
            <AlertDescription>No tasks found for today. Check back tomorrow for new challenges!</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const completedTasks = dailyTask.tasks.filter((task) => task.isCompleted).length
  const totalTasks = dailyTask.tasks.length
  const progressPercentage = (completedTasks / totalTasks) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Daily Learning Tasks 
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Complete your daily tasks to improve your skills and track your progress
          </p>
          {dailyTask.overallScore}
        </div>
        <div className="flex justify-end max-w-2xl mx-auto">
  <Link
    href="/user/dailytask/tasks"
    className="inline-block text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
  >
    View All Tasks & Progress
  </Link>
</div>

        {/* Progress Overview */}
        <Card className="max-w-2xl mx-auto border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Trophy className="h-5 w-5 text-yellow-500" />
             {`Today's Progress`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">Completed Tasks</span>
              </div>
              <Badge variant={completedTasks === totalTasks ? "default" : "secondary"} className="text-sm">
                {completedTasks} / {totalTasks}
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{Math.round(progressPercentage)}% Complete</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Today</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {dailyTask.tasks.map((task, i) => (
            <DailyTaskCard key={i} task={task} taskId={dailyTask.id} />
          ))}
        </div>

        {/* Motivational Footer */}
        {completedTasks === totalTasks && (
          <Card className="max-w-md mx-auto border-0 shadow-lg bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <CardContent className="text-center p-6">
              <Trophy className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Congratulations! 🎉</h3>
              <p className="text-green-100">You&apos;ve completed all tasks for today!</p>

            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
