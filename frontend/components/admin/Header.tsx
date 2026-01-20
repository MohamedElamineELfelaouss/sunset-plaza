"use client"

import { Bell, Search, Menu, User, ChevronDown, MessageSquare, Building2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useSidebar } from "@/app/admin/layout"
import { useRouter } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

interface AdminHeaderProps {
    title: string
    subtitle?: string
}

interface Notification {
    id: number
    type: 'contact' | 'listing'
    text: string
    time: string
    unread: boolean
    link: string
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
    const { openSidebar } = useSidebar()
    const router = useRouter()
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(false)

    // Fetch real notifications from backend (recent contacts)
    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        setLoading(true)
        try {
            // Fetch recent contact requests as notifications
            const res = await fetch(`${API_BASE}/api/contacts/admin/`)
            if (res.ok) {
                const contacts = await res.json()
                // Convert contacts to notifications (show last 5 pending ones)
                const pendingContacts = contacts
                    .filter((c: any) => c.status === 'PENDING')
                    .slice(0, 5)
                    .map((c: any) => ({
                        id: c.id,
                        type: 'contact' as const,
                        text: `Nouveau message de ${c.name}`,
                        time: formatTimeAgo(c.created_at),
                        unread: c.status === 'PENDING',
                        link: '/admin/messages'
                    }))
                setNotifications(pendingContacts)
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return "À l'instant"
        if (diffMins < 60) return `Il y a ${diffMins} min`
        if (diffHours < 24) return `Il y a ${diffHours}h`
        return `Il y a ${diffDays}j`
    }

    const handleNotificationClick = (notification: Notification) => {
        setShowNotifications(false)
        router.push(notification.link)
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('access_token')
        sessionStorage.removeItem('adminToken')
        router.push('/')
    }

    const unreadCount = notifications.filter(n => n.unread).length

    return (
        <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50">
            <div className="flex items-center justify-between px-4 lg:px-6 py-4">
                {/* Left: Menu + Title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={openSidebar}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl lg:text-2xl font-bold text-white">{title}</h1>
                        {subtitle && (
                            <p className="text-xs lg:text-sm text-slate-400 mt-0.5">{subtitle}</p>
                        )}
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 lg:gap-3">
                    {/* Search - Hidden on mobile */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/50 focus:border-[#C4A052]/50 transition-colors"
                        />
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications)
                                if (!showNotifications) fetchNotifications()
                            }}
                            className="relative p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            <Bell className="w-5 h-5 text-slate-400" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C4A052] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                                <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-white">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="px-2 py-0.5 bg-[#C4A052]/20 text-[#C4A052] text-xs rounded-full">
                                            {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                                        </span>
                                    )}
                                </div>
                                <div className="max-h-72 overflow-y-auto">
                                    {loading ? (
                                        <div className="p-4 text-center">
                                            <div className="w-5 h-5 border-2 border-[#C4A052] border-t-transparent rounded-full animate-spin mx-auto" />
                                        </div>
                                    ) : notifications.length === 0 ? (
                                        <div className="p-6 text-center">
                                            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                            <p className="text-sm text-slate-500">Aucune notification</p>
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div
                                                key={n.id}
                                                onClick={() => handleNotificationClick(n)}
                                                className={`p-3 hover:bg-slate-800/50 cursor-pointer flex items-start gap-3 transition-colors ${n.unread ? 'bg-[#C4A052]/5' : ''}`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${n.type === 'contact' ? 'bg-blue-500/20' : 'bg-emerald-500/20'}`}>
                                                    {n.type === 'contact' ? (
                                                        <MessageSquare className="w-4 h-4 text-blue-400" />
                                                    ) : (
                                                        <Building2 className="w-4 h-4 text-emerald-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-white truncate">{n.text}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                                                </div>
                                                {n.unread && (
                                                    <div className="w-2 h-2 bg-[#C4A052] rounded-full flex-shrink-0 mt-1.5" />
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-2 border-t border-slate-800">
                                    <button
                                        onClick={() => {
                                            setShowNotifications(false)
                                            router.push('/admin/messages')
                                        }}
                                        className="w-full py-2 text-center text-xs text-[#C4A052] hover:bg-slate-800/50 rounded-lg transition-colors"
                                    >
                                        Voir tous les messages
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 p-2 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#C4A052] to-[#8B7355] flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm text-white hidden sm:block">Admin</span>
                            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                                <button
                                    onClick={() => {
                                        setShowUserMenu(false)
                                        router.push('/admin/settings')
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                >
                                    Mon Profil
                                </button>
                                <button
                                    onClick={() => {
                                        setShowUserMenu(false)
                                        router.push('/admin/settings')
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                                >
                                    Paramètres
                                </button>
                                <hr className="border-slate-800" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                >
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
