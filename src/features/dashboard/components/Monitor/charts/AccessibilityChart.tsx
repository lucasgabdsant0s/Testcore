import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart as RechartsLineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/chart"
import { ChartTypeSelector } from "./ChartTypeSelector"
import type { ChartType } from "../types"
import type { MonitorLog } from "@/features/dashboard/services/monitoringApi"
import type { TestType } from "@/features/dashboard/types/TestTypes"

interface AccessibilityChartProps {
    data: MonitorLog[]
}

export function AccessibilityChart({ data }: AccessibilityChartProps) {
    const [chartType, setChartType] = useState<ChartType>("area")

    const labels = {
        title: "Acessibilidade do Site",
        description: "Uptime baseado em",
        yAxisLabel: "Acessibilidade (%)",
        emptyMessage: "Inicie o monitoramento para ver o gráfico de acessibilidade"
    }

    const chartData = data
        .slice()
        .reverse()
        .reduce((acc: Array<{ time: string; uptime: number; count: number; upCount: number }>, log) => {
            const date = new Date(log.createdAt)
            const timeKey = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

            const existing = acc.find((item) => item.time === timeKey)
            if (existing) {
                existing.count++
                if (log.status === "UP") existing.upCount++
                existing.uptime = (existing.upCount / existing.count) * 100
            } else {
                acc.push({
                    time: timeKey,
                    uptime: log.status === "UP" ? 100 : 0,
                    count: 1,
                    upCount: log.status === "UP" ? 1 : 0,
                })
            }
            return acc
        }, [])
        .slice(-20)

    const chartConfig = {
        uptime: {
            label: "Acessibilidade (%)",
            color: "#2563eb",
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
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                            type="monotone"
                            dataKey="uptime"
                            stroke="#2563eb"
                            fill="#2563eb"
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
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            type="monotone"
                            dataKey="uptime"
                            stroke="#2563eb"
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
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="uptime" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    </BarChart>
                )
            default:
                return null
        }
    }

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{labels.title}</CardTitle>
                    <CardDescription>Nenhum dado disponível</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                        {labels.emptyMessage}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle>{labels.title}</CardTitle>
                    <CardDescription>{labels.description} {data.length} verific ações</CardDescription>
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
