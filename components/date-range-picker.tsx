"use client"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DayPicker, type DateRange } from "react-day-picker"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  date: DateRange | undefined
  setDate: (date: DateRange) => void
  className?: string
}

export function DateRangePicker({ date, setDate, className }: DateRangePickerProps) {
  const [defaultMonth, setDefaultMonth] = useState<Date | undefined>(undefined)

  // Set default month based on date prop when available
  useEffect(() => {
    if (date?.from) {
      setDefaultMonth(date.from)
    } else {
      setDefaultMonth(new Date())
    }
  }, [date])

  // Handle date selection
  const handleSelect = (selectedDate: DateRange | undefined) => {
    if (selectedDate) {
      setDate(selectedDate)
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
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            autoFocus
            mode="range"
            defaultMonth={defaultMonth}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            required={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}