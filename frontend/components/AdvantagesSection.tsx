"use client"

import { useTranslations } from "@/lib/i18n"
import { motion } from "framer-motion"
import { MapPin, Palette, Shield, Sparkles } from "lucide-react"

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
}

export default function AdvantagesSection() {
    const t = useTranslations('advantages')

    const advantages = [
        {
            icon: MapPin,
            title: t('items.location.title'),
            description: t('items.location.description'),
            accent: "from-emerald-400 to-emerald-600",
        },
        {
            icon: Palette,
            title: t('items.design.title'),
            description: t('items.design.description'),
            accent: "from-blue-400 to-blue-600",
        },
        {
            icon: Shield,
            title: t('items.security.title'),
            description: t('items.security.description'),
            accent: "from-violet-400 to-violet-600",
        },
        {
            icon: Sparkles,
            title: t('items.services.title'),
            description: t('items.services.description'),
            accent: "from-amber-400 to-amber-600",
        },
    ]

    return (
        <section id="advantages" className="py-32 bg-[#0A1628] relative overflow-hidden">
            {/* Subtle Background Grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#C4A052]/5 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center mb-20"
                >
                    <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight">
                        {t('title')}
                    </h2>
                    {/* Decorative gold line */}
                    <div className="flex items-center justify-center gap-4 mt-6 mb-8">
                        <div className="h-px w-12 bg-[#C4A052]" />
                        <div className="h-1.5 w-1.5 rounded-full bg-[#C4A052]" />
                        <div className="h-px w-12 bg-[#C4A052]" />
                    </div>
                    <p className="text-lg text-white/60 max-w-xl mx-auto font-light leading-relaxed">
                        {t('subtitle')}
                    </p>
                </motion.div>

                {/* Advantages Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {advantages.map((advantage, index) => (
                        <motion.div
                            key={advantage.title}
                            variants={itemVariants}
                            className="group relative p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500"
                        >
                            {/* Number */}
                            <span className="absolute top-6 right-6 text-5xl font-serif font-bold text-white/[0.05]">
                                0{index + 1}
                            </span>

                            {/* Icon */}
                            <div className={`mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${advantage.accent} shadow-lg`}>
                                <advantage.icon className="h-6 w-6 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="font-serif text-xl font-medium text-white mb-4">
                                {advantage.title}
                            </h3>
                            <p className="text-white/50 leading-relaxed text-sm">
                                {advantage.description}
                            </p>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#C4A052]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
