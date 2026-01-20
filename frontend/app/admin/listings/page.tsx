"use client"

import { useEffect, useState, useRef } from "react"
import { Building2, Edit, Trash2, Plus, Check, X, ImagePlus, MapPin, Tag, Loader2, Star, Upload, ChevronLeft, ChevronRight } from "lucide-react"
import AdminHeader from "@/components/admin/Header"
import NextImage from "next/image"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

interface ContentImage {
    id: number
    image: string
    caption: string
    order: number
}

interface Listing {
    id: number
    title: string
    description: string
    image: string
    images: ContentImage[]
    status: string
    content_type: string
    deal_type: string
    price: string | null
    surface_area: number | null
    location: string | null
    created_at: string
    is_translated?: boolean
    // Translation fields
    title_fr?: string
    title_en?: string
    title_ar?: string
    description_fr?: string
    description_en?: string
    description_ar?: string
    location_fr?: string
    location_en?: string
    location_ar?: string
}

export default function ListingsPage() {
    const [listings, setListings] = useState<Listing[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [filter, setFilter] = useState<string>('all')
    const [showModal, setShowModal] = useState(false)
    const [editingListing, setEditingListing] = useState<Listing | null>(null)
    const [formData, setFormData] = useState({
        title: '', description: '', deal_type: 'RENT',
        price: '', surface_area: '', location: '', status: 'DRAFT',
        // Translation fields
        title_fr: '', title_en: '', title_ar: '',
        description_fr: '', description_en: '', description_ar: '',
        location_fr: '', location_en: '', location_ar: ''
    })
    const [activeLang, setActiveLang] = useState<'fr' | 'en' | 'ar'>('fr')

    const [listingImages, setListingImages] = useState<ContentImage[]>([])
    const [uploadingImages, setUploadingImages] = useState(false)
    const [translating, setTranslating] = useState(false)
    const [translateSuccess, setTranslateSuccess] = useState(false)
    const [translateProgress, setTranslateProgress] = useState({ current: 0, total: 0 })
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [pendingFiles, setPendingFiles] = useState<File[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const fetchListings = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/content/admin/`)
            if (res.ok) {
                const data = await res.json()
                setListings(data)
            }
        } catch (error) {
            console.error('Failed to fetch listings:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchListings()
    }, [])

    const togglePublish = async (id: number) => {
        // Optimistic update
        const listing = listings.find(l => l.id === id)
        if (!listing) return

        const newStatus = listing.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
        setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l))

        try {
            const res = await fetch(`${API_BASE}/api/content/admin/${id}/publish/`, { method: 'PATCH' })
            if (res.ok) {
                const result = await res.json()
                // Update with actual server response
                setListings(prev => prev.map(l => l.id === id ? { ...l, status: result.status } : l))
            } else {
                // Revert on error
                setListings(prev => prev.map(l => l.id === id ? { ...l, status: listing.status } : l))
            }
        } catch (error) {
            console.error('Failed to toggle publish:', error)
            // Revert on error
            setListings(prev => prev.map(l => l.id === id ? { ...l, status: listing.status } : l))
        }
    }

    const deleteListing = async (id: number) => {
        if (!confirm('Supprimer cet espace ?')) return
        try {
            const res = await fetch(`${API_BASE}/api/content/admin/${id}/`, { method: 'DELETE' })
            if (res.ok) {
                setListings(prev => prev.filter(l => l.id !== id))
            }
        } catch (error) {
            console.error('Failed to delete listing:', error)
        }
    }

    const saveListing = async () => {
        if (!formData.title || !formData.description) {
            alert('Veuillez remplir le titre et la description')
            return
        }

        setSaving(true)
        try {
            const url = editingListing
                ? `${API_BASE}/api/content/admin/${editingListing.id}/`
                : `${API_BASE}/api/content/admin/`

            const res = await fetch(url, {
                method: editingListing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    deal_type: formData.deal_type,
                    status: formData.status,
                    price: formData.price ? parseFloat(formData.price) : null,
                    surface_area: formData.surface_area ? parseFloat(formData.surface_area) : null,
                    location: formData.location || null,
                    content_type: 'OFFICE',
                })
            })

            if (res.ok) {
                const savedListing = await res.json()

                // Upload pending images if any
                if (pendingFiles.length > 0) {
                    await uploadImages(savedListing.id, pendingFiles)
                }

                await fetchListings()
                closeModal()
            } else {
                const error = await res.json()
                console.error('Save error:', error)
                alert('Erreur lors de la sauvegarde')
            }
        } catch (error) {
            console.error('Failed to save listing:', error)
            alert('Erreur de connexion au serveur')
        } finally {
            setSaving(false)
        }
    }

    const uploadImages = async (contentId: number, files: File[]) => {
        setUploadingImages(true)
        try {
            const formDataObj = new FormData()
            files.forEach(file => {
                formDataObj.append('images', file)
            })

            const res = await fetch(`${API_BASE}/api/content/admin/${contentId}/images/`, {
                method: 'POST',
                body: formDataObj
            })

            if (res.ok) {
                const newImages = await res.json()
                // The API returns an array directly, not {images: [...]}
                if (Array.isArray(newImages) && newImages.length > 0) {
                    // Immediately add new images to the list
                    setListingImages(prev => [...prev, ...newImages])
                }
                // Also refresh the listing data for consistency
                await fetchListings()
                return newImages
            }
        } catch (error) {
            console.error('Failed to upload images:', error)
        } finally {
            setUploadingImages(false)
        }
        return []
    }

    const deleteImage = async (imageId: number) => {
        if (!editingListing) return
        try {
            const res = await fetch(`${API_BASE}/api/content/admin/${editingListing.id}/images/${imageId}/`, {
                method: 'DELETE'
            })
            if (res.ok) {
                setListingImages(prev => prev.filter(img => img.id !== imageId))
            }
        } catch (error) {
            console.error('Failed to delete image:', error)
        }
    }

    const setMainImage = async (imageId: number) => {
        if (!editingListing) return
        try {
            const res = await fetch(`${API_BASE}/api/content/admin/${editingListing.id}/images/${imageId}/main/`, {
                method: 'PATCH'
            })
            if (res.ok) {
                // Reorder so the selected image is first (index 0 = main)
                setListingImages(prev => {
                    const sorted = [...prev].sort((a, b) => a.order - b.order)
                    const selectedIdx = sorted.findIndex(img => img.id === imageId)
                    if (selectedIdx > 0) {
                        const [selected] = sorted.splice(selectedIdx, 1)
                        sorted.unshift(selected)
                        return sorted.map((img, idx) => ({ ...img, order: idx }))
                    }
                    return prev
                })
                await fetchListings()
            }
        } catch (error) {
            console.error('Failed to set main image:', error)
        }
    }

    const moveImage = async (imageId: number, direction: 'up' | 'down') => {
        if (!editingListing) return

        const sortedImages = [...listingImages].sort((a, b) => a.order - b.order)
        const currentIndex = sortedImages.findIndex(img => img.id === imageId)

        if (direction === 'up' && currentIndex > 0) {
            // Swap with previous
            const temp = sortedImages[currentIndex]
            sortedImages[currentIndex] = sortedImages[currentIndex - 1]
            sortedImages[currentIndex - 1] = temp
        } else if (direction === 'down' && currentIndex < sortedImages.length - 1) {
            // Swap with next
            const temp = sortedImages[currentIndex]
            sortedImages[currentIndex] = sortedImages[currentIndex + 1]
            sortedImages[currentIndex + 1] = temp
        } else {
            return // Can't move
        }

        // Update local state immediately
        const newOrder = sortedImages.map((img, idx) => ({ ...img, order: idx }))
        setListingImages(newOrder)

        // Sync to backend
        try {
            await fetch(`${API_BASE}/api/content/admin/${editingListing.id}/images/reorder/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newOrder.map(img => img.id) })
            })
        } catch (error) {
            console.error('Failed to reorder images:', error)
        }
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        if (editingListing) {
            // Upload immediately - uploadImages already updates listingImages state
            await uploadImages(editingListing.id, files)
            // Clear pending files
            setPendingFiles([])
        } else {
            // Store for later upload
            setPendingFiles(prev => [...prev, ...files])
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const removePendingFile = (index: number) => {
        setPendingFiles(prev => prev.filter((_, i) => i !== index))
    }

    const openEditModal = (listing: Listing) => {
        setEditingListing(listing)
        setFormData({
            title: listing.title,
            description: listing.description,
            deal_type: listing.deal_type,
            price: listing.price?.toString() || '',
            surface_area: listing.surface_area?.toString() || '',
            location: listing.location || '',
            status: listing.status,
            // Translation fields
            title_fr: listing.title_fr || listing.title || '',
            title_en: listing.title_en || '',
            title_ar: listing.title_ar || '',
            description_fr: listing.description_fr || listing.description || '',
            description_en: listing.description_en || '',
            description_ar: listing.description_ar || '',
            location_fr: listing.location_fr || listing.location || '',
            location_en: listing.location_en || '',
            location_ar: listing.location_ar || '',
        })
        setListingImages(listing.images || [])
        setPendingFiles([])
        setShowModal(true)
    }

    const openCreateModal = () => {
        setEditingListing(null)
        setFormData({
            title: '', description: '', deal_type: 'RENT', price: '', surface_area: '', location: '', status: 'DRAFT',
            title_fr: '', title_en: '', title_ar: '',
            description_fr: '', description_en: '', description_ar: '',
            location_fr: '', location_en: '', location_ar: ''
        })
        setListingImages([])
        setPendingFiles([])
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEditingListing(null)
        setListingImages([])
        setPendingFiles([])
        setFormData({
            title: '', description: '', deal_type: 'RENT', price: '', surface_area: '', location: '', status: 'DRAFT',
            title_fr: '', title_en: '', title_ar: '',
            description_fr: '', description_en: '', description_ar: '',
            location_fr: '', location_en: '', location_ar: ''
        })
    }

    // Selection helpers
    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        )
    }

    const selectAll = () => {
        setSelectedIds(filteredListings.map(l => l.id))
    }

    const clearSelection = () => {
        setSelectedIds([])
    }

    // Batch translate selected listings
    const translateSelected = async () => {
        if (selectedIds.length === 0) return

        setTranslating(true)
        setTranslateProgress({ current: 0, total: selectedIds.length })

        let successCount = 0
        let errorCount = 0

        for (let i = 0; i < selectedIds.length; i++) {
            const id = selectedIds[i]

            try {
                const res = await fetch(`${API_BASE}/api/content/admin/${id}/translate/`, {
                    method: 'POST'
                })
                if (res.ok) {
                    successCount++
                } else {
                    errorCount++
                }
            } catch {
                errorCount++
            }

            // Update progress AFTER each translation completes
            setTranslateProgress({ current: i + 1, total: selectedIds.length })
        }

        setTranslating(false)
        setSelectedIds([])

        if (successCount > 0) {
            alert(`✅ ${successCount} listing(s) traduit(s) avec succès vers 7 langues!${errorCount > 0 ? `\n⚠️ ${errorCount} erreur(s)` : ''}`)
        } else {
            alert('❌ Erreur lors de la traduction')
        }
    }

    const filteredListings = filter === 'all' ? listings : listings.filter(l => l.status === filter)

    const getStatusBadge = (status: string) => {
        return status === 'PUBLISHED'
            ? <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 font-medium">Publié</span>
            : <span className="px-2 py-0.5 rounded text-xs bg-slate-500/20 text-slate-400 font-medium">Brouillon</span>
    }

    const getDealBadge = (deal: string) => {
        const styles: Record<string, string> = {
            'RENT': 'bg-blue-500/20 text-blue-400',
            'BUY': 'bg-purple-500/20 text-purple-400',
            'INVEST': 'bg-amber-500/20 text-amber-400',
        }
        const labels: Record<string, string> = { 'RENT': 'Location', 'BUY': 'Vente', 'INVEST': 'Investissement' }
        return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[deal]}`}>{labels[deal]}</span>
    }

    const getDisplayImage = (listing: Listing) => {
        if (listing.image) return listing.image
        if (listing.images && listing.images.length > 0) {
            const sorted = [...listing.images].sort((a, b) => a.order - b.order)
            return sorted[0].image
        }
        return null
    }

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return ''
        if (imagePath.startsWith('http')) return imagePath
        return `${API_BASE}${imagePath}`
    }

    return (
        <div className="min-h-screen">
            <AdminHeader title="Espaces" subtitle={`${listings.filter(l => l.status === 'PUBLISHED').length} publiés`} />

            <div className="p-4 lg:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {['all', 'PUBLISHED', 'DRAFT'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === f ? 'bg-[#C4A052] text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}>
                                {f === 'all' ? 'Tous' : f === 'PUBLISHED' ? 'Publiés' : 'Brouillons'}
                            </button>
                        ))}
                    </div>
                    <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2 bg-[#C4A052] hover:bg-[#B08A3E] text-white rounded-xl font-medium transition-colors">
                        <Plus className="w-4 h-4" />
                        Ajouter
                    </button>
                </div>

                {/* Selection Bar */}
                {(selectedIds.length > 0 || translating) && (
                    <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700/50 rounded-xl flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <span className="text-blue-300 text-sm font-medium">
                                {translating
                                    ? `🌐 Traduction en cours... ${translateProgress.current}/${translateProgress.total}`
                                    : `${selectedIds.length} élément(s) sélectionné(s)`
                                }
                            </span>
                            {translating && (
                                <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all duration-300"
                                        style={{ width: `${(translateProgress.current / translateProgress.total) * 100}%` }}
                                    />
                                </div>
                            )}
                        </div>
                        {!translating && (
                            <div className="flex gap-2">
                                <button
                                    onClick={clearSelection}
                                    className="px-3 py-1.5 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                                >
                                    Désélectionner
                                </button>
                                <button
                                    onClick={translateSelected}
                                    className="flex items-center gap-2 px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium"
                                >
                                    🌐 Auto-traduire ({selectedIds.length})
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Select All Button */}
                {!translating && filteredListings.length > 0 && (
                    <div className="mb-4 flex gap-2">
                        <button
                            onClick={selectedIds.length === filteredListings.length ? clearSelection : selectAll}
                            className="text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            {selectedIds.length === filteredListings.length ? '☑️ Tout désélectionner' : '☐ Tout sélectionner'}
                        </button>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-[#C4A052] animate-spin" />
                    </div>
                ) : filteredListings.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Aucun espace</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredListings.map((listing) => {
                            const displayImage = getDisplayImage(listing)
                            const imageCount = (listing.images?.length || 0) + (listing.image ? 1 : 0)

                            return (
                                <div key={listing.id} className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl border overflow-hidden group ${selectedIds.includes(listing.id) ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-800/50'}`}>
                                    <div className="relative h-40 bg-slate-800">
                                        {displayImage ? (
                                            <NextImage src={getImageUrl(displayImage)} alt={listing.title} fill className="object-cover" unoptimized />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Building2 className="w-12 h-12 text-slate-700" />
                                            </div>
                                        )}
                                        {/* Selection Checkbox */}
                                        <div className="absolute top-2 right-2 z-10">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleSelect(listing.id) }}
                                                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedIds.includes(listing.id)
                                                    ? 'bg-blue-500 border-blue-500 text-white'
                                                    : 'bg-black/50 border-white/50 hover:border-white'
                                                    }`}
                                            >
                                                {selectedIds.includes(listing.id) && <Check className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {imageCount > 0 && (
                                            <div className="absolute top-2 left-2">
                                                <span className="px-2 py-0.5 rounded text-xs bg-black/50 text-white flex items-center gap-1">
                                                    <ImagePlus className="w-3 h-3" />
                                                    {imageCount}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-2 right-2 flex items-center gap-1">
                                            {listing.is_translated && (
                                                <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/30 text-emerald-300 font-medium" title="Traduit">
                                                    🌐
                                                </span>
                                            )}
                                            {getStatusBadge(listing.status)}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-white truncate flex-1">{listing.title}</h3>
                                            <div className="ml-2">{getDealBadge(listing.deal_type)}</div>
                                        </div>
                                        <p className="text-sm text-slate-400 line-clamp-2 mb-3">{listing.description}</p>

                                        <div className="flex flex-wrap gap-2 text-xs text-slate-500 mb-4">
                                            {listing.surface_area && (
                                                <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{listing.surface_area} m²</span>
                                            )}
                                            {listing.location && (
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.location}</span>
                                            )}
                                        </div>

                                        {listing.price && (
                                            <p className="text-lg font-bold text-[#C4A052] mb-4">
                                                {parseFloat(listing.price).toLocaleString()} MAD
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                                            <button
                                                onClick={() => togglePublish(listing.id)}
                                                className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs font-medium transition-colors ${listing.status === 'PUBLISHED' ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400'}`}
                                            >
                                                {listing.status === 'PUBLISHED' ? <><X className="w-3 h-3" />Dépublier</> : <><Check className="w-3 h-3" />Publier</>}
                                            </button>
                                            <button onClick={() => openEditModal(listing)} className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deleteListing(listing.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && closeModal()}>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
                            <h2 className="text-lg font-semibold text-white">
                                {editingListing ? "Modifier l'Espace" : 'Nouvel Espace'}
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-slate-800 rounded-lg">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4 overflow-y-auto flex-1">
                            {/* Title */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Titre (Français) *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value, title_fr: e.target.value }))}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C4A052]/50"
                                    placeholder="Nom de l'espace"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Description (Français) *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value, description_fr: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#C4A052]/50"
                                    placeholder="Description détaillée"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Emplacement (Français)</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value, location_fr: e.target.value }))}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#C4A052]/50"
                                    placeholder="Ex: 3ème étage, Bâtiment A"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Type</label>
                                    <select value={formData.deal_type} onChange={e => setFormData(prev => ({ ...prev, deal_type: e.target.value }))} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                                        <option value="RENT">Location</option>
                                        <option value="BUY">Vente</option>
                                        <option value="INVEST">Investissement</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Statut</label>
                                    <select value={formData.status} onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white">
                                        <option value="DRAFT">Brouillon</option>
                                        <option value="PUBLISHED">Publié</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Prix (MAD)</label>
                                    <input type="number" value={formData.price} onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" placeholder="0" />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Surface (m²)</label>
                                    <input type="number" value={formData.surface_area} onChange={e => setFormData(prev => ({ ...prev, surface_area: e.target.value }))} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white" placeholder="0" />
                                </div>
                            </div>

                            {/* Images Section */}
                            <div className="pt-4 border-t border-slate-800">
                                <div className="flex items-center justify-between mb-3">
                                    <label className="block text-sm font-medium text-white">Photos</label>
                                    <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileSelect} className="hidden" />
                                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImages} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50">
                                        {uploadingImages ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                        Ajouter
                                    </button>
                                </div>

                                {/* Existing Images */}
                                {listingImages.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        {listingImages.sort((a, b) => a.order - b.order).map((img, index) => (
                                            <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-800">
                                                <NextImage src={getImageUrl(img.image)} alt={img.caption || `Image ${index + 1}`} fill className="object-cover" unoptimized />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                    {/* Top row: move buttons */}
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => moveImage(img.id, 'up')}
                                                            disabled={index === 0}
                                                            className="p-1.5 bg-slate-600/80 hover:bg-slate-500 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                                            title="Déplacer à gauche"
                                                        >
                                                            <ChevronLeft className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => moveImage(img.id, 'down')}
                                                            disabled={index === listingImages.length - 1}
                                                            className="p-1.5 bg-slate-600/80 hover:bg-slate-500 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                                            title="Déplacer à droite"
                                                        >
                                                            <ChevronRight className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    {/* Bottom row: main + delete */}
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => setMainImage(img.id)} className="p-1.5 bg-amber-500/80 hover:bg-amber-500 text-white rounded-lg" title="Image principale">
                                                            <Star className="w-3 h-3" />
                                                        </button>
                                                        <button onClick={() => deleteImage(img.id)} className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg" title="Supprimer">
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                                {index === 0 && <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#C4A052] text-white text-[10px] rounded font-medium">Principal</div>}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Pending Files */}
                                {pendingFiles.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mb-3">
                                        {pendingFiles.map((file, index) => (
                                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-800">
                                                <NextImage src={URL.createObjectURL(file)} alt={file.name} fill className="object-cover" unoptimized />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button onClick={() => removePendingFile(index)} className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-blue-500/80 text-white text-[10px] rounded font-medium">En attente</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Empty State */}
                                {listingImages.length === 0 && pendingFiles.length === 0 && (
                                    <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-slate-600 transition-colors">
                                        <ImagePlus className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                                        <p className="text-sm text-slate-500">Cliquez pour ajouter des photos</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-800 flex gap-2 flex-shrink-0">
                            <button onClick={closeModal} className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium">
                                Annuler
                            </button>
                            {editingListing && (
                                <button
                                    onClick={async () => {
                                        if (!editingListing) return
                                        setTranslating(true)
                                        setTranslateSuccess(false)
                                        try {
                                            const res = await fetch(`${API_BASE}/api/content/admin/${editingListing.id}/translate/`, {
                                                method: 'POST'
                                            })
                                            const data = await res.json()
                                            if (res.ok) {
                                                setTranslateSuccess(true)
                                                // Update the listing in state to show is_translated
                                                setListings(prev => prev.map(l =>
                                                    l.id === editingListing.id ? { ...l, is_translated: true } : l
                                                ))
                                                // Also update editingListing
                                                setEditingListing({ ...editingListing, is_translated: true })
                                                // Keep success visible for 3 seconds
                                                setTimeout(() => setTranslateSuccess(false), 3000)
                                            } else {
                                                alert(data.error || 'Erreur de traduction')
                                            }
                                        } catch (error) {
                                            alert('Erreur de connexion')
                                        } finally {
                                            setTranslating(false)
                                        }
                                    }}
                                    disabled={translating || translateSuccess}
                                    className={`py-2.5 px-4 rounded-xl font-medium flex items-center gap-2 transition-all ${translateSuccess
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50'
                                        }`}
                                >
                                    {translating ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Traduction...</>
                                    ) : translateSuccess ? (
                                        <><Check className="w-4 h-4" /> Traduit </>
                                    ) : editingListing.is_translated ? (
                                        <>🌐 Re-traduire</>
                                    ) : (
                                        <>🌐 Auto-traduire</>
                                    )}
                                </button>
                            )}
                            <button onClick={saveListing} disabled={saving || !formData.title || !formData.description} className="flex-1 py-2.5 bg-[#C4A052] hover:bg-[#B08A3E] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {editingListing ? 'Sauvegarder' : 'Créer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
