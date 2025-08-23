"use client";

import { useState } from "react";
import { IDailyTask, ITask } from "@/src/types/dailyTaskTypes";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shared/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/shared/components/ui/card";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { Mic, PenTool, Headphones, Play } from "lucide-react";
import { Button } from "@/src/components/shared/components/ui/button";
import { handleTextToSpeech, stopTextToSpeech } from "@/src/utils/voice";

interface Props {
  dailyTasks: IDailyTask[];
}

const taskIcons = {
  speaking: Mic,
  writing: PenTool,
  listening: Headphones,
};

export function DailyTasksTable({ dailyTasks }: Props) {
  const [selectedDailyTask, setSelectedDailyTask] = useState<IDailyTask | null>(
    null
  );
  const getCompletedTasksCount = (tasks: ITask[]) =>
    tasks.filter((task) => task.isCompleted).length;

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Daily Task History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Tasks Completed</th>
                  <th className="px-4 py-3">Overall Score</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {dailyTasks.map((dailyTask) => (
                  <tr
                    key={dailyTask.id}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedDailyTask(dailyTask)}
                  >
                    <td className="px-4 py-3">
                      {format(
                        new Date(dailyTask.createdAt || ""),
                        "dd MMM yyyy"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {getCompletedTasksCount(dailyTask.tasks)} /{" "}
                      {dailyTask.tasks.length}
                    </td>
                    <td className="px-4 py-3">
                      {dailyTask.overallScore !== null
                        ? `${dailyTask.overallScore?`${dailyTask.overallScore}/5`:"You not complete this task"}`
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-blue-500 hover:underline">
                      View Details
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedDailyTask}
        onOpenChange={() => setSelectedDailyTask(null)}
      >
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Daily Task Details</DialogTitle>
          </DialogHeader>

          {selectedDailyTask && (
            <div className="space-y-6 text-sm text-gray-700">
              <div className="flex items-center space-x-4">
                <p>
                  <strong>Date:</strong>{" "}
                  {format(
                    new Date(selectedDailyTask.createdAt || ""),
                    "dd MMM yyyy"
                  )}
                </p>
                <p>
                  <strong>Tasks Completed:</strong>{" "}
                  {getCompletedTasksCount(selectedDailyTask.tasks)} /{" "}
                  {selectedDailyTask.tasks.length}
                </p>
                {selectedDailyTask.overallScore !== null && (
                  <p>
                    <strong>Overall Score:</strong>{" "}
                    {selectedDailyTask.overallScore} / 5
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-base">Individual Tasks:</h3>
                {selectedDailyTask.tasks.map((task, index) => {
                  const Icon = taskIcons[task.type];

                  return (
                    <div
                      key={index}
                      className="p-4 mt-3 bg-gray-50 rounded border border-gray-200 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4 text-gray-600" />
                          <h4 className="font-medium capitalize text-base">
                            {task.type}
                          </h4>
                        </div>
                        <Badge
                          variant={task.isCompleted ? "default" : "secondary"}
                        >
                          {task.isCompleted ? "Completed" : "Not Completed"}
                        </Badge>
                      </div>
                      {task.prompt && (
                        <div>
                          <p className="text-sm font-semibold">Prompt:</p>
                          {task.type === "listening" ? (
                            <>
                              <Button
                                className="w-full mt-1"
                                onClick={() => handleTextToSpeech(task.prompt)}
                              >
                                <Play className="h-4 w-4 mr-2" />
                                Play Audio
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full"
                                onClick={stopTextToSpeech}
                              >
                                Stop Audio
                              </Button>
                            </>
                          ) : (
                            <p className="text-gray-800 mt-1">{task.prompt}</p>
                          )}
                        </div>
                      )}
                      {task.isCompleted && task.userResponse && (
                        <div className="text-sm text-gray-800">
                          <p className="font-semibold">Your Answer:</p>
                          {task.type === "speaking" ||
                          task.type === "listening" ? (
                            <audio
                              controls
                              src={task.userResponse}
                              className="mt-2 w-full"
                            >
                              Your browser does not support the audio element.
                            </audio>
                          ) : (
                            <p className="mt-1 p-2 bg-white rounded border border-gray-200">
                              {task.userResponse}
                            </p>
                          )}
                        </div>
                      )}

                      {task.isCompleted && task.aiFeedback && (
                        <div>
                          <p className="text-sm font-semibold">AI Feedback:</p>
                          <p className="text-gray-800 mt-1">
                            {task.aiFeedback}
                          </p>
                        </div>
                      )}

                      {typeof task.score === "number" && (
                        <p className="text-sm text-gray-800">
                          <strong>Score:</strong> {task.score} / 5
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
