"use client"

import Link from "next/link"
import { useTranslations } from "@/lib/i18n"
import { Building2, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
]

export default function Footer() {
    const t = useTranslations('footer')

    const footerLinks = {
        company: [
            { label: t('links.about'), href: "#" },
            { label: t('links.careers'), href: "#" },
            { label: t('links.contact'), href: "#contact" },
        ],
        resources: [
            { label: t('links.blog'), href: "#" },
            { label: t('links.faq'), href: "#" },
            { label: t('links.support'), href: "#" },
        ],
        legal: [
            { label: t('links.legal'), href: "#" },
            { label: t('links.privacy'), href: "#" },
            { label: t('links.terms'), href: "#" },
        ],
    }

    return (
        <footer className="bg-[#0f172a] text-slate-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f59e0b] to-[#d97706]">
                                <Building2 className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <span className="font-serif text-xl font-bold text-white">Sunset</span>
                                <span className="font-serif text-xl font-bold text-[#f59e0b]"> Plaza</span>
                            </div>
                        </Link>
                        <p className="text-slate-400 max-w-sm mb-6">
                            {t('description')}
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-[#f59e0b] hover:text-white transition-colors"
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">{t('links.company')}</h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-[#f59e0b] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">{t('links.resources')}</h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-[#f59e0b] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">{t('links.legal')}</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-slate-400 hover:text-[#f59e0b] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        {t('copyright')}
                    </p>
                    <p className="text-sm text-slate-500">
                        Casablanca, Maroc ❤️
                    </p>
                </div>
            </div>
        </footer>
    )
}
