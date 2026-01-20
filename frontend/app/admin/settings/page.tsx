"use client"

import { useState, useEffect } from "react"
import { User, Bell, Shield, Palette, Save, Moon, Sun, LogOut, Check, AlertCircle, Loader2 } from "lucide-react"
import AdminHeader from "@/components/admin/Header"
import { useRouter } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export default function SettingsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('profile')
    const [darkMode, setDarkMode] = useState(true)
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '+212 5XX-XXXXXX',
    })

    const [notifications, setNotifications] = useState({
        email: true,
        browser: false,
        newMessages: true,
        newVisitors: false,
    })

    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    })

    const tabs = [
        { id: 'profile', label: 'Profil', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Sécurité', icon: Shield },
        { id: 'appearance', label: 'Apparence', icon: Palette },
    ]

    useEffect(() => {
        fetchProfile()
        loadThemePreference()
        loadNotificationPreferences()
    }, [])

    const loadThemePreference = () => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme === 'light') {
            setDarkMode(false)
        } else {
            setDarkMode(true)
        }
    }

    const loadNotificationPreferences = () => {
        const savedNotifications = localStorage.getItem('notifications')
        if (savedNotifications) {
            try {
                setNotifications(JSON.parse(savedNotifications))
            } catch (e) {
                console.error('Error loading notification preferences:', e)
            }
        }
    }

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_BASE}/api/auth/admin/profile/`)
            if (response.ok) {
                const data = await response.json()
                setProfile({
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    email: data.email || '',
                    phone: '+212 5XX-XXXXXX',
                })
            }
        } catch (err) {
            console.error('Error fetching profile:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleSaveProfile = async () => {
        setSaving(true)
        setError(null)
        setSuccess(null)
        try {
            const response = await fetch(`${API_BASE}/api/auth/admin/profile/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    email: profile.email,
                }),
            })
            const data = await response.json()
            if (response.ok) {
                setSuccess('Profil mis à jour avec succès!')
                setSaved(true)
                setTimeout(() => { setSaved(false); setSuccess(null) }, 3000)
            } else {
                setError(data.email?.[0] || data.message || 'Erreur lors de la mise à jour')
            }
        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setSaving(false)
        }
    }

    const handleChangePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            setError('Les mots de passe ne correspondent pas.')
            return
        }
        if (passwords.new.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères.')
            return
        }

        setSaving(true)
        setError(null)
        setSuccess(null)
        try {
            const response = await fetch(`${API_BASE}/api/auth/admin/password/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_password: passwords.current,
                    new_password: passwords.new,
                    confirm_password: passwords.confirm,
                }),
            })
            const data = await response.json()
            if (response.ok) {
                setSuccess('Mot de passe modifié avec succès!')
                setPasswords({ current: '', new: '', confirm: '' })
                setTimeout(() => setSuccess(null), 3000)
            } else {
                setError(data.current_password?.[0] || data.confirm_password?.[0] || data.new_password?.[0] || 'Erreur')
            }
        } catch (err) {
            setError('Erreur de connexion au serveur')
        } finally {
            setSaving(false)
        }
    }

    const handleThemeChange = (isDark: boolean) => {
        setDarkMode(isDark)
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }

    const handleNotificationToggle = (key: string) => {
        const updated = { ...notifications, [key]: !notifications[key as keyof typeof notifications] }
        setNotifications(updated)
        localStorage.setItem('notifications', JSON.stringify(updated))
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('access_token')
        sessionStorage.removeItem('adminToken')
        router.push('/')
    }

    return (
        <div className="min-h-screen">
            <AdminHeader title="Paramètres" subtitle="Configuration du compte" />

            <div className="p-4 lg:p-6">
                {error && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300 text-xl">×</button>
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-400" />
                        <p className="text-green-400 text-sm">{success}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-2">
                            <div className="lg:hidden flex overflow-x-auto gap-1 pb-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-[#C4A052]/20 text-[#C4A052]' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                                    >
                                        <tab.icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="hidden lg:block space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-[#C4A052]/20 text-[#C4A052]' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                ))}
                                <hr className="border-slate-800 my-2" />
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 p-4 lg:p-6">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-white">Informations du Profil</h3>
                                {loading ? (
                                    <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 text-[#C4A052] animate-spin" /></div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Prénom</label>
                                                <input type="text" value={profile.first_name} onChange={e => setProfile(p => ({ ...p, first_name: e.target.value }))} placeholder="Votre prénom" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/50" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Nom</label>
                                                <input type="text" value={profile.last_name} onChange={e => setProfile(p => ({ ...p, last_name: e.target.value }))} placeholder="Votre nom" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/50" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                                            <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/50" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Téléphone</label>
                                            <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C4A052]/50" />
                                        </div>
                                        <button onClick={handleSaveProfile} disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-[#C4A052] hover:bg-[#B08A3E] text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                                            {saving ? 'Sauvegarde...' : saved ? 'Sauvegardé !' : 'Sauvegarder'}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Préférences de Notifications</h3>
                                    <p className="text-sm text-slate-400 mt-1">Configurez comment vous souhaitez être informé.</p>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { key: 'email', label: 'Notifications par Email', desc: 'Recevoir les alertes par email' },
                                        { key: 'browser', label: 'Notifications Navigateur', desc: 'Activer les notifications push' },
                                        { key: 'newMessages', label: 'Nouveaux Messages', desc: 'Alerter lors de nouveaux messages' },
                                        { key: 'newVisitors', label: 'Rapport Visiteurs', desc: 'Résumé quotidien des visiteurs' },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl gap-4">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">{item.label}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => handleNotificationToggle(item.key)}
                                                className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${notifications[item.key as keyof typeof notifications] ? 'bg-[#C4A052]' : 'bg-slate-600'}`}
                                            >
                                                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'}`} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">💡 Les préférences sont sauvegardées automatiquement.</p>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Sécurité du Compte</h3>
                                    <p className="text-sm text-slate-400 mt-1">Changez votre mot de passe.</p>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Mot de passe actuel</label>
                                        <input type="password" value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Nouveau mot de passe</label>
                                        <input type="password" value={passwords.new} onChange={e => setPasswords(p => ({ ...p, new: e.target.value }))} placeholder="Min. 6 caractères" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/50" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Confirmer</label>
                                        <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C4A052]/50" />
                                    </div>
                                </div>
                                <button onClick={handleChangePassword} disabled={saving || !passwords.current || !passwords.new || !passwords.confirm} className="flex items-center gap-2 px-6 py-3 bg-[#C4A052] hover:bg-[#B08A3E] text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                                    {saving ? 'Mise à jour...' : 'Mettre à jour'}
                                </button>
                            </div>
                        )}

                        {/* Appearance Tab */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Thème de l'Interface</h3>
                                    <p className="text-sm text-slate-400 mt-1">Choisissez l'apparence qui vous convient.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => handleThemeChange(true)} className={`p-6 rounded-xl border-2 transition-all ${darkMode ? 'border-[#C4A052] bg-gradient-to-br from-slate-800 to-slate-900' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                                        <Moon className={`w-8 h-8 mx-auto mb-3 ${darkMode ? 'text-[#C4A052]' : 'text-slate-400'}`} />
                                        <p className="text-sm font-medium text-white">Mode Sombre</p>
                                        <p className="text-xs text-slate-500 mt-1">Interface élégante et moderne</p>
                                        {darkMode && <div className="mt-3 flex items-center justify-center gap-1 text-[#C4A052]"><Check className="w-4 h-4" /><span className="text-xs font-medium">Actif</span></div>}
                                    </button>
                                    <button onClick={() => handleThemeChange(false)} className={`p-6 rounded-xl border-2 transition-all ${!darkMode ? 'border-[#C4A052] bg-gradient-to-br from-slate-100 to-slate-200' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                                        <Sun className={`w-8 h-8 mx-auto mb-3 ${!darkMode ? 'text-[#C4A052]' : 'text-slate-400'}`} />
                                        <p className={`text-sm font-medium ${!darkMode ? 'text-slate-900' : 'text-white'}`}>Mode Clair</p>
                                        <p className={`text-xs mt-1 ${!darkMode ? 'text-slate-600' : 'text-slate-500'}`}>Pour les environnements lumineux</p>
                                        {!darkMode && <div className="mt-3 flex items-center justify-center gap-1 text-[#C4A052]"><Check className="w-4 h-4" /><span className="text-xs font-medium">Actif</span></div>}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">💡 Le thème est sauvegardé automatiquement.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Logout */}
                <div className="lg:hidden mt-6">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-medium transition-colors">
                        <LogOut className="w-5 h-5" />
                        Déconnexion
                    </button>
                </div>
            </div>
        </div>
    )
}
