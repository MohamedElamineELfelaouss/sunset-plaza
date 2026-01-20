import { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    suffix?: string
    change?: {
        value: number
        isPositive: boolean
    }
    color?: "gold" | "green" | "blue" | "purple"
}

const colorClasses = {
    gold: {
        bg: "bg-[#C4A052]/10",
        border: "border-[#C4A052]/20",
        icon: "text-[#C4A052]",
        gradient: "from-[#C4A052] to-[#A08642]"
    },
    green: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: "text-emerald-500",
        gradient: "from-emerald-500 to-emerald-600"
    },
    blue: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        icon: "text-blue-500",
        gradient: "from-blue-500 to-blue-600"
    },
    purple: {
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        icon: "text-purple-500",
        gradient: "from-purple-500 to-purple-600"
    },
}

export default function StatCard({ title, value, icon: Icon, suffix, change, color = "gold" }: StatCardProps) {
    const colors = colorClasses[color]

    return (
        <div className={`relative overflow-hidden rounded-2xl border ${colors.border} ${colors.bg} p-6`}>
            {/* Background gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.gradient} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2`} />

            <div className="relative">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>

                {/* Value */}
                <p className="text-3xl font-bold text-white mb-1">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </p>

                {/* Title & Change */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">{title}{suffix && <span className="text-xs ml-1">{suffix}</span>}</p>
                    {change && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${change.isPositive
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                            }`}>
                            {change.isPositive ? "+" : ""}{change.value}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}
