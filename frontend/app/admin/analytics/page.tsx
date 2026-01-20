"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, Globe, Clock, Monitor, Smartphone, Tablet, MapPin, ArrowUpRight } from "lucide-react"
import AdminHeader from "@/components/admin/Header"
import TrafficChart from "@/components/admin/TrafficChart"
import DevicePieChart from "@/components/admin/DevicePieChart"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface TrafficData { date: string; visitors: number }
interface DeviceData { name: string; value: number; color: string }
interface CountryData { country: string; country_code: string; visitors: number }
interface VisitorData { id: number; country: string; country_code: string; city: string; device: string; page: string; time: string }

export default function AnalyticsPage() {
    const [traffic, setTraffic] = useState<TrafficData[]>([])
    const [devices, setDevices] = useState<DeviceData[]>([])
    const [countries, setCountries] = useState<CountryData[]>([])
    const [visitors, setVisitors] = useState<VisitorData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [trafficRes, devicesRes, countriesRes, visitorsRes] = await Promise.all([
                    fetch(`${API_BASE}/api/analytics/dashboard/traffic/?days=30`),
                    fetch(`${API_BASE}/api/analytics/dashboard/devices/`),
                    fetch(`${API_BASE}/api/analytics/dashboard/countries/?limit=10`),
                    fetch(`${API_BASE}/api/analytics/dashboard/visitors/?limit=20`),
                ])

                if (trafficRes.ok) setTraffic(await trafficRes.json())
                if (devicesRes.ok) setDevices(await devicesRes.json())
                if (countriesRes.ok) setCountries(await countriesRes.json())
                if (visitorsRes.ok) setVisitors(await visitorsRes.json())
            } catch (error) {
                console.error('Failed to fetch analytics:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [])

    const getFlagEmoji = (countryCode: string) => {
        if (!countryCode) return '🌍'
        const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0))
        return String.fromCodePoint(...codePoints)
    }

    const totalVisitors = traffic.reduce((sum, d) => sum + d.visitors, 0)

    return (
        <div className="min-h-screen">
            <AdminHeader
                title="Analytics"
                subtitle="Analyses détaillées du trafic"
            />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-[#C4A052]/20">
                                <TrendingUp className="w-5 h-5 text-[#C4A052]" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{totalVisitors}</p>
                        <p className="text-xs text-slate-400">Vues (30j)</p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <Monitor className="w-5 h-5 text-blue-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{devices.length}</p>
                        <p className="text-xs text-slate-400">Types d'appareils</p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-emerald-500/20">
                                <Globe className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{countries.length}</p>
                        <p className="text-xs text-slate-400">Pays</p>
                    </div>
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <Users className="w-5 h-5 text-purple-400" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{visitors.length}</p>
                        <p className="text-xs text-slate-400">Récents</p>
                    </div>
                </div>

                {/* Traffic Chart */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Évolution du Trafic</h3>
                            <p className="text-sm text-slate-400">Visiteurs par jour (30 derniers jours)</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-[#C4A052]" />
                    </div>
                    <div className="h-64 lg:h-80">
                        <TrafficChart data={traffic} isLoading={loading} />
                    </div>
                </div>

                {/* Bottom Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Device Distribution */}
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4 lg:p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Appareils</h3>
                        <DevicePieChart data={devices} isLoading={loading} />
                    </div>

                    {/* Countries */}
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4 lg:p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Top Pays</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {countries.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">Aucune donnée</p>
                            ) : (
                                countries.map((country, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl">
                                        <span className="text-xl">{getFlagEmoji(country.country_code)}</span>
                                        <span className="flex-1 text-sm text-white truncate">{country.country}</span>
                                        <span className="text-sm font-semibold text-[#C4A052]">{country.visitors}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Visitors */}
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4 lg:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Visiteurs Live</h3>
                            <span className="flex items-center gap-1 text-xs text-emerald-400">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                En direct
                            </span>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {visitors.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">Aucun visiteur</p>
                            ) : (
                                visitors.slice(0, 8).map((visitor) => (
                                    <div key={visitor.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/30">
                                        <span className="text-sm">{getFlagEmoji(visitor.country_code)}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-white truncate">{visitor.city}, {visitor.country}</p>
                                            <p className="text-xs text-slate-500">{visitor.page}</p>
                                        </div>
                                        <span className="text-xs text-slate-500">
                                            {formatDistanceToNow(new Date(visitor.time), { addSuffix: true, locale: fr })}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
