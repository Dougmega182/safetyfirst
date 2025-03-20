// safetyfirst/components/date-range-picker.tsx
// /components/date-range-picker.tsx
"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/public/components/ui/button.jsx"
import { Calendar } from "@/public/components/ui/calendar.jsx"
import { Popover, PopoverContent, PopoverTrigger } from "@/public/components/ui/popover.jsx"

interface DateRangePickerProps {
  readonly date: DateRange | undefined
  readonly setDate: (date: DateRange) => void
  readonly className?: string
}

export function DateRangePicker({ date, setDate, className }: DateRangePickerProps) {
  let displayDate = "Pick a date range";
  if (date?.from) {
    if (date.to) {
      displayDate = `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`;
    } else {
      displayDate = format(date.from, "LLL dd, y");
    }
  }
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayDate}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            required={true} // Add the required prop to fix the error
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

