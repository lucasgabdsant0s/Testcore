import { useState } from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart as RechartsLineChart, Pie, PieChart as RechartsPieChart, Cell, XAxis, YAxis, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/components/ui/chart"
import { ChartTypeSelector } from "./ChartTypeSelector"
import type { ChartType, LoginData } from "../types"

interface LoginStatusChartProps {
    data: LoginData[]
}

export function LoginStatusChart({ data }: LoginStatusChartProps) {
    const [chartType, setChartType] = useState<ChartType>("area")

    const chartData = data.map((d) => ({
        time: new Date(d.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        Sucesso: d.successful,
        Falha: d.failed,
    }))

    const totalSuccessful = data.reduce((sum, d) => sum + d.successful, 0)
    const totalFailed = data.reduce((sum, d) => sum + d.failed, 0)
    const pieData = [
        { name: "Sucesso", value: totalSuccessful, fill: "#16a34a" },
        { name: "Falha", value: totalFailed, fill: "#dc2626" },
    ]

    const chartConfig = {
        Sucesso: {
            label: "Sucessos",
            color: "#16a34a",
        },
        Falha: {
            label: "Falhas",
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
                            dataKey="Sucesso"
                            stroke="#16a34a"
                            fill="#16a34a"
                            fillOpacity={0.4}
                        />
                        <Area
                            type="monotone"
                            dataKey="Falha"
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
                            dataKey="Sucesso"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="Falha"
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
                        <Bar dataKey="Sucesso" fill="#16a34a" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Falha" fill="#dc2626" radius={[4, 4, 0, 0]} />
                    </BarChart>
                )
            case "pie":
                return (
                    <RechartsPieChart>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <Legend />
                    </RechartsPieChart>
                )
            default:
                return null
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle>Status de Login</CardTitle>
                    <CardDescription>Taxa de sucesso nas últimas 24 horas</CardDescription>
                </div>
                <ChartTypeSelector value={chartType} onChange={setChartType} />
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    {renderChart()}
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
