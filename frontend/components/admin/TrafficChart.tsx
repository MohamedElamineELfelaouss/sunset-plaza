"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from "recharts"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"

interface TrafficData {
    date: string
    visitors: number
}

interface TrafficChartProps {
    data: TrafficData[]
    isLoading?: boolean
}

export default function TrafficChart({ data, isLoading }: TrafficChartProps) {
    if (isLoading) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#C4A052] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
                Aucune donnée disponible
            </div>
        )
    }

    const formattedData = data.map(item => ({
        ...item,
        formattedDate: format(parseISO(item.date), 'dd MMM', { locale: fr })
    }))

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={formattedData}>
                <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C4A052" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C4A052" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                    dataKey="formattedDate"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                    }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    itemStyle={{ color: '#C4A052' }}
                    formatter={(value: number) => [value.toLocaleString() + ' visiteurs', '']}
                    labelFormatter={(label) => label}
                />
                <Area
                    type="monotone"
                    dataKey="visitors"
                    stroke="#C4A052"
                    strokeWidth={2}
                    fill="url(#colorVisitors)"
                    dot={false}
                    activeDot={{
                        stroke: '#C4A052',
                        strokeWidth: 2,
                        fill: '#0f172a',
                        r: 6
                    }}
                />
            </AreaChart>
        </ResponsiveContainer>
    )
}
