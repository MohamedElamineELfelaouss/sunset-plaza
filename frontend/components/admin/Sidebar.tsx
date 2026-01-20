"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
    LayoutDashboard,
    Building2,
    MessageSquare,
    Settings,
    TrendingUp,
    LogOut,
    Bot,
    Menu,
    X,
    ChevronLeft
} from "lucide-react"

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Espaces", href: "/admin/listings", icon: Building2 },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Chatbot", href: "/admin/chatbot", icon: Bot },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Paramètres", href: "/admin/settings", icon: Settings },
]

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 
                ${collapsed ? 'w-20' : 'w-64'} 
                bg-gradient-to-b from-slate-900 to-slate-950 
                border-r border-slate-800/50 
                flex flex-col
                transform transition-all duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between px-4 py-5 border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C4A052] to-[#8B7355] flex items-center justify-center shadow-lg shadow-[#C4A052]/20">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        {!collapsed && (
                            <div>
                                <h1 className="font-serif text-lg font-bold text-white">Sunset Plaza</h1>
                                <p className="text-xs text-slate-500">Administration</p>
                            </div>
                        )}
                    </div>

                    {/* Mobile Close */}
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-white lg:hidden"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Desktop Collapse */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href))

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                title={collapsed ? item.name : undefined}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium 
                                    transition-all duration-200
                                    ${collapsed ? 'justify-center' : ''}
                                    ${isActive
                                        ? "bg-gradient-to-r from-[#C4A052]/20 to-transparent text-[#C4A052] border-l-2 border-[#C4A052]"
                                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    }
                                `}
                            >
                                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#C4A052]" : ""}`} />
                                {!collapsed && item.name}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-slate-800/50">
                    <Link
                        href="/"
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                            text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors
                            ${collapsed ? 'justify-center' : ''}
                        `}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && "Déconnexion"}
                    </Link>
                </div>
            </aside>
        </>
    )
}
