"use client"

import { useEffect, useState } from "react"
import {
    Users, Globe, MessageSquare, Building2, TrendingUp,
    Eye, ArrowUpRight, ArrowDownRight, Bot, Clock, RefreshCw
} from "lucide-react"
import AdminHeader from "@/components/admin/Header"
import StatCard from "@/components/admin/StatCard"
import TrafficChart from "@/components/admin/TrafficChart"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface DashboardData {
    analytics: {
        total_visitors: number
        unique_visitors: number
        total_countries: number
        visitors_today: number
    }
    contacts: {
        total: number
        pending: number
        contacted: number
        closed: number
    }
    content: {
        total: number
        published: number
        draft: number
    }
    chatbot: {
        total_interactions: number
        avg_confidence: number
    }
    recentContacts: Array<{
        id: number
        name: string
        email: string
        request_type: string
        status: string
        created_at: string
    }>
    traffic: Array<{ date: string; visitors: number }>
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(true)
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

    const fetchData = async () => {
        try {
            const [analyticsRes, contactsRes, contentRes, chatbotRes, recentRes, trafficRes] = await Promise.all([
                fetch(`${API_BASE}/api/analytics/dashboard/summary/`),
                fetch(`${API_BASE}/api/contacts/admin/stats/`),
                fetch(`${API_BASE}/api/content/admin/stats/`),
                fetch(`${API_BASE}/api/chatbot/admin/stats/`),
                fetch(`${API_BASE}/api/contacts/admin/`),
                fetch(`${API_BASE}/api/analytics/dashboard/traffic/?days=7`),
            ])

            const analytics = analyticsRes.ok ? await analyticsRes.json() : {}
            const contacts = contactsRes.ok ? await contactsRes.json() : {}
            const content = contentRes.ok ? await contentRes.json() : {}
            const chatbot = chatbotRes.ok ? await chatbotRes.json() : {}
            const recentContacts = recentRes.ok ? (await recentRes.json()).slice(0, 5) : []
            const traffic = trafficRes.ok ? await trafficRes.json() : []

            setData({ analytics, contacts, content, chatbot, recentContacts, traffic })
            setLastUpdate(new Date())
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-500/20 text-amber-400'
            case 'CONTACTED': return 'bg-blue-500/20 text-blue-400'
            case 'CLOSED': return 'bg-emerald-500/20 text-emerald-400'
            default: return 'bg-slate-500/20 text-slate-400'
        }
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'INVESTMENT': return 'Investissement'
            case 'INFO': return 'Information'
            case 'MEETING': return 'Rendez-vous'
            default: return type
        }
    }

    return (
        <div className="min-h-screen">
            <AdminHeader
                title="Dashboard"
                subtitle="Vue d'ensemble de votre activité"
            />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Last Update */}
                <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        Dernière mise à jour: {formatDistanceToNow(lastUpdate, { addSuffix: true, locale: fr })}
                    </p>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-1 text-xs text-[#C4A052] hover:text-[#D4B062]"
                    >
                        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                        Actualiser
                    </button>
                </div>

                {/* KPI Cards - 2 columns on mobile, 4 on desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    <StatCard
                        title="Visiteurs"
                        value={data?.analytics.total_visitors || 0}
                        icon={Users}
                        color="gold"
                        change={{ value: 12, isPositive: true }}
                    />
                    <StatCard
                        title="Messages"
                        value={data?.contacts.pending || 0}
                        icon={MessageSquare}
                        color="blue"
                        suffix=" en attente"
                    />
                    <StatCard
                        title="Espaces"
                        value={data?.content.published || 0}
                        icon={Building2}
                        color="green"
                        suffix=" publiés"
                    />
                    <StatCard
                        title="Chatbot"
                        value={data?.chatbot.total_interactions || 0}
                        icon={Bot}
                        color="purple"
                        suffix=" conv."
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Traffic Chart - 2 columns */}
                    <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4 lg:p-6">
                        <div className="flex items-center justify-between mb-4 lg:mb-6">
                            <div>
                                <h3 className="text-base lg:text-lg font-semibold text-white">Trafic (7 jours)</h3>
                                <p className="text-xs lg:text-sm text-slate-400">Visiteurs par jour</p>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs lg:text-sm">
                                <ArrowUpRight className="w-4 h-4" />
                                +12%
                            </div>
                        </div>
                        <div className="h-48 lg:h-64">
                            <TrafficChart data={data?.traffic || []} isLoading={loading} />
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4 lg:p-6">
                        <h3 className="text-base lg:text-lg font-semibold text-white mb-4">Statistiques Rapides</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                                <span className="text-sm text-slate-400">Pays différents</span>
                                <span className="text-lg font-bold text-white">{data?.analytics.total_countries || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                                <span className="text-sm text-slate-400">Visiteurs uniques</span>
                                <span className="text-lg font-bold text-white">{data?.analytics.unique_visitors || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                                <span className="text-sm text-slate-400">Aujourd'hui</span>
                                <span className="text-lg font-bold text-[#C4A052]">{data?.analytics.visitors_today || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                                <span className="text-sm text-slate-400">Confiance Chatbot</span>
                                <span className="text-lg font-bold text-emerald-400">{data?.chatbot.avg_confidence || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Contacts */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base lg:text-lg font-semibold text-white">Messages Récents</h3>
                        <Link href="/admin/messages" className="text-xs lg:text-sm text-[#C4A052] hover:underline flex items-center gap-1">
                            Voir tout <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {/* Mobile: Cards, Desktop: Table */}
                    <div className="lg:hidden space-y-3">
                        {data?.recentContacts?.length === 0 ? (
                            <p className="text-center text-slate-500 py-8">Aucun message</p>
                        ) : (
                            data?.recentContacts?.map((contact) => (
                                <div key={contact.id} className="p-4 bg-slate-800/30 rounded-xl">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="font-medium text-white">{contact.name}</p>
                                            <p className="text-xs text-slate-500">{contact.email}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(contact.status)}`}>
                                            {contact.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-slate-400">
                                        <span>{getTypeLabel(contact.request_type)}</span>
                                        <span>{formatDistanceToNow(new Date(contact.created_at), { addSuffix: true, locale: fr })}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
                                    <th className="pb-3 font-medium">Nom</th>
                                    <th className="pb-3 font-medium">Email</th>
                                    <th className="pb-3 font-medium">Type</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {data?.recentContacts?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-slate-500 py-8">Aucun message</td>
                                    </tr>
                                ) : (
                                    data?.recentContacts?.map((contact) => (
                                        <tr key={contact.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                                            <td className="py-3 text-white font-medium">{contact.name}</td>
                                            <td className="py-3 text-slate-400">{contact.email}</td>
                                            <td className="py-3 text-slate-400">{getTypeLabel(contact.request_type)}</td>
                                            <td className="py-3">
                                                <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(contact.status)}`}>
                                                    {contact.status}
                                                </span>
                                            </td>
                                            <td className="py-3 text-slate-500 text-xs">
                                                {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true, locale: fr })}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
