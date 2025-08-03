
"use client";

import { useEffect, useState } from "react";
import { IDailyTask } from "@/src/types/dailyTaskTypes";
import { UserAPIMethods } from "@/src/services/APImethods";
import { showErrorToast } from "@/src/utils/Toast";
import { Skeleton } from "@/src/components/shared/components/ui/skeleton";

import { Button } from "@/src/components/shared/components/ui/button";
import { DailyTasksTable } from "./DailyTasksTable";
import { DailyProgressGraph } from "./DailyProgressGraph";

export default function DailyTaskListPage() {
  const [dailyTasks, setDailyTasks] = useState<IDailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'table' | 'graph'>('table');

  useEffect(() => {
    const fetchDailyTask = async () => {
      setLoading(true);
      const res = await UserAPIMethods.getAllDailyTask();
      if (res.ok) {
        setDailyTasks(res.data);
      } else {
        showErrorToast(res.msg);
      }
      setLoading(false);
    };

    fetchDailyTask();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[40px] w-32" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Your Daily Task History</h1>

      <div className="flex justify-end">
        <Button onClick={() => setView(view === 'table' ? 'graph' : 'table')}>
          {view === 'table' ? 'Show Graph' : 'Show Table'}
        </Button>
      </div>

      {view === 'table' ? (
        <DailyTasksTable dailyTasks={dailyTasks} />
      ) : (
        <DailyProgressGraph dailyTasks={dailyTasks} />
      )}
    </div>
  );
}