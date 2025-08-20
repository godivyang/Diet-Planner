"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "../../../lib/utils"
import { Button } from "./Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./Popover"

export function Combobox({data, onChange}) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(Array<string>())

  React.useEffect(() => {
    onChange(selected);
  }, [selected])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="secondary" role="combobox" aria-expanded={open} className="min-w-min h-full justify-between text-2xl py-4">
          <div className="flex flex-col">
          {selected.length ? selected.map((name, i) => <span key={i} className="text-left font-bold text-cyan-500">{name}</span>) : <span className="text-muted-foreground">Select names...</span>}
          </div>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-min p-0">
        <Command>
          <CommandInput placeholder="Search name..." className="text-2xl"/>
          <CommandList>
            <CommandEmpty>No name found.</CommandEmpty>
            <CommandGroup className="flex flex-col">
              {data.map((d) => (
                <CommandItem
                  key={d._id}
                  value={d.name}
                  onSelect={(currentValue) => {
                    // console.log(currentValue)
                    if(selected.includes(currentValue)) {
                      selected.splice(selected.indexOf(currentValue), 1);
                    } else {
                      selected.push(currentValue);
                    }
                    setSelected([...selected]);
                    // setOpen(false)
                  }}
                  className="text-2xl"
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(d.name) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {d.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}