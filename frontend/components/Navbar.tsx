"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useTranslations } from "@/lib/i18n"
import { Menu, X, Building2, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const t = useTranslations('nav')

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll to section - works even if already on the same hash
  const scrollToSection = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Update URL without triggering navigation
      window.history.pushState(null, '', href)
    }
    setIsOpen(false)
  }, [])

  const navLinks = [
    { href: "#spaces", label: t('spaces') },
    { href: "#advantages", label: t('about') },
    { href: "#contact", label: t('contact') },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mt-4 flex h-16 items-center justify-between rounded-2xl px-6 transition-colors duration-300 ${scrolled
              ? "bg-white/95 border border-slate-200 shadow-lg"
              : "bg-black/20 border border-white/20"
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg transition-colors duration-300 ${scrolled
                ? "bg-[#C4A052]"
                : "bg-white/20 border border-white/30"
              }`}>
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className={`font-serif text-xl font-bold transition-colors duration-300 ${scrolled ? "text-[#0A1628]" : "text-white"}`}>Sunset</span>
              <span className="font-serif text-xl font-bold text-[#C4A052]"> Plaza</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${scrolled
                    ? "text-slate-600 hover:text-[#0A1628]"
                    : "text-white/80 hover:text-white"
                  }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <Button
              variant={scrolled ? "default" : "outline"}
              size="sm"
              className={`hidden sm:inline-flex rounded-full transition-colors duration-300 ${scrolled
                  ? "bg-[#C4A052] hover:bg-[#A08642] text-white"
                  : "border-white/30 text-white hover:bg-white/10"
                }`}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById('contact')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  window.history.pushState(null, '', '#contact')
                }
              }}
            >
              <Phone className="h-4 w-4" />
              {t('contact')}
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center rounded-lg p-2 transition-colors md:hidden ${scrolled
                  ? "text-slate-600 hover:bg-slate-100"
                  : "text-white hover:bg-white/10"
                }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute left-4 right-4 mt-2 rounded-2xl bg-white border border-slate-200 shadow-xl md:hidden">
            <div className="flex flex-col p-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-slate-100 mt-2">
                <Button
                  variant="default"
                  className="w-full bg-[#C4A052] hover:bg-[#A08642]"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById('contact')
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      window.history.pushState(null, '', '#contact')
                    }
                    setIsOpen(false)
                  }}
                >
                  <Phone className="h-4 w-4" />
                  {t('contact')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
