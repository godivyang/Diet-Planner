"use client"

import * as React from "react"
import { Calendar1 } from "lucide-react"
import { Button } from "./Button"
import { Calendar } from "./Calendar"
import { Input } from "./Input"
import { Popover, PopoverContent, PopoverTrigger } from "./Popover"

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

export function Calendar28({
  date: controlledDate,
  onDateChange,
}: {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
}) {
  const [open, setOpen] = React.useState(false)
  const [uncontrolledDate, setUncontrolledDate] = React.useState<Date | undefined>(new Date())

  const date = controlledDate ?? uncontrolledDate
  const setDate = (d: Date | undefined) => {
    if (onDateChange) {
      onDateChange(d)
    } else {
      setUncontrolledDate(d)
    }
  }

  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [value, setValue] = React.useState(formatDate(date))

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder={new Date().toDateString()}
          className="bg-secondary pr-10 text-2xl font-bold h-14"
          onChange={(e) => {
            const d = new Date(e.target.value)
            setValue(e.target.value)
            if (isValidDate(d)) {
              setDate(d)
              setMonth(d)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 p-0 -translate-y-1/2"
            >
              <Calendar1 className="h-full w-full" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[100%] overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(d) => {
                setDate(d)
                setValue(formatDate(d))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
