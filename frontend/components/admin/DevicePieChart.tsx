"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface DeviceData {
    name: string
    value: number
    color: string
}

interface DevicePieChartProps {
    data: DeviceData[]
    isLoading?: boolean
}

export default function DevicePieChart({ data, isLoading }: DevicePieChartProps) {
    if (isLoading) {
        return (
            <div className="h-[200px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#C4A052] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[200px] flex items-center justify-center text-slate-500">
                Aucune donnée
            </div>
        )
    }

    const total = data.reduce((sum, d) => sum + d.value, 0)

    return (
        <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                        }}
                        formatter={(value: number, name: string) => [
                            `${value} (${Math.round((value / total) * 100)}%)`,
                            name
                        ]}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="flex justify-center gap-4 mt-2">
                {data.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-slate-400">
                            {entry.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
