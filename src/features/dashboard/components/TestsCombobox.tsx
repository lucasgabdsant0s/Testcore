import { useMemo, useState } from "react"
import { Button } from "@/shared/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/shared/lib/utils"

export type SavedTest = {
  id: string
  name: string
}

type TestsCombobox = {
  tests: SavedTest[]
  value?: string
  onSelect: (id: string | undefined) => void
  placeholder?: string
  disabled?: boolean
}

export function TestsCombobox({
  tests,
  value,
  onSelect,
  placeholder = "Selecionar teste salvo",
  disabled,
}: TestsCombobox) {
  const [open, setOpen] = useState(false)
  const selected = useMemo(() => tests.find((t) => t.id === value)?.name, [tests, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[260px] justify-between"
          disabled={disabled}
        >
          <span className={cn("truncate text-left", !selected && "text-muted-foreground")}>
            {selected ?? placeholder}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <Command>
          <CommandInput placeholder="Buscar teste..." />
          <CommandList>
            <CommandEmpty>Nenhum teste encontrado.</CommandEmpty>
            <CommandGroup>
              {tests.length === 0 ? (
                <CommandItem disabled>Nenhum teste salvo</CommandItem>
              ) : (
                tests.map((test) => (
                  <CommandItem
                    key={test.id}
                    onSelect={() => {
                      const next = test.id === value ? undefined : test.id
                      onSelect(next)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 size-4", value === test.id ? "opacity-100" : "opacity-0")} />
                    <span className="truncate">{test.name}</span>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


