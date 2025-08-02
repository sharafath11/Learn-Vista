'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { DailyTaskCard } from "./DailyTaskCard";
import { IDailyTask } from "@/src/types/dailyTaskTypes";
import { UserAPIMethods } from "@/src/services/APImethods";
import { showInfoToast } from "@/src/utils/Toast";


export default function DailyTaskPage() {
  const [dailyTask, setDailyTask] = useState<IDailyTask | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
        const res = await UserAPIMethods.getDailyTask();
        if (res.ok) {
         setDailyTask(res.data);
        }
        else showInfoToast(res.msg)
        setLoading(false);
    }

    fetchTasks();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading tasks...</p>;
  if (!dailyTask) return <p className="text-center mt-10">No tasks found for today.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">🗓️ Your Daily Tasks</h1>

      {dailyTask.tasks.map((task, i) => (
        <DailyTaskCard key={i} task={task} />
      ))}
    </div>
  );
}
function fetchTasks(): import("react").DependencyList | undefined {
    throw new Error("Function not implemented.");
}

