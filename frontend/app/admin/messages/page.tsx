"use client"

import { useEffect, useState } from "react"
import { MessageSquare, Mail, Phone, Clock, User, Check, Trash2, Reply, X, AlertCircle } from "lucide-react"
import AdminHeader from "@/components/admin/Header"
import { formatDistanceToNow, format } from "date-fns"
import { fr } from "date-fns/locale"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Contact {
    id: number
    name: string
    email: string
    phone: string
    request_type: string
    message: string
    status: string
    created_at: string
}

export default function MessagesPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const [filter, setFilter] = useState<string>('all')
    const [updating, setUpdating] = useState<number | null>(null)

    const fetchContacts = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/contacts/admin/`)
            if (res.ok) {
                setContacts(await res.json())
            }
        } catch (error) {
            console.error('Failed to fetch contacts:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContacts()
    }, [])

    const updateStatus = async (id: number, newStatus: string) => {
        setUpdating(id)
        try {
            const res = await fetch(`${API_BASE}/api/contacts/admin/${id}/status/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            if (res.ok) {
                const updated = await res.json()
                setContacts(prev => prev.map(c => c.id === id ? updated : c))
                if (selectedContact?.id === id) {
                    setSelectedContact(updated)
                }
            }
        } catch (error) {
            console.error('Failed to update status:', error)
        } finally {
            setUpdating(null)
        }
    }

    const deleteContact = async (id: number) => {
        if (!confirm('Supprimer ce message ?')) return
        try {
            const res = await fetch(`${API_BASE}/api/contacts/admin/${id}/`, { method: 'DELETE' })
            if (res.ok) {
                setContacts(prev => prev.filter(c => c.id !== id))
                if (selectedContact?.id === id) {
                    setSelectedContact(null)
                }
            }
        } catch (error) {
            console.error('Failed to delete contact:', error)
        }
    }

    const filteredContacts = filter === 'all'
        ? contacts
        : contacts.filter(c => c.status === filter)

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string, text: string, label: string }> = {
            'PENDING': { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'En attente' },
            'CONTACTED': { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Contacté' },
            'CLOSED': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Clôturé' },
        }
        const style = styles[status] || styles['PENDING']
        return <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}>{style.label}</span>
    }

    const getTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'INVESTMENT': 'Investissement',
            'INFO': 'Information',
            'MEETING': 'Rendez-vous',
        }
        return labels[type] || type
    }

    return (
        <div className="min-h-screen">
            <AdminHeader
                title="Messages"
                subtitle={`${contacts.filter(c => c.status === 'PENDING').length} en attente`}
            />

            <div className="p-4 lg:p-6">
                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {['all', 'PENDING', 'CONTACTED', 'CLOSED'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f
                                ? 'bg-[#C4A052] text-white'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                                }`}
                        >
                            {f === 'all' ? 'Tous' : getStatusBadge(f).props.children}
                            {f !== 'all' && (
                                <span className="ml-2 px-1.5 py-0.5 bg-black/20 rounded text-xs">
                                    {contacts.filter(c => c.status === f).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Contact List */}
                    <div className="lg:col-span-1 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
                        <div className="p-4 border-b border-slate-800/50">
                            <h3 className="text-sm font-medium text-slate-400">
                                {filteredContacts.length} message{filteredContacts.length !== 1 ? 's' : ''}
                            </h3>
                        </div>
                        <div className="divide-y divide-slate-800/50 max-h-[calc(100vh-280px)] overflow-y-auto">
                            {loading ? (
                                <div className="p-8 text-center">
                                    <div className="w-6 h-6 border-2 border-[#C4A052] border-t-transparent rounded-full animate-spin mx-auto" />
                                </div>
                            ) : filteredContacts.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>Aucun message</p>
                                </div>
                            ) : (
                                filteredContacts.map((contact) => (
                                    <button
                                        key={contact.id}
                                        onClick={() => setSelectedContact(contact)}
                                        className={`w-full text-left p-4 hover:bg-slate-800/50 transition-colors ${selectedContact?.id === contact.id
                                            ? 'bg-slate-800/50 border-l-2 border-[#C4A052]'
                                            : contact.status === 'PENDING' ? 'bg-amber-500/5' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className="text-sm font-medium text-white truncate">{contact.name}</p>
                                            {getStatusBadge(contact.status)}
                                        </div>
                                        <p className="text-xs text-slate-500 mb-1">{getTypeLabel(contact.request_type)}</p>
                                        <p className="text-xs text-slate-400 truncate">{contact.message}</p>
                                        <p className="text-xs text-slate-600 mt-2">
                                            {formatDistanceToNow(new Date(contact.created_at), { addSuffix: true, locale: fr })}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Contact Detail */}
                    <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800/50 overflow-hidden">
                        {selectedContact ? (
                            <div className="h-full flex flex-col">
                                {/* Header */}
                                <div className="p-4 lg:p-6 border-b border-slate-800/50">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-lg font-semibold text-white">{selectedContact.name}</h2>
                                                {getStatusBadge(selectedContact.status)}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-4 h-4" />
                                                    <a href={`mailto:${selectedContact.email}`} className="hover:text-[#C4A052]">
                                                        {selectedContact.email}
                                                    </a>
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Phone className="w-4 h-4" />
                                                    <a href={`tel:${selectedContact.phone}`} className="hover:text-[#C4A052]">
                                                        {selectedContact.phone}
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedContact(null)}
                                            className="p-2 text-slate-400 hover:text-white lg:hidden"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                        <span className="px-2 py-1 bg-slate-800 rounded">{getTypeLabel(selectedContact.request_type)}</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {format(new Date(selectedContact.created_at), 'PPP à HH:mm', { locale: fr })}
                                        </span>
                                    </div>
                                </div>

                                {/* Message Body */}
                                <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
                                    <div className="bg-slate-800/30 rounded-xl p-4">
                                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-4 border-t border-slate-800/50">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <a
                                            href={`mailto:${selectedContact.email}?subject=Re: ${getTypeLabel(selectedContact.request_type)}`}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#C4A052] hover:bg-[#B08A3E] text-white rounded-xl font-medium transition-colors text-sm"
                                        >
                                            <Reply className="w-4 h-4" />
                                            Répondre
                                        </a>

                                        {selectedContact.status === 'PENDING' && (
                                            <button
                                                onClick={() => updateStatus(selectedContact.id, 'CONTACTED')}
                                                disabled={updating === selectedContact.id}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl font-medium transition-colors text-sm"
                                            >
                                                <Check className="w-4 h-4" />
                                                Marquer Contacté
                                            </button>
                                        )}

                                        {selectedContact.status === 'CONTACTED' && (
                                            <button
                                                onClick={() => updateStatus(selectedContact.id, 'CLOSED')}
                                                disabled={updating === selectedContact.id}
                                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-xl font-medium transition-colors text-sm"
                                            >
                                                <Check className="w-4 h-4" />
                                                Clôturer
                                            </button>
                                        )}

                                        <button
                                            onClick={() => deleteContact(selectedContact.id)}
                                            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl font-medium transition-colors text-sm ml-auto"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] flex items-center justify-center text-slate-500">
                                <div className="text-center">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Sélectionnez un message</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
