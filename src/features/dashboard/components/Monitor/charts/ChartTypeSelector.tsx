import { ToggleGroup, ToggleGroupItem } from "@/shared/components/ui/toggle-group"
import { AreaChartIcon, BarChart3, LineChart, PieChart } from "lucide-react"
import type { ChartType } from "../types"

interface ChartTypeSelectorProps {
    value: ChartType
    onChange: (type: ChartType) => void
    supportedTypes?: ChartType[]
}

export function ChartTypeSelector({ value, onChange, supportedTypes = ["area", "line", "bar", "pie"] }: ChartTypeSelectorProps) {
    const iconMap = {
        area: AreaChartIcon,
        line: LineChart,
        bar: BarChart3,
        pie: PieChart,
    }

    return (
        <ToggleGroup type="single" value={value} onValueChange={(v) => v && onChange(v as ChartType)} className="justify-start">
            {supportedTypes.map((type) => {
                const Icon = iconMap[type]
                return (
                    <ToggleGroupItem key={type} value={type} aria-label={`${type} chart`} size="sm">
                        <Icon className="h-4 w-4" />
                    </ToggleGroupItem>
                )
            })}
        </ToggleGroup>
    )
}
