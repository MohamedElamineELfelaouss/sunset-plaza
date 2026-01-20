"use client"

import { useTranslations } from "@/lib/i18n"
import { motion } from "framer-motion"
import { ArrowRight, Building2, Users, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
    const t = useTranslations('hero')

    const stats = [
        { icon: Building2, value: "50+", label: t('stats.spaces') },
        { icon: Users, value: "200+", label: t('stats.clients') },
        { icon: Maximize, value: "15,000", label: t('stats.sqm') },
    ]

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A1628]">
            {/* Background Image - Static for performance */}
            <div className="absolute inset-0 will-change-transform">
                <Image
                    src="/images/hero-casablanca.png"
                    alt="Casablanca Skyline"
                    fill
                    sizes="100vw"
                    className="object-cover object-center"
                    priority
                    quality={85}
                />
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A1628]/80 via-[#0A1628]/70 to-[#0A1628]/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
                <div className="text-center">
                    {/* Badge - Simple fade */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 text-sm font-medium text-white/90 mb-8"
                    >
                        <span className="h-2 w-2 rounded-full bg-[#C4A052]" />
                        Casablanca, Maroc
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
                    >
                        {t('title')}
                        <br />
                        <span className="relative">
                            <span className="text-[#C4A052]">{t('brand')}</span>
                            <svg
                                className="absolute -bottom-2 left-0 w-full"
                                viewBox="0 0 200 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2 10C50 4 150 4 198 10"
                                    stroke="#C4A052"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-white/70 leading-relaxed"
                    >
                        {t('subtitle')}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Button
                            size="lg"
                            className="bg-[#C4A052] hover:bg-[#B08A3E] text-white rounded-full px-8 h-14 text-base font-medium"
                            asChild
                        >
                            <Link href="#spaces">
                                {t('cta')}
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white/30 text-white hover:bg-white/10 rounded-full px-8 h-14 text-base"
                            asChild
                        >
                            <Link href="#contact">
                                {t('secondaryCta')}
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <div className="flex flex-col items-center gap-2 text-white/50">
                    <span className="text-xs uppercase tracking-widest">Défiler</span>
                    <div className="h-8 w-5 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
                        <div className="h-2 w-1 rounded-full bg-white/50" />
                    </div>
                </div>
            </div>

            {/* Stats Bar - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/30 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-3 divide-x divide-white/10">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex items-center justify-center gap-2 sm:gap-4 py-4 sm:py-6"
                            >
                                <div className="hidden sm:flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-[#C4A052]/20 text-[#C4A052]">
                                    <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <span className="text-lg sm:text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                                    <p className="text-[10px] sm:text-xs md:text-sm text-white/60 leading-tight">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
