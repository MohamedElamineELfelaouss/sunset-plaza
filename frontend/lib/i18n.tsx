"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"

// Import translation files
import frMessages from "@/messages/fr.json"
import enMessages from "@/messages/en.json"
import arMessages from "@/messages/ar.json"
import esMessages from "@/messages/es.json"
import nlMessages from "@/messages/nl.json"
import deMessages from "@/messages/de.json"
import itMessages from "@/messages/it.json"
import ptMessages from "@/messages/pt.json"

export const locales = ['fr', 'en', 'ar', 'es', 'nl', 'de', 'it', 'pt'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'fr'

type Messages = typeof frMessages

const messagesMap: Record<Locale, Messages> = {
    fr: frMessages,
    en: enMessages,
    ar: arMessages,
    es: esMessages,
    nl: nlMessages,
    de: deMessages,
    it: itMessages,
    pt: ptMessages,
}

// Language display info
export const languageInfo: Record<Locale, { label: string; flag: string }> = {
    fr: { label: 'Français', flag: '🇫🇷' },
    en: { label: 'English', flag: '🇬🇧' },
    ar: { label: 'العربية', flag: '🇸🇦' },
    es: { label: 'Español', flag: '🇪🇸' },
    nl: { label: 'Nederlands', flag: '🇳🇱' },
    de: { label: 'Deutsch', flag: '🇩🇪' },
    it: { label: 'Italiano', flag: '🇮🇹' },
    pt: { label: 'Português', flag: '🇵🇹' },
}

// Map browser language to our locales for auto-detection
const browserLangMap: Record<string, Locale> = {
    fr: 'fr', 'fr-FR': 'fr', 'fr-CA': 'fr', 'fr-MA': 'fr',
    en: 'en', 'en-US': 'en', 'en-GB': 'en', 'en-AU': 'en',
    ar: 'ar', 'ar-SA': 'ar', 'ar-AE': 'ar', 'ar-MA': 'ar',
    es: 'es', 'es-ES': 'es', 'es-MX': 'es',
    nl: 'nl', 'nl-NL': 'nl', 'nl-BE': 'nl',
    de: 'de', 'de-DE': 'de', 'de-AT': 'de',
    it: 'it', 'it-IT': 'it',
    pt: 'pt', 'pt-PT': 'pt', 'pt-BR': 'pt',
}

function detectBrowserLocale(): Locale {
    if (typeof navigator === 'undefined') return defaultLocale

    const browserLangs = navigator.languages || [navigator.language]
    for (const lang of browserLangs) {
        if (browserLangMap[lang]) return browserLangMap[lang]
        const primary = lang.split('-')[0]
        if (browserLangMap[primary]) return browserLangMap[primary]
    }
    return defaultLocale
}

interface I18nContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: (key: string) => string
    dir: "ltr" | "rtl"
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

// Helper function to get nested value from object
function getNestedValue(obj: Record<string, unknown>, path: string): string {
    const keys = path.split(".")
    let value: unknown = obj

    for (const key of keys) {
        if (value && typeof value === "object" && key in value) {
            value = (value as Record<string, unknown>)[key]
        } else {
            return path // Return key if not found
        }
    }

    return typeof value === "string" ? value : path
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(defaultLocale)
    const [mounted, setMounted] = useState(false)

    // Initialize locale on mount
    useEffect(() => {
        // Check saved preference first
        const saved = localStorage.getItem("NEXT_LOCALE") as Locale | null
        if (saved && locales.includes(saved)) {
            setLocaleState(saved)
        } else {
            // Auto-detect from browser
            const detected = detectBrowserLocale()
            setLocaleState(detected)
            localStorage.setItem("NEXT_LOCALE", detected)
        }
        setMounted(true)
    }, [])

    // Update document attributes when locale changes
    useEffect(() => {
        if (mounted) {
            document.documentElement.lang = locale
            document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
        }
    }, [locale, mounted])

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem("NEXT_LOCALE", newLocale)
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    }, [])

    const t = useCallback((key: string): string => {
        return getNestedValue(messagesMap[locale] as unknown as Record<string, unknown>, key)
    }, [locale])

    const value: I18nContextType = {
        locale,
        setLocale,
        t,
        dir: locale === 'ar' ? 'rtl' : 'ltr',
    }

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(I18nContext)
    if (context === undefined) {
        throw new Error("useTranslation must be used within an I18nProvider")
    }
    return context
}

// Alias for compatibility
export const useTranslations = (namespace?: string) => {
    const { t, locale, dir } = useTranslation()

    const translate = useCallback((key: string) => {
        const fullKey = namespace ? `${namespace}.${key}` : key
        return t(fullKey)
    }, [t, namespace])

    return translate
}

export function useLocale() {
    const { locale, setLocale, dir } = useTranslation()
    return { locale, setLocale, dir }
}
