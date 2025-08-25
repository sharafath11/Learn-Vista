"use client"

import type { UseFormReturn } from "react-hook-form"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/shared/components/ui/card"
import { Input } from "@/src/components/shared/components/ui/input"
import { Label } from "@/src/components/shared/components/ui/label"
import { Button } from "@/src/components/shared/components/ui/button"
import { Calendar } from "@/src/components/shared/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/shared/components/ui/popover"
import { cn } from "@/lib/utils"
import type { CourseFormValues } from "./schema"

interface ScheduleSectionProps {
  form: UseFormReturn<CourseFormValues>
}

export function ScheduleSection({ form }: ScheduleSectionProps) {
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date:any) => form.setValue("startDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date:any) => form.setValue("endDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input id="startTime" type="time" className="pl-9" {...form.register("startTime")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

