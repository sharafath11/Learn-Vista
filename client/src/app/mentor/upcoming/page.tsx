"use client"

import { useState, useEffect } from "react"
import { format, parseISO, addMinutes, isBefore } from "date-fns"
import { Calendar, Clock, Users, Play, Radio, ChevronRight, CheckCircle, Archive } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMentorContext } from "@/src/context/mentorContext"
import { Button } from "@/src/components/shared/components/ui/button"
import { Card, CardContent } from "@/src/components/shared/components/ui/card"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/shared/components/ui/tabs"
import { SessionTable } from "./SessionTable"
import { ILessons } from "@/src/types/lessons"

export default function UpcomingSessions() {
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const { courses } = useMentorContext()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const canStartSession = (startDate: string, endDate: string, startTime: string): boolean => {
    if (!startDate || !endDate || !startTime) return false
    try {
      const [hours, minutes] = startTime.split(":").map(Number)
      const todaySessionStart = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), hours, minutes)
      const startWindow = addMinutes(todaySessionStart, -30)
      const endWindow = addMinutes(todaySessionStart, 60)
      const courseStartDate = parseISO(startDate)
      const courseEndDate = parseISO(endDate)
      return currentTime >= courseStartDate && currentTime <= courseEndDate && 
             currentTime >= startWindow && currentTime <= endWindow
    } catch (err) {
      console.error("Error in time eligibility check:", err)
      return false
    }
  }

  const isSessionEnded = (endDate: string): boolean => {
    if (!endDate) return false
    try {
      const sessionEndDate = parseISO(endDate)
      const today = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate())
      const sessionEnd = new Date(sessionEndDate.getFullYear(), sessionEndDate.getMonth(), sessionEndDate.getDate())
      return isBefore(sessionEnd, today)
    } catch (err) {
      console.error("Error checking if session ended:", err)
      return false
    }
  }

  const handleStartSession = (courseId: string) => router.push(`/mentor/live-class/${courseId}`)

  const getSessionStatus = (session: any) => {
    if (isSessionEnded(session.endDate)) return "ended"
    if (session.isStreaming) return "streaming"
    if (canStartSession(session.startDate, session.endDate, session.startTime)) return "ready"
    return "scheduled"
  }

  const upcomingSessions = courses.filter(session => !isSessionEnded(session.endDate))
  const endedSessions = courses.filter(session => isSessionEnded(session.endDate))

  const SessionCards = ({ sessions, isEnded = false }: { sessions: any[]; isEnded?: boolean }) => (
    <div className="space-y-4">
      {sessions.length > 0 ? (
        sessions.map((session) => {
          const status = getSessionStatus(session)
          return (
            <Card
              key={session.id}
              className={`bg-slate-800/50 backdrop-blur-sm border-slate-700/50 transition-all duration-200 hover:bg-slate-800/70 ${
                status === "ready" ? "ring-2 ring-emerald-500/50 bg-emerald-900/20" : ""
              } ${isEnded ? "opacity-75" : ""}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    isEnded ? "bg-slate-600" : "bg-gradient-to-br from-blue-500 to-purple-600"
                  }`}>
                    {isEnded ? <CheckCircle className="w-6 h-6 text-slate-300" /> : <Play className="w-6 h-6 text-white" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-semibold text-lg mb-1 ${isEnded ? "text-slate-400" : "text-white"}`}>
                      {session.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2 line-clamp-2">{session.description}</p>
                    <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                      {session.categoryId?.title || session.categoryName || "General"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-slate-400">Start Date</p>
                        <p className="text-slate-200 font-medium">
                          {session.startDate ? format(parseISO(session.startDate), "MMM dd, yyyy") : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-slate-400">End Date</p>
                        <p className="text-slate-200 font-medium">
                          {session.endDate ? format(parseISO(session.endDate), "MMM dd, yyyy") : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-slate-400">Time</p>
                        <p className="text-slate-200 font-medium">{session.startTime || "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <div>
                        <p className="text-slate-400">End Time</p>
                        <p className="text-slate-200 font-medium">{session.endTime || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  {isEnded ? (
                    <div className="flex items-center justify-center py-2">
                      <Badge variant="outline" className="bg-slate-700/50 border-slate-600 text-slate-300">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Session Completed
                      </Badge>
                    </div>
                  ) : status === "streaming" ? (
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <Radio className="w-4 h-4 mr-2" />
                      Currently Live
                    </Button>
                  ) : status === "ready" ? (
                    <Button
                      onClick={() => handleStartSession(session.id)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Session Now
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full bg-slate-800 border-slate-600 text-slate-400 cursor-not-allowed"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Session Scheduled
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })
      ) : (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              {isEnded ? (
                <Archive className="w-8 h-8 text-slate-400" />
              ) : (
                <Calendar className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              {isEnded ? "No Completed Sessions" : "No Sessions Scheduled"}
            </h3>
            <p className="text-slate-500">
              {isEnded ? "Your completed sessions will appear here." : "Your upcoming sessions will appear here."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Session Management</h1>
          <p className="text-slate-400 text-lg">Manage your upcoming and completed mentoring sessions</p>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2 mb-6 bg-slate-800/50 border border-slate-700/50">
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white flex items-center gap-2">
              <Play className="w-4 h-4" />
              Upcoming Sessions
              {upcomingSessions.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-blue-600 text-white text-xs">
                  {upcomingSessions.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="ended" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white flex items-center gap-2">
              <Archive className="w-4 h-4" />
              Completed Sessions
              {endedSessions.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-slate-600 text-white text-xs">
                  {endedSessions.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="hidden lg:block">
              <SessionTable 
                sessions={upcomingSessions} 
                handleStartSession={handleStartSession}
                getSessionStatus={getSessionStatus}
              />
            </div>
            <div className="lg:hidden">
              <SessionCards sessions={upcomingSessions} />
            </div>
          </TabsContent>

          <TabsContent value="ended">
            <div className="hidden lg:block">
              <SessionTable 
                sessions={endedSessions} 
                isEnded={true}
                handleStartSession={handleStartSession}
                getSessionStatus={getSessionStatus}
              />
            </div>
            <div className="lg:hidden">
              <SessionCards sessions={endedSessions} isEnded={true} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}