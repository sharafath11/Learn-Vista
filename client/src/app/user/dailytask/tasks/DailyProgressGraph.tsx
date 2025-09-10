
"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card";
import { IUserDailyProps } from "@/src/types/userProps";

export function DailyProgressGraph({ dailyTasks }: IUserDailyProps) {
  const chartData = dailyTasks
    .filter(task => typeof task.overallScore === "number" && task.overallScore !== null)
    .sort((a, b) => new Date(a.createdAt||"").getTime() - new Date(b.createdAt||"").getTime())
    .map(task => ({
      date: format(new Date(task.createdAt||""), "dd MMM"),
      score: task.overallScore,
    }));

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Progress Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}