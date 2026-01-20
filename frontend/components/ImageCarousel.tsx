"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { resolveImageSrc } from "@/lib/resolveImageSrc"
import { ContentImage } from "@/lib/api"

interface ImageCarouselProps {
    images: ContentImage[]
    legacyImage?: string
    alt: string
    aspectRatio?: string
    className?: string
    showArrowsAlways?: boolean  // For mobile - always show arrows
}

export default function ImageCarousel({
    images,
    legacyImage,
    alt,
    aspectRatio = "aspect-[4/5]",
    className = "",
    showArrowsAlways = false
}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Combine legacy image with new images array
    const allImages: string[] = []

    // Add images from array
    if (images && images.length > 0) {
        images.forEach(img => allImages.push(img.image))
    }

    // Add legacy image if no other images
    if (allImages.length === 0 && legacyImage) {
        allImages.push(legacyImage)
    }

    // No images at all - show premium placeholder
    if (allImages.length === 0) {
        return (
            <div className={`${aspectRatio} bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden ${className}`}>
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 stroke=%22%23000%22 stroke-width=%221%22%3E%3Cpath d=%22M30 0v60M0 30h60%22/%3E%3C/g%3E%3C/svg%3E')]"></div>
                </div>
                <div className="text-center z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#C4A052]/20 to-[#C4A052]/5 flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#C4A052]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-slate-400">Sunset Plaza</p>
                    <p className="text-xs text-slate-300 mt-1">Photo à venir</p>
                </div>
            </div>
        )
    }

    const goToPrevious = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1))
    }

    const goToNext = (e: React.MouseEvent) => {
        e.stopPropagation()
        setCurrentIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1))
    }

    // Arrow visibility classes - always visible on mobile or when showArrowsAlways is true
    const arrowClasses = showArrowsAlways
        ? "opacity-100"
        : "opacity-100 md:opacity-0 md:group-hover:opacity-100"

    const [isLoading, setIsLoading] = useState(true)

    return (
        <div className={`relative ${aspectRatio} overflow-hidden group ${className}`}>
            {/* Current Image with fade transition */}
            <Image
                src={resolveImageSrc(allImages[currentIndex])}
                alt={`${alt} - Image ${currentIndex + 1}`}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
                className={`object-cover transition-all duration-500 ease-out ${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
                onLoad={() => setIsLoading(false)}
            />

            {/* Navigation Arrows - Always visible on mobile, hover on desktop */}
            {allImages.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-8 md:h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-opacity duration-200 hover:bg-white active:scale-95 ${arrowClasses}`}
                        aria-label="Previous image"
                    >
                        <ChevronLeft className="w-6 h-6 md:w-5 md:h-5 text-slate-700" />
                    </button>
                    <button
                        onClick={goToNext}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 md:w-8 md:h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-opacity duration-200 hover:bg-white active:scale-95 ${arrowClasses}`}
                        aria-label="Next image"
                    >
                        <ChevronRight className="w-6 h-6 md:w-5 md:h-5 text-slate-700" />
                    </button>
                </>
            )}

            {/* Dots Indicator - Always visible, larger on mobile */}
            {allImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 md:gap-1.5">
                    {allImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.stopPropagation()
                                setCurrentIndex(idx)
                            }}
                            className={`w-3 h-3 md:w-2 md:h-2 rounded-full transition-all duration-200 ${idx === currentIndex
                                ? "bg-white w-5 md:w-4"
                                : "bg-white/60 hover:bg-white/80"
                                }`}
                            aria-label={`Go to image ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
                <div className="absolute top-3 right-3 px-2.5 py-1 md:px-2 rounded-full bg-black/50 text-white text-sm md:text-xs font-medium">
                    {currentIndex + 1} / {allImages.length}
                </div>
            )}
        </div>
    )
}
