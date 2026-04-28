import { ChevronDown, Check } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import { cn } from "@/shared/lib/utils"
import type { TestType } from "@/features/dashboard/types/TestTypes"

const FIXED_TESTS: Array<{ id: TestType; name: string }> = [
    { id: "access", name: "Acesso" },
    { id: "deposit", name: "Depósito" }
]

interface TestDropdownProps {
    selectedTestId?: TestType
    onTestSelect: (testId: TestType) => void
}

export function TestDropdown({ selectedTestId, onTestSelect }: TestDropdownProps) {
    const currentTest = FIXED_TESTS.find((t) => t.id === selectedTestId)

    return (
        <div className="group relative inline-block">
            <Button
                variant="outline"
                className="w-[200px] justify-between font-normal hover:bg-accent hover:text-accent-foreground"
            >
                <span className="truncate">
                    {currentTest?.name ?? "Selecionar teste"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>

            <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-popover text-popover-foreground border rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                    {FIXED_TESTS.map((test) => (
                        <button
                            key={test.id}
                            onClick={() => onTestSelect(test.id)}
                            className={cn(
                                "w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 hover:bg-accent hover:text-accent-foreground",
                                selectedTestId === test.id && "bg-accent text-accent-foreground font-medium"
                            )}
                        >
                            <Check
                                className={cn(
                                    "h-4 w-4 shrink-0",
                                    selectedTestId === test.id ? "opacity-100" : "opacity-0"
                                )}
                            />
                            <span className="truncate">{test.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
