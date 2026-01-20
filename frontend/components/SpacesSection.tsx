"use client"

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "@/lib/i18n"
import { motion, AnimatePresence } from "framer-motion"
import { Maximize, MapPin, X, Phone, Calendar, Building2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import api, { ContentItem } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import { resolveImageSrc } from "@/lib/resolveImageSrc"
import Image from "next/image"
import Link from "next/link"
import ImageCarousel from "@/components/ImageCarousel"

type FilterType = "ALL" | "RENT" | "BUY" | "INVEST"

// Luxury color palette - inspired by Sotheby's & Christie's
const luxuryColors = {
    navy: "#0A1628",
    gold: "#C4A052",
    warmWhite: "#FAFAF8",
    slate: "#64748B",
    charcoal: "#1E293B",
}

// Elegant badge styles - no emojis, refined colors
const dealBadgeStyles = {
    RENT: "bg-emerald-900/90 text-emerald-50",
    BUY: "bg-amber-900/90 text-amber-50",
    INVEST: "bg-slate-800/90 text-slate-100",
}

export default function SpacesSection() {
    const t = useTranslations('spaces')
    const tNav = useTranslations('nav')
    const tContact = useTranslations('contact')
    const { locale } = useLocale()
    const [activeFilter, setActiveFilter] = useState<FilterType>("ALL")
    const [spaces, setSpaces] = useState<ContentItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSpace, setSelectedSpace] = useState<ContentItem | null>(null)

    const filters: { value: FilterType; label: string }[] = [
        { value: "ALL", label: t('filter.all') },
        { value: "RENT", label: t('filter.rent') },
        { value: "BUY", label: t('filter.buy') },
        { value: "INVEST", label: t('filter.invest') },
    ]

    useEffect(() => {
        const fetchSpaces = async () => {
            setLoading(true)
            try {
                const response = await api.get<ContentItem[]>("/api/content/")
                const offices = response.data.filter((item) => item.content_type === "OFFICE")
                setSpaces(offices)
            } catch (error) {
                console.error("Error fetching spaces:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSpaces()
    }, [locale])

    const filteredSpaces = activeFilter === "ALL"
        ? spaces
        : spaces.filter((space) => space.deal_type === activeFilter)

    return (
        <>
            <section id="spaces" className="py-32 bg-[#FAFAF8]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Elegant Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center mb-20"
                    >
                        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#0A1628] tracking-tight">
                            {t('title')}
                        </h2>
                        {/* Decorative gold line */}
                        <div className="flex items-center justify-center gap-4 mt-6 mb-8">
                            <div className="h-px w-12 bg-[#C4A052]" />
                            <div className="h-1.5 w-1.5 rounded-full bg-[#C4A052]" />
                            <div className="h-px w-12 bg-[#C4A052]" />
                        </div>
                        <p className="text-lg text-slate-500 max-w-xl mx-auto font-light leading-relaxed">
                            {t('subtitle')}
                        </p>
                    </motion.div>

                    {/* Refined Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-1 mb-16 p-1 bg-slate-100/50 rounded-full max-w-fit mx-auto">
                        {filters.map((filter) => (
                            <button
                                key={filter.value}
                                onClick={() => setActiveFilter(filter.value)}
                                className={`
                                    relative px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-colors duration-200
                                    ${activeFilter === filter.value
                                        ? "text-white bg-[#0A1628]"
                                        : "text-slate-600 hover:text-slate-900"
                                    }
                                `}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </div>

                    {/* Premium Cards Grid */}
                    {loading ? (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="aspect-[4/5] rounded-2xl bg-slate-100 animate-pulse" />
                            ))}
                        </div>
                    ) : filteredSpaces.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-24"
                        >
                            <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-lg text-slate-400 font-light">Aucun espace disponible</p>
                        </motion.div>
                    ) : (
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredSpaces.map((space) => (
                                <div
                                    key={space.id}
                                >
                                    <div
                                        onClick={() => setSelectedSpace(space)}
                                        className="group cursor-pointer"
                                    >
                                        {/* Image Container with Carousel */}
                                        <div className="relative rounded-2xl overflow-hidden mb-5">
                                            <ImageCarousel
                                                images={space.images || []}
                                                legacyImage={space.image}
                                                alt={space.title}
                                                aspectRatio="aspect-[4/3]"
                                                className="group-hover:scale-[1.02] transition-transform duration-500"
                                            />

                                            {/* Subtle vignette */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                                            {/* Elegant Badge - no emoji */}
                                            <div className={`absolute top-5 left-5 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase ${dealBadgeStyles[space.deal_type]} pointer-events-none`}>
                                                {filters.find(f => f.value === space.deal_type)?.label}
                                            </div>

                                            {/* Hover Reveal CTA */}
                                            <div className="absolute inset-x-5 bottom-5 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none">
                                                <div className="w-full py-3.5 rounded-xl bg-white/95 backdrop-blur-sm text-[#0A1628] text-sm font-medium flex items-center justify-center gap-2">
                                                    {t('card.viewDetails')}
                                                    <ArrowRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="px-1">
                                            <h3 className="font-serif text-xl text-[#0A1628] mb-2 group-hover:text-[#C4A052] transition-colors duration-300">
                                                {space.title}
                                            </h3>

                                            <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                                                {space.location && (
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        {space.location}
                                                    </span>
                                                )}
                                                {space.surface_area && (
                                                    <span className="flex items-center gap-1.5">
                                                        <Maximize className="h-3.5 w-3.5" />
                                                        {space.surface_area} m²
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-lg font-medium text-[#0A1628]">
                                                {space.price ? formatPrice(Number(space.price)) : "Prix sur demande"}
                                                {space.deal_type === "RENT" && <span className="text-sm text-slate-400 font-normal"> /mois</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Refined CTA */}
                    {filteredSpaces.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center mt-20"
                        >
                            <Button
                                variant="outline"
                                size="lg"
                                className="rounded-full px-12 h-14 text-sm font-medium tracking-wide border-[#0A1628] text-[#0A1628] hover:bg-[#0A1628] hover:text-white transition-all duration-300"
                                asChild
                            >
                                <Link href="#contact">
                                    {tNav('contact')}
                                </Link>
                            </Button>
                        </motion.div>
                    )}
                </div >
            </section >

            {/* ==================== LUXURY MODAL ==================== */}
            <AnimatePresence>
                {
                    selectedSpace && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                        >
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedSpace(null)}
                                className="absolute inset-0 bg-[#0A1628]/90 backdrop-blur-sm"
                            />

                            {/* Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                className="relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedSpace(null)}
                                    className="absolute top-3 right-3 sm:top-6 sm:right-6 z-50 p-2 sm:p-3 rounded-full bg-white/90 shadow-lg hover:shadow-xl transition-shadow duration-300"
                                >
                                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
                                </button>

                                <div className="flex flex-col lg:flex-row max-h-[95vh] sm:max-h-[90vh] overflow-y-auto lg:overflow-hidden">
                                    {/* Left: Image Carousel */}
                                    <div className="relative lg:w-1/2 h-56 sm:h-72 lg:h-auto lg:min-h-[600px] flex-shrink-0">
                                        <ImageCarousel
                                            images={selectedSpace.images || []}
                                            legacyImage={selectedSpace.image}
                                            alt={selectedSpace.title}
                                            aspectRatio="h-full"
                                            showArrowsAlways={true}
                                        />

                                        {/* Badge */}
                                        <div className={`absolute top-6 left-6 z-10 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase ${dealBadgeStyles[selectedSpace.deal_type]}`}>
                                            {filters.find(f => f.value === selectedSpace.deal_type)?.label}
                                        </div>
                                    </div>

                                    {/* Right: Content */}
                                    <div className="lg:w-1/2 p-5 sm:p-8 lg:p-12 lg:overflow-y-auto">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            {/* Title */}
                                            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#0A1628] leading-tight mb-2 sm:mb-3">
                                                {selectedSpace.title}
                                            </h2>

                                            {/* Location */}
                                            {selectedSpace.location && (
                                                <p className="text-slate-500 mb-8 flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-[#C4A052]" />
                                                    {selectedSpace.location}
                                                </p>
                                            )}

                                            {/* Price & Surface */}
                                            <div className="flex gap-6 mb-10 pb-10 border-b border-slate-100">
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Prix</p>
                                                    <p className="text-3xl font-light text-[#0A1628]">
                                                        {selectedSpace.price ? formatPrice(Number(selectedSpace.price)) : "—"}
                                                    </p>
                                                    {selectedSpace.deal_type === "RENT" && (
                                                        <p className="text-sm text-slate-400">par mois</p>
                                                    )}
                                                </div>
                                                {selectedSpace.surface_area && (
                                                    <div className="pl-6 border-l border-slate-100">
                                                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Surface</p>
                                                        <p className="text-3xl font-light text-[#0A1628]">
                                                            {selectedSpace.surface_area}
                                                            <span className="text-lg text-slate-400 ml-1">m²</span>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Description */}
                                            <div className="mb-10">
                                                <p className="text-slate-600 leading-relaxed">
                                                    {selectedSpace.description}
                                                </p>
                                            </div>

                                            {/* Features - elegant list */}
                                            <div className="mb-12">
                                                <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">Prestations</p>
                                                <ul className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-[#C4A052]" />
                                                        Climatisation
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-[#C4A052]" />
                                                        Parking privé
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-[#C4A052]" />
                                                        Sécurité 24/7
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-[#C4A052]" />
                                                        Fibre optique
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-[#C4A052]" />
                                                        Accès handicapé
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <div className="w-1 h-1 rounded-full bg-[#C4A052]" />
                                                        Réception
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* CTA Buttons - refined, no gradients */}
                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <Button
                                                    size="lg"
                                                    className="flex-1 h-14 text-sm font-medium tracking-wide rounded-full bg-[#0A1628] hover:bg-[#1E293B] transition-colors duration-300"
                                                    asChild
                                                >
                                                    <Link href="#contact" onClick={() => setSelectedSpace(null)}>
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        {tContact('form.requestTypes.meeting')}
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    className="flex-1 h-14 text-sm font-medium tracking-wide rounded-full border-slate-200 hover:bg-slate-50 transition-colors duration-300"
                                                    asChild
                                                >
                                                    <a href="tel:+212522000000">
                                                        <Phone className="h-4 w-4 mr-2" />
                                                        +212 522 000 000
                                                    </a>
                                                </Button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </>
    )
}
