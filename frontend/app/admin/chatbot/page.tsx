"use client"

import { useEffect, useState } from "react"
import { Bot, MessageCircle, TrendingUp, Trash2, Filter, BarChart3 } from "lucide-react"
import AdminHeader from "@/components/admin/Header"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Interaction {
    id: number
    question: string
    response: string
    category: string
    confidence: number
    date: string
}

interface Stats {
    total_interactions: number
    avg_confidence: number
    by_category: Array<{ category: string; count: number }>
}

export default function ChatbotPage() {
    const [interactions, setInteractions] = useState<Interaction[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    const fetchData = async () => {
        try {
            const [interactionsRes, statsRes] = await Promise.all([
                fetch(`${API_BASE}/api/chatbot/admin/`),
                fetch(`${API_BASE}/api/chatbot/admin/stats/`),
            ])

            if (interactionsRes.ok) setInteractions(await interactionsRes.json())
            if (statsRes.ok) setStats(await statsRes.json())
        } catch (error) {
            console.error('Failed to fetch chatbot data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const deleteInteraction = async (id: number) => {
        try {
            await fetch(`${API_BASE}/api/chatbot/admin/${id}/`, { method: 'DELETE' })
            setInteractions(prev => prev.filter(i => i.id !== id))
        } catch (error) {
            console.error('Failed to delete:', error)
        }
    }

    const categories = [...new Set(interactions.map(i => i.category))]
    const filteredInteractions = categoryFilter === 'all'
        ? interactions
        : interactions.filter(i => i.category === categoryFilter)

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return 'text-emerald-400'
        if (confidence >= 0.5) return 'text-amber-400'
        return 'text-red-400'
    }

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Pricing': 'bg-blue-500/20 text-blue-400',
            'Investment': 'bg-purple-500/20 text-purple-400',
            'Location': 'bg-emerald-500/20 text-emerald-400',
            'General': 'bg-slate-500/20 text-slate-400',
            'Malfunction': 'bg-red-500/20 text-red-400',
        }
        return colors[category] || 'bg-slate-500/20 text-slate-400'
    }

    return (
        <div className="min-h-screen">
            <AdminHeader
                title="Chatbot"
                subtitle="Interactions avec l'assistant AI"
            />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-[#C4A052]/20">
                                <MessageCircle className="w-5 h-5 text-[#C4A052]" />
                            </div>
                            <span className="text-sm text-slate-400">Total</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats?.total_interactions || 0}</p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                            <span className="text-sm text-slate-400">Confiance Moy.</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats?.avg_confidence || 0}%</p>
                    </div>
                    <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <BarChart3 className="w-5 h-5 text-blue-400" />
                            </div>
                            <span className="text-sm text-slate-400">Par Catégorie</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {stats?.by_category?.map((cat) => (
                                <span
                                    key={cat.category}
                                    className={`px-2 py-1 rounded text-xs ${getCategoryColor(cat.category)}`}
                                >
                                    {cat.category}: {cat.count}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setCategoryFilter('all')}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${categoryFilter === 'all'
                            ? 'bg-[#C4A052] text-white'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                            }`}
                    >
                        Toutes
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${categoryFilter === cat
                                ? 'bg-[#C4A052] text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Interactions List */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="w-6 h-6 border-2 border-[#C4A052] border-t-transparent rounded-full animate-spin mx-auto" />
                        </div>
                    ) : filteredInteractions.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Aucune interaction</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800/50">
                            {filteredInteractions.map((interaction) => (
                                <div key={interaction.id} className="p-4 hover:bg-slate-800/20 transition-colors">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(interaction.category)}`}>
                                                    {interaction.category}
                                                </span>
                                                <span className={`text-xs ${getConfidenceColor(interaction.confidence)}`}>
                                                    Confiance: {Math.round(interaction.confidence * 100)}%
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {formatDistanceToNow(new Date(interaction.date), { addSuffix: true, locale: fr })}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="bg-slate-800/30 rounded-lg p-3">
                                                    <p className="text-xs text-slate-500 mb-1">Question:</p>
                                                    <p className="text-sm text-white">{interaction.question}</p>
                                                </div>
                                                <div className="bg-[#C4A052]/10 rounded-lg p-3">
                                                    <p className="text-xs text-[#C4A052] mb-1">Réponse AI:</p>
                                                    <p className="text-sm text-slate-300">{interaction.response}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteInteraction(interaction.id)}
                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
