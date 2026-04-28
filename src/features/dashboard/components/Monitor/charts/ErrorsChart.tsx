import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart as RechartsLineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/chart"
import { ChartTypeSelector } from "./ChartTypeSelector"
import type { ChartType, ErrorData } from "../types"

interface ErrorsChartProps {
    data: ErrorData[]
}

export function ErrorsChart({ data }: ErrorsChartProps) {
    const [chartType, setChartType] = useState<ChartType>("area")

    const chartData = data.map((d) => ({
        time: new Date(d.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        count: d.count,
    }))

    const chartConfig = {
        count: {
            label: "Número de Erros",
            color: "#dc2626",
        },
    }

    const renderChart = () => {
        const commonProps = {
            data: chartData,
            margin: { top: 10, right: 10, left: 0, bottom: 0 },
        }

        switch (chartType) {
            case "area":
                return (
                    <AreaChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 5)}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#dc2626"
                            fill="#dc2626"
                            fillOpacity={0.4}
                        />
                    </AreaChart>
                )
            case "line":
                return (
                    <RechartsLineChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 5)}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#dc2626"
                            strokeWidth={2}
                            dot={false}
                        />
                    </RechartsLineChart>
                )
            case "bar":
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 5)}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                )
            default:
                return null
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle>Rastreamento de Erros</CardTitle>
                    <CardDescription>Erros detectados nas últimas 24 horas</CardDescription>
                </div>
                <ChartTypeSelector value={chartType} onChange={setChartType} supportedTypes={["area", "line", "bar"]} />
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    {renderChart()}
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
